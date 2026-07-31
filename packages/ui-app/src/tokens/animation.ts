/**
 * アニメーショントークン
 *
 * duration / easing の正本は `@polastack/tokens`。
 * z-index は業務システムUI固有の3層体系のためここで定義する。
 */

export { duration, easing, type Duration, type Easing } from '@polastack/tokens';

/**
 * z-index スケール（3層体系）
 *
 * styles/tokens.css の `--z-index-*` と同じ値。
 * in-flow（ページ内容）/ backdrop floating（背景遮断）/
 * floating overlays（Modal の上に積む portal）の3層に分かれる。
 *
 * 詳細: docs/z-index-system.md
 */
export const zIndex = {
  /* In-flow layers */
  base: 0,
  content: 1,
  sticky: 10,
  header: 20,
  overlayInline: 30,

  /* Backdrop floating */
  drawer: 1100,
  modal: 1200,

  /* Floating overlays */
  popover: 1300,
  dropdown: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

export type ZIndex = keyof typeof zIndex;
