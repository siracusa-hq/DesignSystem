/**
 * Chart theme tokens for integrating charting libraries (Recharts, Chart.js, etc.)
 * with the Polastack design system.
 *
 * Design approach:
 *   - 5 categorical colors via CSS variables (shadcn/ui convention)
 *   - Light/dark mode handled entirely through CSS variable overrides in semantic.css
 *   - Each categorical color has a 1:1 paired subtle variant for area fills
 *   - Brand teal anchors position 0; remaining hues span the wheel for max distinction
 *
 * Usage with Recharts:
 *   <Bar fill={chartColors.categorical[0]} />
 *   <Area fill={chartColors.subtle[0]} stroke={chartColors.categorical[0]} />
 *
 * For theme-aware runtime resolution, use getChartColors() from chart-theme utility.
 */

/**
 * 5-color categorical palette — CSS variable references.
 *
 * Principles:
 *   1. Max 5 series recommended (GitHub Primer guideline) for readability
 *   2. Moderate saturation for professional look
 *   3. Full hue-circle coverage for maximum distinguishability
 *   4. Warm/cool alternation to aid colorblind accessibility
 *   5. Brand teal as the anchor color at position 0
 */
export const chartColors = {
  /** CSS variable references — resolve at runtime for dark mode support */
  categorical: [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ] as const,

  /** Subtle tints — 1:1 paired with categorical for area fills and backgrounds */
  subtle: [
    'var(--color-chart-1-subtle)',
    'var(--color-chart-2-subtle)',
    'var(--color-chart-3-subtle)',
    'var(--color-chart-4-subtle)',
    'var(--color-chart-5-subtle)',
  ] as const,

  /** Semantic colors for status-meaning charts (P&L, health scores, etc.) */
  semantic: {
    positive: 'var(--color-chart-1)',
    negative: 'var(--color-chart-4)',
    neutral: 'var(--color-on-surface-muted)',
    warning: 'var(--color-chart-3)',
  } as const,

  /** Grid & axis — reference semantic.css chart tokens */
  grid: 'var(--color-chart-grid)',
  text: 'var(--color-chart-text)',
  cursor: 'var(--color-chart-cursor)',

  /**
   * Static hex fallbacks — only for server-side rendering or non-CSS contexts.
   * Prefer the CSS variable references above for all client-side usage.
   */
  hex: {
    categorical: [
      '#13C3A0', // teal
      '#4E79A7', // slate
      '#E8A838', // amber
      '#D4687A', // rose
      '#7C6BB1', // violet
    ] as const,
  },
} as const;

export type ChartCategoricalColors = typeof chartColors.categorical;
export type ChartSemanticColors = typeof chartColors.semantic;
