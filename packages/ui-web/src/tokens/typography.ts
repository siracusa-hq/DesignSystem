/**
 * タイポグラフィトークン定数
 * マーケティング向け拡張スケール: base=16px, display系は72pxまで
 * 業務UI（base=14px, max=24px）とは独立した設計。
 */

export const fontFamily = {
  sans: "'Inter', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace",
} as const;

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

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
