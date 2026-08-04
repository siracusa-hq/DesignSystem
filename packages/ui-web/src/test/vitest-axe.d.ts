/**
 * vitest-axe のカスタムマッチャ型登録。
 * tsconfig.stories.json（stories/tests を含む型検査）で必要。
 */
import type { AxeMatchers } from 'vitest-axe';

declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
