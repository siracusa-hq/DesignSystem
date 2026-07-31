import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useThrottle, useThrottledCallback } from './use-throttle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('hello', 250));
    expect(result.current).toBe('hello');
  });

  it('throttles rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      { initialProps: { value: 'a', interval: 250 } },
    );

    // Immediately update - within interval, so should be throttled
    rerender({ value: 'b', interval: 250 });
    expect(result.current).toBe('a');

    // Another rapid update
    rerender({ value: 'c', interval: 250 });
    expect(result.current).toBe('a');

    // After interval, the latest value should appear
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('c');
  });

  it('trailing edge fires after interval', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      { initialProps: { value: 'a', interval: 250 } },
    );

    // Rapid updates
    rerender({ value: 'b', interval: 250 });

    // Should not yet update (within interval)
    expect(result.current).toBe('a');

    // After interval elapses, trailing value appears
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('b');
  });
});

describe('useThrottledCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires immediately on first call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 250));

    act(() => {
      result.current('a');
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('a');
  });

  it('throttles subsequent calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 250));

    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });

    // First call fires immediately, rest are throttled
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('a');

    act(() => {
      vi.advanceTimersByTime(250);
    });
    // Trailing call should fire with last args
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('c');
  });

  it('cancel prevents pending invocation', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 250));

    act(() => {
      result.current('a'); // fires immediately
      result.current('b'); // queued
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(callback).toHaveBeenCalledTimes(1); // only the first call
  });

  it('flush triggers pending invocation immediately', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 250));

    act(() => {
      result.current('a'); // fires immediately
      result.current('b'); // queued
    });

    act(() => {
      result.current.flush();
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('b');
  });

  it('isPending returns correct state', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 250));

    expect(result.current.isPending()).toBe(false);

    act(() => {
      result.current('a'); // fires immediately
      result.current('b'); // queued - now pending
    });
    expect(result.current.isPending()).toBe(true);

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current.isPending()).toBe(false);
  });
});
