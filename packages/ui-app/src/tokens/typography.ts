/**
 * タイポグラフィトークン定数
 * CSS変数（globals.css @theme）と同期。
 */

export const fontFamily = {
  sans: "'Inter', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace",
} as const;

export const fontSize = {
  xs: { size: '0.75rem', lineHeight: '1rem' },
  sm: { size: '0.8125rem', lineHeight: '1.25rem' },
  base: { size: '0.875rem', lineHeight: '1.25rem' },
  lg: { size: '1rem', lineHeight: '1.5rem' },
  xl: { size: '1.125rem', lineHeight: '1.75rem' },
  '2xl': { size: '1.25rem', lineHeight: '1.75rem' },
  '3xl': { size: '1.5rem', lineHeight: '2rem' },
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
