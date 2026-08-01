import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './badge';

describe('Badge', () => {
  it('テキストをレンダリングする', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('variantを適用する', () => {
    const { container } = render(<Badge variant="beta">Beta</Badge>);
    expect(container.firstChild).toHaveClass('bg-info-100');
  });

  it('カスタムclassNameを追加できる', () => {
    const { container } = render(<Badge className="ml-2">タグ</Badge>);
    expect(container.firstChild).toHaveClass('ml-2');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Badge>アクセシブル</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
