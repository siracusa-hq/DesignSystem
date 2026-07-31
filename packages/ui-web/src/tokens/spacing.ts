/**
 * スペーシングトークン定数
 * 4pxグリッドベース + マーケティング向けセクション間余白・コンテナ幅
 */

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

/** セクション間の垂直余白 */
export const sectionSpacing = {
  sm: '5rem',
  md: '6rem',
  lg: '8rem',
  xl: '10rem',
} as const;

/** コンテナの最大幅 */
export const containerWidth = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;
