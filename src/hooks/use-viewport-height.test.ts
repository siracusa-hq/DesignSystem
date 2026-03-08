import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useViewportHeight } from './use-viewport-height';

describe('useViewportHeight', () => {
  it('returns a numeric viewport height', () => {
    const { result } = renderHook(() => useViewportHeight());
    expect(typeof result.current).toBe('number');
    expect(result.current).toBeGreaterThan(0);
  });
});
