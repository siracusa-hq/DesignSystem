/**
 * Chart theme tokens for integrating charting libraries (Recharts, Chart.js, etc.)
 * with the Polastack design system.
 *
 * Design approach:
 *   - 5 categorical colors via CSS variables (shadcn/ui convention)
 *   - 値は generated-brand.css（packages/tokens/src/chart.ts で決める。spec §12 Q15）。
 *     data-brand で 1 色目がブランドの色相になり、2 色目以降はブランドに近い色を飛ばした決まった順になる
 *   - Light/dark mode handled entirely through CSS variable overrides
 *   - Each categorical color has a 1:1 paired subtle variant for area fills
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
 *   2. 色は順に割り当てる（並びが見分けやすさを保つので、飛ばしたり並べ替えたりしない）
 *   3. 隣り合う色は色覚の多様性でも見分けられる（ΔE >= 8）。散布図など全部の色が隣り合いうるグラフは 3 系列まで
 *   4. 地とのコントラスト 3:1 以上
 *   5. 1 色目はブランドの色相
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

  /**
   * Semantic colors for status-meaning charts (P&L, health scores, etc.)
   * 状態の色を使う（系列の色は並びがブランドで変わるので、意味を持たせない）。アイコン・ラベルと一緒に使う
   */
  semantic: {
    positive: 'var(--color-success-600)',
    negative: 'var(--color-error-600)',
    neutral: 'var(--color-on-surface-muted)',
    warning: 'var(--color-warning-600)',
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
    // 既定（コーポレート）の明るい画面の値。generated-brand.css の :root と同じ（テストで確かめる）
    categorical: [
      '#038e7d', // teal (brand hue)
      '#026abe', // slate
      '#a87502', // amber
      '#be425f', // rose
      '#733699', // violet
    ] as const,
  },
} as const;

export type ChartCategoricalColors = typeof chartColors.categorical;
export type ChartSemanticColors = typeof chartColors.semantic;
