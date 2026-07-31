import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Heading } from './heading';

describe('Heading', () => {
  it('デフォルトでh2要素としてレンダリングする', () => {
    render(<Heading>見出し</Heading>);
    const el = screen.getByText('見出し');
    expect(el.tagName).toBe('H2');
  });

  it('as propでタグを変更できる', () => {
    render(<Heading as="h1">H1見出し</Heading>);
    const el = screen.getByText('H1見出し');
    expect(el.tagName).toBe('H1');
  });

  it('sizeバリアントを適用する', () => {
    const { container } = render(<Heading size="display-2xl">大見出し</Heading>);
    expect(container.firstChild).toHaveClass('lg:text-display-2xl');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Heading as="h1">アクセシブルな見出し</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
