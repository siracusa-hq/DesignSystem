import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Container } from './container';

describe('Container', () => {
  it('子要素をレンダリングする', () => {
    render(<Container>コンテンツ</Container>);
    expect(screen.getByText('コンテンツ')).toBeInTheDocument();
  });

  it('サイズバリアントを適用する', () => {
    const { container } = render(<Container size="sm">内容</Container>);
    expect(container.firstChild).toHaveClass('max-w-[var(--container-sm)]');
  });

  it('カスタムclassNameを追加できる', () => {
    const { container } = render(<Container className="custom-class">内容</Container>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Container>アクセシブルなコンテンツ</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
