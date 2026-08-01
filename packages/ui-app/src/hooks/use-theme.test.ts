import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './use-theme';

describe('useTheme', () => {
  let matchMediaListeners: Array<(e: { matches: boolean }) => void>;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    matchMediaListeners = [];
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: false,
          media: query,
          addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => {
            matchMediaListeners.push(fn);
          },
          removeEventListener: (_: string, fn: (e: { matches: boolean }) => void) => {
            matchMediaListeners = matchMediaListeners.filter((l) => l !== fn);
          },
        }) as unknown as MediaQueryList,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to system theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('applies dark class when set to dark', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when set to light', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    act(() => result.current.setTheme('light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(localStorage.getItem('polastack-theme')).toBe('dark');
  });

  it('reads theme from localStorage on init', () => {
    localStorage.setItem('polastack-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('uses custom storage key', () => {
    const { result } = renderHook(() =>
      useTheme({ storageKey: 'custom-key' }),
    );
    act(() => result.current.setTheme('dark'));
    expect(localStorage.getItem('custom-key')).toBe('dark');
  });

  it('uses custom default theme', () => {
    const { result } = renderHook(() =>
      useTheme({ defaultTheme: 'dark' }),
    );
    expect(result.current.theme).toBe('dark');
  });

  it('responds to system theme changes when set to system', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('light');

    // Simulate system dark mode change
    act(() => {
      matchMediaListeners.forEach((fn) => fn({ matches: true }));
    });
    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
