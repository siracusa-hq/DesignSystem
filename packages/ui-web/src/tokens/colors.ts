/**
 * カラートークン定数
 *
 * 値の正本は `@siracusahq/tokens`。@siracusahq/design-system（業務システムUI）と
 * 同じファイルを参照するため、両デザインシステムでブランドカラーが分岐しない。
 * CSS変数（styles/theme.css の @theme）との一致は tokens.test.ts が CI で検証する。
 *
 * ## primary と brand の使い分け（重要）
 *
 * - `primary`（#008575 アンカー）… **操作用**。ボタン背景・リンク・フォーカスリング。
 *   白文字との対比 4.55:1 で WCAG AA を満たす。
 * - `brand`（#13c3a0 アンカー）… **装飾用**。グラデーション・グロー・
 *   ダーク背景上のアクセント専用。白背景での対比は 2.25:1 しかないため、
 *   明背景のテキスト・ボタン背景に使ってはならない。
 */

import { primary, brand, neutral, success, warning, error, info } from '@siracusahq/tokens';

export const colors = {
  primary,
  brand,
  neutral,
  success,
  warning,
  error,
  info,
} as const;

export type ColorScale = keyof typeof colors;
export type ColorShade = keyof (typeof colors)['primary'];
