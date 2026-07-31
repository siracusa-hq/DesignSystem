import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisplayMode } from './use-display-mode';

describe('useDisplayMode', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));
  });

  it('returns browser mode by default', () => {
    const { result } = renderHook(() => useDisplayMode());
    expect(result.current.displayMode).toBe('browser');
    expect(result.current.isStandalone).toBe(false);
    expect(result.current.isPWA).toBe(false);
  });

  it('detects standalone mode', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useDisplayMode());
    expect(result.current.displayMode).toBe('standalone');
    expect(result.current.isStandalone).toBe(true);
    expect(result.current.isPWA).toBe(true);
  });
});
