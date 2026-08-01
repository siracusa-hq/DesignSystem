/**
 * エレベーショントークン（シャドウ、ボーダーラディウス）
 *
 * 基盤スケールの正本は `@polastack/tokens`。
 * `drawer` は業務システムUI固有（Drawer の広がりのある影）のため、
 * ここで基盤スケールに追加する。
 */

import { shadows as baseShadows, radii } from '@polastack/tokens';

export const shadows = {
  ...baseShadows,
  /** Drawer 用。四方に広がる大きめの影 */
  drawer: '0 0 48px rgb(0 0 0 / 0.16)',
} as const;

export { radii };

export type Shadow = keyof typeof shadows;
export type { Radius } from '@polastack/tokens';
