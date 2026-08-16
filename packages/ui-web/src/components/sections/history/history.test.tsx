import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { HistorySection, type HistoryEvent } from './history';

const events: HistoryEvent[] = [
  { year: 2024, month: 4, text: 'シラクサ株式会社を設立' },
  { year: 2026, month: 7, text: 'SOC 2 Type II 報告書を取得' },
  { year: 2025, month: 11, text: 'シードラウンドで資金調達を実施' },
];

/** 描画された行の「年 + 出来事」を上から拾う */
function rowsOf(container: HTMLElement) {
  return [...container.querySelectorAll('.row')].map((r) => r.textContent);
}

describe('HistorySection', () => {
  it('出来事をすべて出す', () => {
    render(<HistorySection title="沿革" events={events} />);
    events.forEach((e) => expect(screen.getByText(e.text)).toBeInTheDocument());
  });

  it('既定は新しい順（desc）', () => {
    const { container } = render(<HistorySection title="沿革" events={events} />);
    expect(rowsOf(container)[0]).toContain('SOC 2 Type II 報告書を取得');
    expect(rowsOf(container)[2]).toContain('シラクサ株式会社を設立');
  });

  it('order="asc" で古い順にする', () => {
    const { container } = render(<HistorySection title="沿革" events={events} order="asc" />);
    expect(rowsOf(container)[0]).toContain('シラクサ株式会社を設立');
    expect(rowsOf(container)[2]).toContain('SOC 2 Type II 報告書を取得');
  });

  it('渡された配列を書き換えない（利用側の状態を壊さない）', () => {
    const input = [...events];
    render(<HistorySection events={input} />);
    expect(input).toEqual(events);
  });

  it('月を省略できる', () => {
    const { container } = render(<HistorySection events={[{ year: 2024, text: '設立' }]} />);
    expect(container.querySelector('.month')).toBeNull();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('formatMonth で月の表記を差し替えられる', () => {
    render(
      <HistorySection
        events={[{ year: 2024, month: 4, text: 'Founded' }]}
        formatMonth={(m) => `/${m}`}
      />,
    );
    expect(screen.getByText('/4')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<HistorySection title="沿革" events={events} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
