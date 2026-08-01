/**
 * エレベーショントークン定数
 *
 * 基盤スケールの正本は `@polastack/tokens`。
 * グロー効果は Web/LP 固有のためここで追加する。
 *
 * グローは装飾（ハロー）であり文字や図形の輪郭を担わないため、
 * 彩度の高い brand スケール（#13c3a0 / rgb(19 195 160)）を使う。
 * キー名の `glow-primary` は既存consumerとの互換のため据え置いている。
 */

import { shadows as baseShadows, radii } from '@polastack/tokens';

export const shadows = {
  ...baseShadows,
  /** ブランドアクセントのグロー（CTA・ホバー用） */
  'glow-primary': '0 0 24px rgb(19 195 160 / 0.25)',
  /** ブランドアクセントのグロー（大） */
  'glow-primary-lg': '0 0 48px rgb(19 195 160 / 0.3)',
} as const;

export { radii };

export type Shadow = keyof typeof shadows;
export type { Radius } from '@polastack/tokens';
