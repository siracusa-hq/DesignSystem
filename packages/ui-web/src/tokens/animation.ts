/**
 * アニメーショントークン定数
 * スクロールアニメーション・フェードイン・カウンター用
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

export const zIndex = {
  header: 100,
  mobileMenu: 200,
  modal: 300,
} as const;
