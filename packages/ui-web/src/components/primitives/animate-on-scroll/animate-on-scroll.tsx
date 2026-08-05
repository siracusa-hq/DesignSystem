'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { useInView } from '@/hooks/useInView';
import styles from './animate-on-scroll.module.css';

export type ScrollAnimation = 'fade-up' | 'fade-in' | 'fade-down' | 'scale' | 'blur-in';

export interface AnimateOnScrollProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
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
  /** アニメーション時間（ms）。既定は演出系トークン --duration-reveal と同値 */
  duration?: number;
  children: React.ReactNode;
}

/** 画面外にいるときの初期状態。到達状態は共通の styles.visible が打ち消す */
const initialClasses: Record<ScrollAnimation, string> = {
  'fade-up': styles.fadeUp,
  'fade-in': styles.fadeIn,
  'fade-down': styles.fadeDown,
  scale: styles.scale,
  'blur-in': styles.blurIn,
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
      duration = 720,
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

    const totalDelay = delay + staggerIndex * 100;

    return (
      <div
        ref={combinedRef}
        className={cn(styles.base, initialClasses[animation], inView && styles.visible)}
        style={{
          // 時間と遅延はインスタンスごとに変わるため inline のまま
          // （カーブ = --ease-entrance は module 側。Material系 ease-out は
          //   600ms 超で序盤の減速が不足するため entrance カーブを使う）
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
