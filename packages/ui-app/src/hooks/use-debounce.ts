import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Returns a debounced version of the value that only updates
 * after the specified delay has passed without changes.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
}

/**
 * Returns a stable debounced version of the callback.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 500,
): DebouncedFunction<T> {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);

  const debounced = useMemo(() => {
    const fn = (...args: Parameters<T>) => {
      pendingArgsRef.current = args;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const a = pendingArgsRef.current;
        pendingArgsRef.current = null;
        if (a) callbackRef.current(...a);
      }, delay);
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
      if (a) callbackRef.current(...a);
    };

    fn.isPending = () => timerRef.current !== null;

    return fn as DebouncedFunction<T>;
  }, [delay]);

  useEffect(() => {
    return () => debounced.cancel();
  }, [debounced]);

  return debounced;
}
