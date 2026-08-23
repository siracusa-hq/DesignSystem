/**
 * スペーシングトークン定数
 *
 * 4pxグリッドの基盤スケールは `@siracusahq/tokens` が正本。
 * セクション間余白・コンテナ幅は Web/LP 固有のためここで定義する。
 */

export { spacing, type Spacing } from '@siracusahq/tokens';

/**
 * セクションの垂直パディング（**片側**の値）。
 *
 * 読者が知覚する「セクション間の余白」は、隣り合う2つのセクションの
 * `padding-bottom + padding-top` = **この値の約2倍**になる。
 * 実測（research-eyebrow.md §4-2。国内13サイト）の「見出し上の実効余白」は
 * 中央値 96〜104px・最大 174px なので、片側は概ね 48〜80px が上限。
 *
 * この2倍を見落とすと余白が倍になる。実際、§4-2 は片側の値 6rem と
 * 実測の実効余白 96px を突き合わせて「一致・変更不要」と結論しており、
 * その結果 lg 同士の継ぎ目が実測の 2.5倍（256px）になっていた。
 */
export const sectionSpacing = {
  sm: '2.5rem',
  md: '3rem',
  lg: '4rem',
  xl: '5rem',
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
