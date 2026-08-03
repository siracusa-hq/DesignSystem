/**
 * カラートークン定数（ブランド共通基盤）
 *
 * Polastack のブランドカラーはここが唯一の正本。
 * @siracusahq/design-system（業務システムUI）と
 * @siracusahq/gtm-design-system（Web/LP）は本ファイルを参照し、値を複製しない。
 *
 * ## primary と brand の使い分け（重要）
 *
 * - `primary`（#008575 アンカー）: **操作用**。ボタン背景・リンク・フォーカスリングなど、
 *   テキストや意味を担うUI。白文字との対比 4.55:1 で WCAG AA を満たす。
 * - `brand`（#13c3a0 アンカー）: **装飾用**。グラデーション・グロー・ダーク背景上の
 *   アクセントなど。白背景に置いた場合の対比は 2.25:1 しかないため、
 *   **明背景でのテキスト・ボタン背景に使ってはならない。**
 *
 * 両者は近接色相（OKLCH H≈173〜180）の明度違いであり、ブランドとしては一つの色として成立する。
 */

/** 操作用プライマリ（WCAG AA 準拠）。ボタン・リンク・フォーカスリング用 */
export const primary = {
  50: '#e0f2f1',
  100: '#b2dfdb',
  200: '#80cbc4',
  300: '#4db6ac',
  400: '#26a69a',
  500: '#008575',
  600: '#007567',
  700: '#006055',
  800: '#004c43',
  900: '#003831',
  950: '#00231f',
} as const;

/** 装飾用ブランドアクセント。グラデーション・グロー・ダーク背景上のアクセント専用 */
export const brand = {
  50: '#f2fdfb',
  100: '#dbfaf4',
  200: '#b4f3e6',
  300: '#7ee7d2',
  400: '#2ee0bc',
  500: '#13c3a0',
  600: '#109e81',
  700: '#137663',
  800: '#165a4c',
  900: '#164b40',
  950: '#072c25',
} as const;

/** ニュートラル。850 はダークモードのサーフェス階層用 */
export const neutral = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  850: '#1f1f23',
  900: '#18181b',
  950: '#09090b',
} as const;

/** 成功。primary のティールと 44° の色相差をつけた True Green */
export const success = {
  50: '#f3fcf5',
  100: '#d9f7df',
  200: '#b6edbf',
  300: '#80db8f',
  400: '#3ecc55',
  500: '#22b43b',
  600: '#1c922f',
  700: '#1d6d2a',
  800: '#1d5326',
  900: '#1c4523',
  950: '#0a290f',
} as const;

export const warning = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
} as const;

export const error = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
  950: '#450a0a',
} as const;

export const info = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
} as const;

export const colors = {
  primary,
  brand,
  neutral,
  success,
  warning,
  error,
  info,
} as const;

export type ColorScale = keyof typeof colors;
export type ColorShade = keyof typeof primary;
