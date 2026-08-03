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
  ACTION_STEP,
  DECOR_STEP,
  ACTION_MIN_CONTRAST,
  ACTION_CHROMA_BAND,
  ACTION_L_BAND,
  EXPLICIT_L_TOLERANCE,
  GAMUT_SAFETY,
  generateRamp,
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
  type GeneratedBrand,
  type ExplicitBrand,
  type ResolvedBrand,
  type SlotOverrides,
} from './brand-registry';
