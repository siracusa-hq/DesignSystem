'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/cn';
import { useInView } from '../../../hooks/useInView';

export type ScrollAnimation = 'fade-up' | 'fade-in' | 'fade-down' | 'scale' | 'blur-in';

export interface AnimateOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  /** アニメーションの種類 */
  animation?: ScrollAnimation;
  /** stagger delay のインデックス（グリッド内の順番出現用） */
  staggerIndex?: number;
  /** 追加の遅延（ms） */
  delay?: number;
  /** IntersectionObserver の交差率 */
  threshold?: number;
  /** 一度だけ発火するか */
  once?: boolean;
  /** アニメーション時間（ms） */
  duration?: number;
  children: React.ReactNode;
}

const animationClasses: Record<ScrollAnimation, { initial: string; animate: string }> = {
  'fade-up': {
    initial: 'opacity-0 translate-y-8',
    animate: 'opacity-100 translate-y-0',
  },
  'fade-in': {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  'fade-down': {
    initial: 'opacity-0 -translate-y-4',
    animate: 'opacity-100 translate-y-0',
  },
  scale: {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
  },
  'blur-in': {
    initial: 'opacity-0 blur-sm',
    animate: 'opacity-100 blur-0',
  },
};

/**
 * スクロール連動アニメーションラッパー
 * IntersectionObserver で要素が画面内に入ったときにアニメーションを発火
 */
export const AnimateOnScroll = forwardRef<HTMLDivElement, AnimateOnScrollProps>(
  (
    {
      animation = 'fade-up',
      staggerIndex = 0,
      delay = 0,
      threshold = 0.1,
      once = true,
      duration = 600,
      className,
      children,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold, once });

    // forwardedRef と inViewRef を統合
    const combinedRef = (node: HTMLDivElement | null) => {
      (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const classes = animationClasses[animation];
    const totalDelay = delay + staggerIndex * 100;

    return (
      <div
        ref={combinedRef}
        className={cn(
          'transition-all ease-out',
          inView ? classes.animate : classes.initial,
          className,
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${totalDelay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AnimateOnScroll.displayName = 'AnimateOnScroll';
