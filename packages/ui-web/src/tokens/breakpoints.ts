/**
 * ブレークポイントトークン定数
 * マーケティングサイト向け4段階
 */

export const breakpoints = {
  /** モバイル: 0-639px */
  mobile: '0px',
  /** タブレット: 640px- */
  tablet: '640px',
  /** デスクトップ: 1024px- */
  desktop: '1024px',
  /** ワイド: 1280px- */
  wide: '1280px',
} as const;

export type Breakpoint = keyof typeof breakpoints;
