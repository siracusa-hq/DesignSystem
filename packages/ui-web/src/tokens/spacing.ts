/**
 * スペーシングトークン定数
 *
 * 4pxグリッドの基盤スケールは `@siracusahq/tokens` が正本。
 * セクション間余白・コンテナ幅は Web/LP 固有のためここで定義する。
 */

export { spacing, type Spacing } from '@siracusahq/tokens';

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

export type SectionSpacing = keyof typeof sectionSpacing;
export type ContainerWidth = keyof typeof containerWidth;
