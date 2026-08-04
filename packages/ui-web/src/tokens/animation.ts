/**
 * アニメーショントークン定数
 *
 * 操作フィードバック系（fast〜slower）の正本は `@siracusahq/tokens`。
 * Web/LP 固有の**演出系**（スクロール表出・装飾ループ）をここで拡張する。
 * 操作と演出は仕事が違う: 操作は 100〜300ms + Material 系カーブ、
 * 演出は 400ms 超 + 減速の強いカーブ（entrance = ease-out-expo）。
 * 既存4種のカーブを 600ms 超で使うと序盤の減速が足りず「もったり」見える。
 *
 * z-index は Web/LP 固有の体系（header / mobileMenu / modal）のためここで定義する。
 */

import { duration as baseDuration, easing as baseEasing } from '@siracusahq/tokens';

export const duration = {
  ...baseDuration,
  /** スクロール表出（AnimateOnScroll の既定） */
  reveal: '720ms',
  /** 装飾のループ（グロー明滅等） */
  ambient: '1200ms',
} as const;

export const easing = {
  ...baseEasing,
  /** 表出用（ease-out-quart）。reveal と組で使う。
      expo(0.16,1,0.3,1) は立ち上がりが急すぎるというブランド側フィードバックで quart に変更 */
  entrance: 'cubic-bezier(0.25, 1, 0.5, 1)',
  /** 退出用 */
  exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
  /** オーバーシュート。CTA の強調のみに使う */
  emphasis: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;

export const zIndex = {
  header: 100,
  mobileMenu: 200,
  modal: 300,
} as const;

export type ZIndex = keyof typeof zIndex;
