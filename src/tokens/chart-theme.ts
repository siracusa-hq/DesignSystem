/**
 * Chart theme tokens for integrating charting libraries (Recharts, Chart.js, etc.)
 * with the Polastack design system.
 *
 * Design approach:
 *   - Categorical palette is hand-curated for perceptual balance (Tableau 10 methodology)
 *   - Colors are independent from UI semantic tokens (Primer / shadcn best practice)
 *   - Each categorical color has a 1:1 paired subtle variant for area fills (Primer emphasis/muted pattern)
 *   - Brand teal anchors position 0; remaining hues span the full wheel for maximum distinction
 *
 * Usage with Recharts:
 *   <Bar fill={chartColors.categorical[0]} />
 *   <Area fill={chartColors.subtle[0]} stroke={chartColors.categorical[0]} />
 *
 * Usage with Chart.js:
 *   datasets: [{ backgroundColor: chartColors.categorical }]
 */

/**
 * 8-color categorical palette — curated for data visualization.
 *
 * Principles:
 *   1. Moderate saturation ("less Crayola bright") for professional look
 *   2. Balanced perceived lightness across all 8 hues
 *   3. Full hue-circle coverage for maximum distinguishability
 *   4. Warm/cool alternation to aid colorblind accessibility
 *   5. Brand teal as the anchor color at position 0
 */
export const chartColors = {
  /** Solid colors for bars, lines, dots, and legends */
  categorical: [
    '#13C3A0', // teal    — brand anchor
    '#4E79A7', // slate   — classic dataviz blue
    '#E8A838', // amber   — warm gold
    '#D4687A', // rose    — dusty pink-red
    '#7C6BB1', // violet  — soft purple
    '#6BA368', // sage    — muted green
    '#5BA4CF', // sky     — lighter blue
    '#B07A53', // sienna  — warm brown
  ] as const,

  /** Subtle tints — 1:1 paired with categorical for area fills and backgrounds */
  subtle: [
    '#E8FAF6', // teal
    '#E8EEF4', // slate
    '#FDF3E0', // amber
    '#FCEAED', // rose
    '#EEEBF5', // violet
    '#EAF3EA', // sage
    '#E6F1F8', // sky
    '#F4EDE6', // sienna
  ] as const,

  /** Dark-mode subtle tints — 1:1 paired with categorical */
  subtleDark: [
    '#0C2B26', // teal
    '#1A2535', // slate
    '#2C2312', // amber
    '#2C1A1E', // rose
    '#1E1A2C', // violet
    '#1A2C1A', // sage
    '#1A2535', // sky
    '#2C2418', // sienna
  ] as const,

  /** Semantic colors for status-meaning charts (P&L, health scores, etc.) */
  semantic: {
    positive: '#13C3A0',
    negative: '#D4687A',
    neutral: '#94939B',
    warning: '#E8A838',
  } as const,

  /** Grid lines and axis strokes */
  grid: {
    light: '#E4E4E7', // neutral-200
    dark: '#3F3F46',  // neutral-700
  } as const,

  /** Text for tick labels, legends, and annotations */
  text: {
    light: '#71717A', // neutral-500
    dark: '#A1A1AA',  // neutral-400
  } as const,
} as const;

export type ChartCategoricalColors = typeof chartColors.categorical;
export type ChartSemanticColors = typeof chartColors.semantic;
