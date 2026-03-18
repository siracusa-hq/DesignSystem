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
  /** Primary data series palette (use in order for multi-series charts) */
  series: [
    colors.primary[500],  // #1BA491 teal
    colors.info[500],     // #3b82f6 blue
    colors.warning[500],  // #f59e0b amber
    colors.error[500],    // #ef4444 red
    colors.success[500],  // #22c55e green
    colors.primary[300],  // #61ebd0 light teal
    colors.info[300],     // #93c5fd light blue
    colors.warning[300],  // #fcd34d light amber
  ] as const,

  /** Semantic colors for status-based charts */
  semantic: {
    positive: colors.success[500],
    negative: colors.error[500],
    neutral: colors.neutral[400],
    warning: colors.warning[500],
    info: colors.info[500],
    primary: colors.primary[500],
  } as const,

  /** Light fills for area/background (light mode) */
  areaLight: [
    colors.primary[100],
    colors.info[100],
    colors.warning[100],
    colors.error[100],
    colors.success[100],
  ] as const,

  /** Dark fills for area/background (dark mode) */
  areaDark: [
    colors.primary[900],
    colors.info[900],
    colors.warning[900],
    colors.error[900],
    colors.success[900],
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
export type ChartSemanticColors = typeof chartColors.semantic;
