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
    expect(container.firstChild).toHaveClass('variantBeta');
  });

  it('className を受け付けない（迂回路を持たない）', () => {
    // @ts-expect-error className は公開 props に存在しない
    const el = <Badge className="ml-2">タグ</Badge>;
    expect(el).toBeTruthy();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Badge>アクセシブル</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
