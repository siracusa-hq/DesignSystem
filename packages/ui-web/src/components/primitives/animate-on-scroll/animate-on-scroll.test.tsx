import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AnimateOnScroll } from './animate-on-scroll';

describe('AnimateOnScroll', () => {
  it('子要素をレンダリングする', () => {
    render(<AnimateOnScroll>テスト</AnimateOnScroll>);
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('初期状態で非表示クラスが適用される', () => {
    render(<AnimateOnScroll data-testid="aos">コンテンツ</AnimateOnScroll>);
    const el = screen.getByTestId('aos');
    expect(el.className).toContain('opacity-0');
  });

  it('カスタムクラスが適用される', () => {
    render(<AnimateOnScroll className="custom-class">コンテンツ</AnimateOnScroll>);
    const el = screen.getByText('コンテンツ').closest('div');
    expect(el?.className).toContain('custom-class');
  });

  it('staggerIndex でトランジション遅延が設定される', () => {
    render(<AnimateOnScroll staggerIndex={3} data-testid="aos">コンテンツ</AnimateOnScroll>);
    const el = screen.getByTestId('aos');
    expect(el.style.transitionDelay).toBe('300ms');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<AnimateOnScroll>アクセシブルなコンテンツ</AnimateOnScroll>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
