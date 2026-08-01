/**
 * @polastack/tokens
 *
 * Polastack ブランドの基盤デザイントークン。
 * 業務システムUI（@polastack/design-system）と
 * Web/LP（@polastack/gtm-design-system）の唯一の正本。
 *
 * React を使わないサイト（Astro・静的HTML等）は
 * `@polastack/tokens/brand.css` を読み込むことで同じ変数を利用できる。
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

export {
  fontFamily,
  fontWeight,
  type FontFamily,
  type FontWeight,
} from './typography';

export { spacing, type Spacing } from './spacing';

export { shadows, radii, type Shadow, type Radius } from './elevation';

export { duration, easing, type Duration, type Easing } from './animation';
