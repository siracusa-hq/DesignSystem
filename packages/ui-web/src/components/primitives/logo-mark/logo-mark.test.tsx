import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { LogoMark } from './logo-mark';

describe('LogoMark', () => {
  it('src から画像を描画し、alt が付く', () => {
    render(<LogoMark src="/logo.svg" alt="タックスピア" />);
    expect(screen.getByRole('img', { name: 'タックスピア' })).toBeInTheDocument();
  });

  it('children で SVG を受け取れる', () => {
    render(
      <LogoMark>
        <svg data-testid="inline-logo" aria-label="Polastack" role="img" />
      </LogoMark>,
    );
    expect(screen.getByTestId('inline-logo')).toBeInTheDocument();
  });

  it('サイズクラスが適用される', () => {
    const { container } = render(<LogoMark size="lg" src="/l.svg" alt="x" />);
    expect(container.firstChild).toHaveClass('sizeLg');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<LogoMark src="/logo.svg" alt="タックスピア" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
