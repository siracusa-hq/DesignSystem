import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Link } from './link';

describe('Link', () => {
  it('a要素としてレンダリングする', () => {
    render(<Link href="/docs">ドキュメント</Link>);
    const el = screen.getByText('ドキュメント');
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/docs');
  });

  it('arrowバリアントでSVGアイコンを表示する', () => {
    const { container } = render(
      <Link href="/more" variant="arrow">詳しく見る</Link>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('subtleバリアントを適用する', () => {
    const { container } = render(
      <Link href="/" variant="subtle">リンク</Link>,
    );
    expect(container.firstChild).toHaveClass('text-[var(--color-on-surface-secondary)]');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Link href="/test">アクセシブルリンク</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
