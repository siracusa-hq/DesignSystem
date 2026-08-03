/**
 * アニメーショントークン定数
 *
 * duration / easing の正本は `@siracusahq/tokens`。
 * z-index は Web/LP 固有の体系（header / mobileMenu / modal）のためここで定義する。
 */

export { duration, easing, type Duration, type Easing } from '@siracusahq/tokens';

export const zIndex = {
  header: 100,
  mobileMenu: 200,
  modal: 300,
} as const;

export type ZIndex = keyof typeof zIndex;
