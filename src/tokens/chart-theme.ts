import { colors } from './colors';

/**
 * Chart theme tokens for integrating charting libraries (Recharts, Chart.js, etc.)
 * with the Polastack design system color palette.
 *
 * Usage with Recharts:
 *   <Bar fill={chartColors.series[0]} />
 *
 * Usage with Chart.js:
 *   datasets: [{ backgroundColor: chartColors.series }]
 */

/** Ordered color series for chart data — distinct, accessible, brand-consistent. */
export const chartColors = {
  /**
   * Primary data series palette (use in order for multi-series charts).
   * Uses 400-level tones for a softer, more cohesive look in filled areas
   * (bars, pie slices, etc.). Brand teal stays at 500 as the anchor.
   */
  series: [
    colors.primary[500],  // #1BA491 brand teal (anchor)
    colors.info[400],     // #60a5fa soft blue
    colors.neutral[400],  // #a1a1aa muted gray
    colors.warning[400],  // #fbbf24 soft amber
    colors.success[400],  // #4ade80 soft green
    colors.error[300],    // #fca5a5 soft coral
    colors.primary[300],  // #61ebd0 light teal
    colors.info[300],     // #93c5fd light blue
  ] as const,

  /**
   * Stronger series — for line charts and small marks (dots, strokes)
   * where higher contrast is needed against the background.
   */
  stroke: [
    colors.primary[600],  // #138575 deep teal
    colors.info[600],     // #2563eb deep blue
    colors.neutral[500],  // #71717a medium gray
    colors.warning[600],  // #d97706 deep amber
    colors.success[600],  // #16a34a deep green
    colors.error[500],    // #ef4444 red
    colors.primary[700],  // #146b5f dark teal
    colors.info[700],     // #1d4ed8 dark blue
  ] as const,

  /** Semantic colors for status-based charts */
  semantic: {
    positive: colors.success[400],
    negative: colors.error[400],
    neutral: colors.neutral[400],
    warning: colors.warning[400],
    info: colors.info[400],
    primary: colors.primary[500],
  } as const,

  /** Light fills for area/background (light mode) — very subtle */
  areaLight: [
    colors.primary[50],
    colors.info[50],
    colors.neutral[100],
    colors.warning[50],
    colors.success[50],
  ] as const,

  /** Dark fills for area/background (dark mode) */
  areaDark: [
    colors.primary[950],
    colors.info[950],
    colors.neutral[800],
    colors.warning[950],
    colors.success[950],
  ] as const,

  /** Grid and axis colors (use CSS variables for dark mode compatibility) */
  grid: {
    light: colors.neutral[200],
    dark: colors.neutral[700],
  } as const,

  /** Text colors for labels and legends */
  text: {
    light: colors.neutral[500],
    dark: colors.neutral[400],
  } as const,
} as const;

export type ChartColorSeries = typeof chartColors.series;
export type ChartStrokeColors = typeof chartColors.stroke;
export type ChartSemanticColors = typeof chartColors.semantic;
