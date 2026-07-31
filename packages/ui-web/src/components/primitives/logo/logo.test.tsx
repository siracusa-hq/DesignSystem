import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Logo } from './logo';

describe('Logo', () => {
  it('SVG要素としてレンダリングする', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('aria-labelが設定される', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'Polastack');
  });

  it('markバリアントをレンダリングする', () => {
    const { container } = render(<Logo variant="mark" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
  });

  it('typeバリアントをレンダリングする', () => {
    const { container } = render(<Logo variant="type" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 140 32');
  });

  it('高さを指定できる', () => {
    const { container } = render(<Logo height={48} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Logo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
