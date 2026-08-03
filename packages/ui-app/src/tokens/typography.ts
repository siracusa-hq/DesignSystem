/**
 * タイポグラフィトークン定数
 *
 * フォントファミリ・ウェイトの正本は `@siracusahq/tokens`。
 * フォントサイズだけは業務システムUI固有（base=14px / 最大24px、
 * BtoB業務アプリの高密度表示向け）のためここで定義する。
 */

export { fontFamily, fontWeight, type FontWeight } from '@siracusahq/tokens';

export const fontSize = {
  xs: { size: '0.75rem', lineHeight: '1rem' },
  sm: { size: '0.8125rem', lineHeight: '1.25rem' },
  base: { size: '0.875rem', lineHeight: '1.25rem' },
  lg: { size: '1rem', lineHeight: '1.5rem' },
  xl: { size: '1.125rem', lineHeight: '1.75rem' },
  '2xl': { size: '1.25rem', lineHeight: '1.75rem' },
  '3xl': { size: '1.5rem', lineHeight: '2rem' },
} as const;

export type FontSize = keyof typeof fontSize;
