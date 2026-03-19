import { chartColors } from '@/tokens/chart-theme';

/**
 * Chart theme utilities for Recharts integration.
 *
 * Uses the curated categorical palette from `tokens/chart-theme.ts`
 * and resolves CSS variables at runtime for dark mode support.
 */

/** Resolve a CSS variable with fallback */
const cssVar = (variable: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim() || fallback
  );
};

/** Categorical palette — 8 curated dataviz colors */
export function getChartColors(): readonly string[] {
  return chartColors.categorical;
}

/** Subtle fill palette — 1:1 paired with categorical */
export function getChartSubtleColors(dark = false): readonly string[] {
  return dark ? chartColors.subtleDark : chartColors.subtle;
}

/** Theme object for Recharts axes, grid, and tooltip styling */
export function getChartTheme() {
  return {
    gridColor: cssVar('--color-neutral-200', chartColors.grid.light),
    axisColor: cssVar('--color-neutral-400', '#a1a1aa'),
    textColor: cssVar('--color-neutral-500', chartColors.text.light),
    tooltipBg: cssVar('--color-surface-raised', '#ffffff'),
    tooltipBorder: cssVar('--color-border', '#e4e4e7'),
    fontSize: 12,
    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
  };
}
