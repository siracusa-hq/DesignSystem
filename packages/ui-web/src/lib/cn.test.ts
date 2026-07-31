import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('クラス名を結合する', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('条件付きクラス名を処理する', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('Tailwindクラスの競合を解決する', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
  });

  it('undefinedを無視する', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });
});
