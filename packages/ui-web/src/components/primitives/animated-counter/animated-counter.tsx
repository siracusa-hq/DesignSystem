'use client';

import * as React from 'react';
import styles from './animated-counter.module.css';

export interface AnimatedCounterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
  /** 表示する最終値 */
  value: number;
  /** アニメーション時間（ms） */
  duration?: number;
  /** 数値フォーマット（ロケール対応） */
  locale?: string;
  /** 接頭辞（例: "¥"） */
  prefix?: string;
  /** 接尾辞（例: "%", "+"） */
  suffix?: string;
  /** 小数点以下の桁数 */
  decimals?: number;
}

/**
 * OS の「視差効果を減らす」設定を見る。
 *
 * このコンポーネントのカウントアップは `requestAnimationFrame` による **JS 実装**なので、
 * `theme.css` の `@media (prefers-reduced-motion: reduce)`（CSS の duration を 1ms に落とす）は
 * 届かない。JS 側で自分で判定する必要がある（stage5-workorder.md §7-1）。
 *
 * SSR では `window` が無いため false（= 通常のアニメーション経路）を返し、
 * 判定はクライアントの effect 内でだけ行う。
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    { value, duration = 2000, locale = 'ja-JP', prefix = '', suffix = '', decimals = 0, ...props },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    const [hasAnimated, setHasAnimated] = React.useState(false);
    const elementRef = React.useRef<HTMLSpanElement>(null);

    const combinedRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        (elementRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      const el = elementRef.current;
      if (!el || hasAnimated) return;

      /* 動きを減らす設定では数え上げを行わず、最初から最終値を出す。
         初期値は SSR と同じ 0 のままにして effect で確定させるので、
         ハイドレーションの不一致は起きない */
      if (prefersReducedMotion()) {
        setHasAnimated(true);
        setDisplayValue(value);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(eased * value);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        },
        { threshold: 0.1 },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [value, duration, hasAnimated]);

    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(displayValue);

    return (
      <span ref={combinedRef} className={styles.counter} {...props}>
        {prefix}
        {formatted}
        {suffix}
      </span>
    );
  },
);
AnimatedCounter.displayName = 'AnimatedCounter';
