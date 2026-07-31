/**
 * タイポグラフィ基盤トークン（ブランド共通）
 *
 * フォントファミリとウェイトのみを共通化する。
 * **フォントサイズスケールは意図的に共通化しない** —
 * 業務システムUIは base=14px / 最大24px、Web/LPは base=16px / 最大72px と
 * 設計思想が異なるため、各パッケージが独自に定義する。
 */

export const fontFamily = {
  sans: "'Inter', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace",
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export type FontFamily = keyof typeof fontFamily;
export type FontWeight = keyof typeof fontWeight;
