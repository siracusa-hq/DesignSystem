'use client';

import { useState, useEffect } from 'react';

export type DisplayMode = 'standalone' | 'minimal-ui' | 'fullscreen' | 'browser';

function getDisplayMode(): DisplayMode {
  if (typeof window === 'undefined') return 'browser';

  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';

  return 'browser';
}

/**
 * PWAの表示モードを検出するフック。
 * standalone / minimal-ui / fullscreen / browser を返す。
 */
export function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(getDisplayMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    function handleChange() {
      setDisplayMode(getDisplayMode());
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    displayMode,
    isStandalone: displayMode === 'standalone',
    isPWA: displayMode !== 'browser',
  };
}
