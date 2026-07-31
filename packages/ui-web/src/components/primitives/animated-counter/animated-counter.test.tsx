import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AnimatedCounter } from './animated-counter';

describe('AnimatedCounter', () => {
  it('span要素としてレンダリングする', () => {
    const { container } = render(<AnimatedCounter value={100} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('prefixとsuffixを表示する', () => {
    const { container } = render(
      <AnimatedCounter value={99} prefix="¥" suffix="+" />,
    );
    const text = container.textContent;
    expect(text).toContain('¥');
    expect(text).toContain('+');
  });

  it('tabular-numsクラスが適用される', () => {
    const { container } = render(<AnimatedCounter value={42} />);
    expect(container.firstChild).toHaveClass('tabular-nums');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<AnimatedCounter value={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
