/**
 * @siracusahq/tokens
 *
 * Polastack ブランドの基盤デザイントークン。
 * 業務システムUI（@siracusahq/design-system）と
 * Web/LP（@siracusahq/gtm-design-system）の唯一の正本。
 *
 * React を使わないサイト（Astro・静的HTML等）は
 * `@siracusahq/tokens/brand.css` を読み込むことで同じ変数を利用できる。
 */

export {
  colors,
  primary,
  brand,
  neutral,
  success,
  warning,
  error,
  info,
  type ColorScale,
  type ColorShade,
} from './colors';

export { fontFamily, fontWeight, type FontFamily, type FontWeight } from './typography';

export { spacing, type Spacing } from './spacing';

export { shadows, radii, type Shadow, type Radius } from './elevation';

export { duration, easing, type Duration, type Easing } from './animation';

// ---- テーマ契約（マルチブランド）----
// 詳細仕様: docs/theme-contract-spec.md
export {
  hexToOklch,
  oklchToHex,
  maxChroma,
  contrastRatio,
  relativeLuminance,
  hexToRgbTriplet,
  type Oklch,
} from './color';

export {
  STEPS,
  STEP_VALUES,
  SLOTS,
  CTA_SLOTS,
  ACTION_STEP,
  DECOR_STEP,
  ACTION_MIN_CONTRAST,
  ACTION_CHROMA_BAND,
  ACTION_L_BAND,
  GAMUT_SAFETY,
  generateRamp,
  stepLightness,
  type Step,
  type GenerateRampOptions,
  type RampResult,
} from './ramp';

export {
  registry,
  DEFAULT_BRAND,
  resolveRamp,
  resolveAllBrands,
  type BrandEntry,
  type ResolvedBrand,
} from './brand-registry';

// ---- グラフの色（spec §12 Q15）----
export {
  CHART_SLOTS,
  CHART_HUE_GAP,
  CHART_ACHROMATIC_C,
  CHART_SURFACE,
  CHART_L_BAND,
  CHART_CHROMA_FLOOR,
  CHART_MIN_CONTRAST,
  CHART_CVD_MIN,
  CHART_NORMAL_MIN,
  CHART_POOL,
  chartDeltaE,
  checkCategorical,
  chartPaletteFor,
  type ChartMode,
  type ChartCheck,
  type ChartPalette,
} from './chart';
