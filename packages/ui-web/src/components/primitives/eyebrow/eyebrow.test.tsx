import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Eyebrow } from './eyebrow';

describe('Eyebrow', () => {
  it('テキストを描画する', () => {
    render(<Eyebrow>導入事例</Eyebrow>);
    expect(screen.getByText('導入事例')).toBeInTheDocument();
  });

  it('as で要素を切り替えられる', () => {
    const { container } = render(<Eyebrow as="p">Case Studies</Eyebrow>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('className を受け付けない（迂回路を持たない）', () => {
    // @ts-expect-error className は公開 props に存在しない
    const el = <Eyebrow className="mt-4">x</Eyebrow>;
    expect(el).toBeTruthy();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Eyebrow>導入事例</Eyebrow>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
