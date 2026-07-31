/**
 * グラデーショントークン定数
 * マーケティングサイト固有の装飾要素
 */

export const gradients = {
  /** ブランドグラデーション（ティール系） */
  brand: 'linear-gradient(135deg, #13c3a0, #2ee0bc)',
  /** ブランドグラデーション（薄め・背景用） */
  brandSubtle: 'linear-gradient(135deg, #f2fdfb, #dbfaf4)',

  /** ダーク背景用グロー（プライマリ） */
  glowPrimary: 'radial-gradient(ellipse at center, rgba(19,195,160,0.15), transparent 70%)',
  /** ダーク背景用グロー（アクセント） */
  glowAccent: 'radial-gradient(ellipse at center, rgba(59,130,246,0.1), transparent 70%)',

  /** セクション背景（ダーク） */
  sectionDark: 'linear-gradient(180deg, #09090b, #18181b)',
  /** セクション背景（ライト） */
  sectionLight: 'linear-gradient(180deg, #ffffff, #fafafa)',

  /** テキストグラデーション（ブランド） */
  textBrand: 'linear-gradient(90deg, #13c3a0, #3b82f6)',
  /** テキストグラデーション（ニュートラル） */
  textNeutral: 'linear-gradient(90deg, #fafafa, #a1a1aa)',
} as const;

export type GradientName = keyof typeof gradients;
