/**
 * dev 判定 — 開発時警告の出し分けに使う。
 *
 * `process.env.NODE_ENV` を**ドット表記のリテラルのまま**残すことが重要:
 * 消費側のバンドラ（Vite / esbuild / webpack）がビルド時に文字列置換し、
 * production ビルドでは `false` に畳まれて条件ごと dead code elimination される
 * （警告文そのものも配信物から消える）。
 * Node の型には依存しない（tsup の dts ビルドが node types を持たないため、
 * ここで最小限の宣言だけ行う）。
 *
 * **書き方を変えてはならない**（Stage 5 Slice 1 で2つの罠が判明した）。
 *
 * 1. `typeof process !== 'undefined' &&` でガードしない。
 *    ブラウザには `process` グローバルが無く、バンドラはこの `typeof` を畳まない。
 *    その結果、`process.env.NODE_ENV` が `"development"` に置換されていても
 *    式全体が実行時に false になり、**dev 警告が一度も出なくなる**。
 *    実際 Storybook（Vite）では Stage 3〜4 の警告が一度も出ていなかった。
 * 2. `process.env?.NODE_ENV` のようにオプショナルチェーンを挟まない。
 *    esbuild の define は `process.env.NODE_ENV` の**ドット表記の完全一致**しか
 *    置換しない。`?.` を挟むと置換されず、「警告文は production バンドルに残るのに
 *    実行時には出ない」という最悪の組み合わせになる。
 *
 * 置換される前提は React 本体が乗っているものと同じなので、実運用のバンドラでは
 * すべて成立する（Node での SSR は `process` が存在する）。
 * `scripts/consumer-smoke.mjs` が実際に production / development の両方で
 * バンドルし、警告文が消えること・残ることを双方向で検証している。
 */
/* 型のためだけの宣言（node types に依存しない）。実体はバンドラの置換で消える */
declare const process: { env: { NODE_ENV?: string } };

export const isDev: boolean = process.env.NODE_ENV !== 'production';
