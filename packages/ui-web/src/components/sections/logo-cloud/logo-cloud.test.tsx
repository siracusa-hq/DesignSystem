import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { LogoCloud } from './logo-cloud';

const logos = [
  { name: 'Company A', logo: <span>Logo A</span> },
  { name: 'Company B', logo: <span>Logo B</span> },
];

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

  it('scrollingモードでロゴを複製する', () => {
    render(<LogoCloud logos={logos} scrolling />);
    const allLogoA = screen.getAllByText('Logo A');
    expect(allLogoA.length).toBe(3);
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
