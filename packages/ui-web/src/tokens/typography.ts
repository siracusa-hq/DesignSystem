/**
 * タイポグラフィトークン定数
 *
 * フォントファミリ・ウェイトの正本は `@siracusahq/tokens`。
 * フォントサイズだけは Web/LP 固有（base=16px、display系は72pxまで）のため
 * ここで定義する。業務UI（base=14px, max=24px）とは独立した設計。
 */

export { fontFamily, fontWeight, type FontWeight } from '@siracusahq/tokens';

export const fontSize = {
  caption: { size: '0.75rem', lineHeight: '1rem' },
  'body-sm': { size: '0.875rem', lineHeight: '1.5rem' },
  'body-md': { size: '1rem', lineHeight: '1.75rem' },
  'body-lg': { size: '1.125rem', lineHeight: '1.875rem' },
  'heading-sm': { size: '1.125rem', lineHeight: '1.5rem' },
  'heading-md': { size: '1.25rem', lineHeight: '1.75rem' },
  'heading-lg': { size: '1.5rem', lineHeight: '2rem' },
  'display-sm': { size: '1.875rem', lineHeight: '2.25rem' },
  'display-md': { size: '2.25rem', lineHeight: '2.75rem' },
  'display-lg': { size: '3rem', lineHeight: '3.5rem' },
  'display-xl': { size: '3.75rem', lineHeight: '4.25rem' },
  'display-2xl': { size: '4.5rem', lineHeight: '5rem' },
} as const;

export type FontSize = keyof typeof fontSize;
