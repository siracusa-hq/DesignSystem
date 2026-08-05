/**
 * dev 判定 — 開発時警告の出し分けに使う。
 *
 * `process.env.NODE_ENV` をリテラルのまま残すことが重要:
 * 消費側のバンドラ（Vite / esbuild / webpack）がビルド時に文字列置換し、
 * production ビルドでは条件ごと dead code elimination される。
 * Node の型には依存しない（tsup の dts ビルドが node types を持たないため、
 * ここで最小限の宣言だけ行う）。
 */
declare const process: { env?: { NODE_ENV?: string } } | undefined;

export const isDev: boolean =
  typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
