/**
 * グラデーショントークン定数
 * マーケティングサイト固有の装飾要素
 *
 * グラデーションは装飾であり、テキストや操作の意味を担わない。
 * よって彩度の高い `brand` スケール（#13c3a0 系）を使う。
 * 操作UI（ボタン背景・リンク）には `primary` を使うこと。
 */

import { brand, neutral, info } from '@polastack/tokens';

export const gradients = {
  /** ブランドグラデーション（ティール系） */
  brand: `linear-gradient(135deg, ${brand[500]}, ${brand[400]})`,
  /** ブランドグラデーション（薄め・背景用） */
  brandSubtle: `linear-gradient(135deg, ${brand[50]}, ${brand[100]})`,

  /** ダーク背景用グロー（ブランド） */
  glowBrand: 'radial-gradient(ellipse at center, rgba(19,195,160,0.15), transparent 70%)',
  /** @deprecated `glowBrand` を使うこと。装飾グローは brand スケール由来のため改名した */
  glowPrimary: 'radial-gradient(ellipse at center, rgba(19,195,160,0.15), transparent 70%)',
  /** ダーク背景用グロー（アクセント） */
  glowAccent: 'radial-gradient(ellipse at center, rgba(59,130,246,0.1), transparent 70%)',

  /** セクション背景（ダーク） */
  sectionDark: `linear-gradient(180deg, ${neutral[950]}, ${neutral[900]})`,
  /** セクション背景（ライト） */
  sectionLight: `linear-gradient(180deg, #ffffff, ${neutral[50]})`,

  /** テキストグラデーション（ブランド） */
  textBrand: `linear-gradient(90deg, ${brand[500]}, ${info[500]})`,
  /** テキストグラデーション（ニュートラル） */
  textNeutral: `linear-gradient(90deg, ${neutral[50]}, ${neutral[400]})`,
} as const;

export type GradientName = keyof typeof gradients;
