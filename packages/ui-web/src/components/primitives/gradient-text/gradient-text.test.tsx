import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { GradientText } from './gradient-text';

describe('GradientText', () => {
  it('テキストをレンダリングする', () => {
    render(<GradientText>Polastack</GradientText>);
    expect(screen.getByText('Polastack')).toBeInTheDocument();
  });

  it('bg-clip-textクラスが適用される', () => {
    const { container } = render(<GradientText>テキスト</GradientText>);
    expect(container.firstChild).toHaveClass('bg-clip-text');
    expect(container.firstChild).toHaveClass('text-transparent');
  });

  it('as propでタグを変更できる', () => {
    render(<GradientText as="h1">見出し</GradientText>);
    const el = screen.getByText('見出し');
    expect(el.tagName).toBe('H1');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<GradientText as="span">アクセシブル</GradientText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
