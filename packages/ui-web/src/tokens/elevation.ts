/**
 * エレベーショントークン定数
 *
 * 基盤スケール（xs〜2xl / radii 基本形）の正本は `@siracusahq/tokens`。
 * Web/LP 固有の拡張をここで行う:
 *
 * - **2層シャドウ**（raised / card / card-hover / overlay）… LPの「浮いたカード」用。
 *   近接の濃い影 + 遠くの薄い影の重ねで、単層より面積の大きい要素に馴染む。
 *   影色は neutral-900 由来（純黒は明るい面で濁る）。
 *   規則: 暗い面では影を使わない（border + 内側ハイライトで段差を作る）。
 *   ホバーで影を強めるときは必ず translate と組にする（影だけ変えると滲んで見える）。
 * - **役割名ラディウス**（control / media / card / panel / pill）… 選択肢ではなく
 *   役割から形状が決まる。入れ子の規則: 内側の半径 > 外側の半径 は禁止。
 * - グロー … 装飾（ハロー）のため brand スケール由来（rgb(19 195 160)）。
 *   キー名の `glow-primary` は既存consumerとの互換のため据え置いている。
 */

import { shadows as baseShadows, radii as baseRadii } from '@siracusahq/tokens';

export const shadows = {
  ...baseShadows,
  /** ブランドアクセントのグロー（CTA・ホバー用） */
  'glow-primary': '0 0 24px rgb(19 195 160 / 0.25)',
  /** ブランドアクセントのグロー（大） */
  'glow-primary-lg': '0 0 48px rgb(19 195 160 / 0.3)',
  /** バッジ・小要素 */
  raised: '0 1px 2px rgb(24 24 27 / 0.04), 0 2px 6px rgb(24 24 27 / 0.04)',
  /** カード静止時 */
  card: '0 2px 4px rgb(24 24 27 / 0.04), 0 8px 24px rgb(24 24 27 / 0.06)',
  /** カードホバー（translate と組で使う） */
  'card-hover': '0 4px 8px rgb(24 24 27 / 0.05), 0 16px 40px rgb(24 24 27 / 0.1)',
  /** ドロップダウン・固定ヘッダー */
  overlay: '0 8px 16px rgb(24 24 27 / 0.08), 0 24px 56px rgb(24 24 27 / 0.14)',
} as const;

export const radii = {
  ...baseRadii,
  /** ボタン・入力・小バッジ */
  control: '0.75rem',
  /** 画像・スクリーンショット・動画 */
  media: '1rem',
  /** カード・テスティモニアル・事例 */
  card: '1.25rem',
  /** 大面（料金カード・コードブロック） */
  panel: '1.5rem',
  /** タグ・ロゴピル・eyebrow */
  pill: '9999px',
} as const;

export type Shadow = keyof typeof shadows;
export type Radius = keyof typeof radii;
