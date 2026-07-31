import { chartColors } from '@/tokens/chart-theme';

/**
 * Chart theme utilities for Recharts integration.
 *
 * Uses CSS variable–based tokens from `tokens/chart-theme.ts`
 * so dark mode is handled automatically via semantic.css overrides.
 */

/** Categorical palette — 5 curated dataviz colors (CSS variables) */
export function getChartColors(): readonly string[] {
  return chartColors.categorical;
}

/** Subtle fill palette — 1:1 paired with categorical (CSS variables) */
export function getChartSubtleColors(): readonly string[] {
  return chartColors.subtle;
}

/**
 * Theme config for Recharts axes, grid, tooltip, and cursor.
 *
 * All values are CSS variable references — they resolve correctly
 * in both light and dark mode without runtime `getComputedStyle`.
 */
export function getChartTheme() {
  return {
    gridColor: chartColors.grid,
    textColor: chartColors.text,
    cursorStroke: chartColors.cursor,
    /** Tooltip uses surface tokens directly via Tailwind classes */
    fontSize: 12,
    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
  } as const;
}

/**
 * Default Recharts axis props — removes visual noise (Linear/Tremor pattern).
 * Spread onto <XAxis> or <YAxis>.
 */
export const axisDefaults = {
  axisLine: false,
  tickLine: false,
  tickMargin: 8,
} as const;

/**
 * Default CartesianGrid props — horizontal-only, subtle, wider dash spacing.
 */
export const gridDefaults = {
  vertical: false,
  strokeDasharray: '4 4',
  strokeOpacity: 0.5,
} as const;

/**
 * Inactive series opacity for hover-dimming (Tremor pattern).
 * Apply via CSS or Recharts `opacity` prop on non-hovered series.
 */
export const INACTIVE_OPACITY = 0.3;
export const ACTIVE_DOT_RADIUS = 5;
