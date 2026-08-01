'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** 発火するための交差率（0-1） */
  threshold?: number;
  /** ルート要素からのマージン */
  rootMargin?: string;
  /** 一度だけ発火するか */
  once?: boolean;
}

/**
 * IntersectionObserver ベースの表示検知フック
 * スクロール連動アニメーション用
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
