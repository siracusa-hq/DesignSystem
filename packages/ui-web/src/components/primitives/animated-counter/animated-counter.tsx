'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export interface AnimatedCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
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

export const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      className,
      value,
      duration = 2000,
      locale = 'ja-JP',
      prefix = '',
      suffix = '',
      decimals = 0,
      ...props
    },
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
      <span ref={combinedRef} className={cn('tabular-nums', className)} {...props}>
        {prefix}
        {formatted}
        {suffix}
      </span>
    );
  },
);
AnimatedCounter.displayName = 'AnimatedCounter';
