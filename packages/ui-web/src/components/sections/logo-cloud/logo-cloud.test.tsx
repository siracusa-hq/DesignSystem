import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { LogoCloud } from './logo-cloud';

const logos = [
  { name: 'Company A', node: <span>Logo A</span> },
  { name: 'Company B', node: <span>Logo B</span> },
];

/** 自動スクロールの閾値（8件）を越える件数 */
const manyLogos = Array.from({ length: 8 }, (_, i) => ({
  name: `Company ${i}`,
  node: <span>{`Logo ${i}`}</span>,
}));

describe('LogoCloud', () => {
  it('全ロゴを表示する', () => {
    render(<LogoCloud logos={logos} />);
    expect(screen.getByText('Logo A')).toBeInTheDocument();
    expect(screen.getByText('Logo B')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<LogoCloud title="導入企業" logos={logos} />);
    expect(screen.getByText('導入企業')).toBeInTheDocument();
  });

  it('8件未満は静的な帯で表示する', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('.row')).toBeInTheDocument();
    expect(container.querySelector('.marquee')).not.toBeInTheDocument();
  });

  it('8件以上で自動的にスクロール表示になり、ロゴを3周ぶん複製する', () => {
    const { container } = render(<LogoCloud logos={manyLogos} />);
    expect(container.querySelector('.marquee')).toBeInTheDocument();
    expect(screen.getAllByText('Logo 0')).toHaveLength(3);
  });

  it('ロゴを LogoMark で包む（高さ・彩度の正規化）', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelectorAll('.logoMark')).toHaveLength(2);
    expect(container.querySelector('.logoMark')).toHaveClass('grayscale');
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
