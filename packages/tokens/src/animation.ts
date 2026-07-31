/**
 * アニメーション基盤トークン（ブランド共通）
 *
 * z-index は用途体系が業務UI（dropdown/modal/toast …）と
 * Web/LP（header/mobileMenu …）で異なるため、各パッケージ側で定義する。
 */

export const duration = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const easing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
