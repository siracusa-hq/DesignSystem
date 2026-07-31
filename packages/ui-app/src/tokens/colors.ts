/**
 * カラートークン定数
 *
 * 値の正本は `@polastack/tokens`。ここでは値を複製せず、
 * 業務システムUIが使うスケールだけを選んで再構成する。
 * CSS変数（styles/tokens.css の @theme）との一致は
 * tokens.test.ts が CI で検証する。
 *
 * スタイリングにはTailwindユーティリティクラス（bg-primary-500等）を推奨。
 *
 * 装飾用の `brand` スケール（#13c3a0 系）は Web/LP 専用のため、
 * 業務システムUIでは意図的に公開していない。
 */

import { primary, neutral, success, warning, error, info } from '@polastack/tokens';

export const colors = {
  primary,
  neutral,
  success,
  warning,
  error,
  info,
} as const;

export type ColorScale = keyof typeof colors;
export type ColorShade = keyof (typeof colors)['primary'];
