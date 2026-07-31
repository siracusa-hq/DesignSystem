/**
 * アニメーショントークン
 * CSS変数（globals.css @theme）と同期。
 */

export const duration = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
} as const;

export const easing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const zIndex = {
  dropdown: 50,
  sticky: 100,
  drawer: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type ZIndex = keyof typeof zIndex;
