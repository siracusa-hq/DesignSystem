'use client';

import { useState, useEffect } from 'react';

/**
 * モバイルブラウザのアドレスバーを考慮した実際のビューポート高さを返すフック。
 * CSS の 100dvh が利用可能な場合はそちらを推奨するが、
 * JS側でピクセル値が必要な場合に使用する。
 */
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 0,
  );

  useEffect(() => {
    function handleResize() {
      setViewportHeight(window.innerHeight);
    }

    // visualViewport APIが利用可能な場合（モバイルブラウザ）はそちらを使用
    const viewport = window.visualViewport;
    if (viewport) {
      const handleViewportResize = () => {
        setViewportHeight(viewport.height);
      };
      handleViewportResize();
      viewport.addEventListener('resize', handleViewportResize);
      return () => viewport.removeEventListener('resize', handleViewportResize);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportHeight;
}
