import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StatsSection } from './stats-section';

const stats = [
  { value: '3-5週間', label: '開発期間', description: '従来比70%短縮' },
  { value: '8', label: '統合モジュール' },
  { value: '99.9%', label: 'SLA' },
];

describe('StatsSection', () => {
  it('全数値を表示する', () => {
    render(<StatsSection stats={stats} />);
    expect(screen.getByText('3-5週間')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('ラベルを表示する', () => {
    render(<StatsSection stats={stats} />);
    expect(screen.getByText('開発期間')).toBeInTheDocument();
    expect(screen.getByText('統合モジュール')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<StatsSection title="実績" stats={stats} />);
    expect(screen.getByText('実績')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<StatsSection stats={stats} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<StatsSection stats={stats} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
