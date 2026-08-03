/**
 * Polastack GTM Design System - Design Tokens
 * マーケティングコミュニケーション向けデザイントークン
 *
 * カラー・タイポグラフィ・スペーシング等の基盤値は `@siracusahq/tokens` が正本。
 * ここでは Web/LP 固有の拡張（fontSize / sectionSpacing / gradients /
 * glow shadows / breakpoints / zIndex）を重ねたうえで再エクスポートする。
 */

export { colors, type ColorScale, type ColorShade } from './colors';
export {
  fontFamily,
  fontSize,
  fontWeight,
  type FontSize,
  type FontWeight,
} from './typography';
export {
  spacing,
  sectionSpacing,
  containerWidth,
  type Spacing,
  type SectionSpacing,
  type ContainerWidth,
} from './spacing';
export { gradients, type GradientName } from './gradients';
export { shadows, radii, type Shadow, type Radius } from './elevation';
export { duration, easing, zIndex, type Duration, type Easing, type ZIndex } from './animation';
export { breakpoints, type Breakpoint } from './breakpoints';
