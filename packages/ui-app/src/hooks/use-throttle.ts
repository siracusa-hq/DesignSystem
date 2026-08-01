import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Returns a throttled version of the value that updates
 * at most once per the specified interval.
 */
export function useThrottle<T>(value: T, interval = 250): T {
  const [throttled, setThrottled] = useState(value);
  const lastUpdated = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      setThrottled(value);
      lastUpdated.current = now;
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setThrottled(value);
        lastUpdated.current = Date.now();
        timerRef.current = null;
      }, interval - elapsed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, interval]);

  return throttled;
}

export interface ThrottledFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
}

/**
 * Returns a stable throttled version of the callback.
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  interval = 250,
): ThrottledFunction<T> {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const lastCalledRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);

  const throttled = useMemo(() => {
    const fn = (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastCalledRef.current;

      if (elapsed >= interval) {
        lastCalledRef.current = now;
        callbackRef.current(...args);
      } else {
        pendingArgsRef.current = args;
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            lastCalledRef.current = Date.now();
            const a = pendingArgsRef.current;
            pendingArgsRef.current = null;
            if (a) callbackRef.current(...a);
          }, interval - elapsed);
        }
      }
    };

    fn.cancel = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      pendingArgsRef.current = null;
    };

    fn.flush = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const a = pendingArgsRef.current;
      pendingArgsRef.current = null;
      if (a) {
        lastCalledRef.current = Date.now();
        callbackRef.current(...a);
      }
    };

    fn.isPending = () => timerRef.current !== null;

    return fn as ThrottledFunction<T>;
  }, [interval]);

  useEffect(() => {
    return () => throttled.cancel();
  }, [throttled]);

  return throttled;
}
