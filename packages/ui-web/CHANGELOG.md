# @polastack/gtm-design-system

## 0.3.0

### Minor Changes

- 6bd6f27: tree-shaking を修正し、使わない依存を配布物から外した。

  ## 効果（利用者が実際に配信するサイズ）

  | import                                       |   変更前 |      変更後 |
  | -------------------------------------------- | -------: | ----------: |
  | `Button` のみ                                | 137.0 kB |  **8.2 kB** |
  | `Button/Input/Card/Dialog/Select/Toast/Tabs` | 137.0 kB | **40.2 kB** |
  | `DataTable` のみ                             | 137.0 kB | **48.6 kB** |
  | `MarketingButton` のみ（Web/LP）             |  20.8 kB |  **8.2 kB** |

  ## 何が起きていたか

  tsup が全コンポーネントを1つの `dist/index.js` に固めていたため、
  トップレベルの `cva()` / `forwardRef()` 呼び出しをバンドラが副作用ありと判断し、
  未使用コードを落とせなかった。結果として **`Button` を1つ使うだけで
  全70コンポーネント分（137kB）が配信されていた。**

  コンポーネント単位のエントリ + `splitting: true` に変更し、
  `dist/index.js` を薄い再エクスポート（298kB → 7.6kB）にした。
  公開 API・エクスポート名・型定義は一切変えていない。

  ## 依存関係の整理（破壊的変更を含む）

  ライブラリのコードから一度も import されていない依存が
  `dependencies` に入っており、利用者全員がインストールしていた。

  - `@polastack/design-system`: **`recharts` を削除**（8.4MB）。
    `ChartContainer` は枠を描くだけ、`chartColors` は CSS 変数名を返すだけで、
    どちらも recharts に依存していない。チャート本体は利用者が自分で組む設計のため、
    optional な `peerDependencies` に移した
  - `@polastack/gtm-design-system`: **`spectacle` を optional peerDependency に変更**（5.8MB）。
    `/slides` サブパスでしか使わない。README は以前から
    「スライドコンポーネントを使用する場合 `pnpm add spectacle`」と案内しており、
    package.json の分類だけが設計意図とズレていた

  **`@polastack/gtm-design-system/slides` を使っている場合は、
  `pnpm add spectacle` を明示的に実行する必要がある。**

  ## サイズ計測の改善

  `pnpm size` が「全エクスポートを一度に import した場合」しか測っておらず、
  上記の tree-shaking 破綻を検知できていなかった。
  利用者の使い方ごとの計測枠を追加し、特に「単一コンポーネントのみ」の枠を
  tree-shaking の番人として置いた。

### Patch Changes

- 6bd6f27: README にセットアップ手順を追記した。

  Tailwind CSS v4 は既定で `node_modules` を走査しないため、利用側の CSS に
  `@source '../node_modules/@polastack/gtm-design-system/dist'` の指定が必要である。
  指定が無い場合、コンポーネントはエラーを出さずに**無スタイルでレンダリングされる**
  （実測: `@source` なしで出力CSS 9.15 kB / 生成ユーティリティ0件、ありで 67.8 kB / 全件）。

  あわせて、Web フォント（Inter / Noto Sans JP / JetBrains Mono）が配布物に含まれておらず、
  利用側での読み込みが必要である点を明記した。

## 0.2.0

### Minor Changes

- fb77d6b: デザイントークンの正本を `@polastack/tokens` に一本化した。

  両パッケージの `src/tokens/*.ts` は値を複製せず、`@polastack/tokens` を再エクスポートし、
  パッケージ固有の拡張（業務UIの `fontSize` / `shadows.drawer` / `zIndex`、
  Web/LPの `fontSize` / `sectionSpacing` / `gradients` / グロー / `breakpoints`）だけを重ねる。

  ## @polastack/gtm-design-system（Web/LP）: 色が変わります

  プライマリカラーが `#13c3a0` → `#008575` に変わり、**WCAG AA 適合**になった。
  `#13c3a0` は白文字との対比が 2.25:1 しかなく、`MarketingButton` の
  `bg-primary-500 !text-white` は AA（4.5:1）を満たしていなかった。新しい 500 は 4.55:1。

  彩度の高い旧トーンは装飾用の **`brand` スケール**として残している。
  グラデーション・グロー・ダーク背景アクセントは `brand-*` を使うこと。
  `text-brand-*` と `bg-brand-500` 以上は AA を満たさないため使用禁止（テストが検出する）。

  - `MarketingButton variant="gradient"` は `from-primary-600 to-primary-500` に変更。
    旧実装の `to-primary-400` は白文字 3.0:1 で AA 未達だった
  - `Divider variant="brand"`、BentoGrid の featured 背景、`.gradient-border` は `brand-*` へ
  - semantic カラー（success / warning / error / info）を業務UIと同値に修正し、全シェードを CSS に展開
  - `globals.css` が `theme.css` を丸ごと複製していたのをやめ、`@import` に一本化

  ## @polastack/design-system（業務システムUI）

  色の見た目は変わらない。以下が修正・追加。

  - `zIndex` 定数が実際に出力される CSS（`--z-index-*`、3層体系）とズレていたのを修正。
    旧: `dropdown: 50, sticky: 100, ...` → 新: `sticky: 10, drawer: 1100, modal: 1200, ...`
  - `--color-neutral-850` / `--radius-3xl` / `--duration-slower` を CSS に追加（基盤スケールと揃えた）
  - `fontWeight` に `extrabold`、`radii` に `3xl` が追加

  ## 両パッケージ共通

  TS定数とCSS変数のズレを検出するテストを追加した（`src/tokens/tokens.test.ts`）。
  jsdom 上の axe-core は色計算ができずコントラスト違反を検出できないため、
  `@polastack/tokens` 側で WCAG のコントラスト比を実際に計算して固定している。
