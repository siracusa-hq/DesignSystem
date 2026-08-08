import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AnimatedCounter } from './animated-counter';

/**
 * matchMedia を差し替える。jsdom の既定は常に matches: false なので、
 * 「動きを減らす」設定を明示的に作り出す必要がある。
 */
function mockPrefersReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: reduce && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AnimatedCounter', () => {
  it('span要素としてレンダリングする', () => {
    const { container } = render(<AnimatedCounter value={100} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('prefixとsuffixを表示する', () => {
    const { container } = render(<AnimatedCounter value={99} prefix="¥" suffix="+" />);
    const text = container.textContent;
    expect(text).toContain('¥');
    expect(text).toContain('+');
  });

  it('等幅数字のクラスが適用される', () => {
    const { container } = render(<AnimatedCounter value={42} />);
    expect(container.firstChild).toHaveClass('counter');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<AnimatedCounter value={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

/**
 * prefers-reduced-motion 対応（stage5-workorder.md §7-1 の実装漏れ修正）。
 *
 * カウントアップは rAF による JS 実装なので、theme.css の
 * `@media (prefers-reduced-motion: reduce)` では止まらない。JS 側で判定する。
 */
describe('AnimatedCounter の reduced-motion 対応（Stage 5 Slice 1）', () => {
  it('動きを減らす設定では IntersectionObserver を待たずに最終値を表示する', () => {
    mockPrefersReducedMotion(true);
    const { container } = render(<AnimatedCounter value={1200} prefix="約" suffix="社" />);
    // setup.ts の IntersectionObserver モックはコールバックを発火しないため、
    // ここで最終値が出ているなら「rAF 経路を通っていない」ことの証明になる
    expect(container.textContent).toBe('約1,200社');
  });

  it('動きを減らす設定でも小数桁の指定を守る', () => {
    mockPrefersReducedMotion(true);
    const { container } = render(<AnimatedCounter value={99.9} decimals={1} suffix="%" />);
    expect(container.textContent).toBe('99.9%');
  });

  it('通常設定では 0 から始まる（交差するまで数え上げない）', () => {
    mockPrefersReducedMotion(false);
    const { container } = render(<AnimatedCounter value={1200} suffix="社" />);
    expect(container.textContent).toBe('0社');
  });

  it('matchMedia が無い環境（SSR 相当）でも落ちない', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { container } = render(<AnimatedCounter value={1200} suffix="社" />);
    expect(container.textContent).toBe('0社');
  });
});
