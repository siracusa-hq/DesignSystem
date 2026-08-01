# @polastack/gtm-design-system

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
