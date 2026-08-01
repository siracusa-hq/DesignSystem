/**
 * Polastack Design System - Design Tokens
 *
 * カラー・タイポグラフィ・スペーシング等の基盤値は `@polastack/tokens` が正本。
 * ここでは業務システムUI固有の拡張（fontSize / shadows.drawer / zIndex）を
 * 重ねたうえで再エクスポートする。
 */

export { colors, type ColorScale, type ColorShade } from './colors';
export {
  fontFamily,
  fontSize,
  fontWeight,
  type FontSize,
  type FontWeight,
} from './typography';
export { spacing, type Spacing } from './spacing';
export { shadows, radii, type Shadow, type Radius } from './elevation';
export {
  duration,
  easing,
  zIndex,
  type Duration,
  type Easing,
  type ZIndex,
} from './animation';
