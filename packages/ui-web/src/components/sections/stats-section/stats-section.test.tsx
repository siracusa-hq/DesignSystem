import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StatsSection } from './stats-section';

const stats = [
  { value: '3-5週間', label: '開発期間', description: '従来比70%短縮' },
  { value: '8', label: '統合モジュール' },
  { value: '99.9%', label: 'SLA' },
];

/** 時点表記の dev 警告を鳴らさない基準時点（景表法対応） */
const asOf = '2026年7月時点';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('StatsSection', () => {
  it('全数値を表示する', () => {
    render(<StatsSection stats={stats} asOf={asOf} />);
    expect(screen.getByText('3-5週間')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('ラベルを表示する', () => {
    render(<StatsSection stats={stats} asOf={asOf} />);
    expect(screen.getByText('開発期間')).toBeInTheDocument();
    expect(screen.getByText('統合モジュール')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<StatsSection title="実績" stats={stats} asOf={asOf} />);
    expect(screen.getByText('実績')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<StatsSection stats={stats} asOf={asOf} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<StatsSection stats={stats} asOf={asOf} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('時点表記（asOf・Stage 5 Slice 1）', () => {
  it('asOf を caption として表示する', () => {
    const { container } = render(<StatsSection stats={stats} asOf={asOf} />);
    const caption = screen.getByText(asOf);
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveClass('caption');
    // 注記の枠に収まる（数値グリッドの下）
    expect(container.querySelector('.note')).toContainElement(caption);
  });

  it('asOf と note を並べて表示する（時点 → 出典の順）', () => {
    const { container } = render(
      <StatsSection stats={stats} asOf={asOf} note="当社調べ（回答412件）" />,
    );
    const texts = [...container.querySelectorAll('.note > *')].map((el) => el.textContent);
    expect(texts).toEqual([asOf, '当社調べ（回答412件）']);
  });

  it('asOf も note も無いと dev 警告を出す（景品表示法）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<StatsSection stats={stats} />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('時点表記');
    expect(warn.mock.calls[0][0]).toContain('景品表示法');
  });

  it('asOf を渡せば警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<StatsSection stats={stats} asOf={asOf} />);
    expect(warn).not.toHaveBeenCalled();
  });

  it('時点を自由文の note に書いている既存ページでは警告しない（誤発火の回避）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<StatsSection stats={stats} note="※2026年7月末時点。当社調べ。" />);
    expect(warn).not.toHaveBeenCalled();
  });
});
