# Stage 5 作業指示書 — 守り（ページ単位 VRT + 和文最悪ケース + dev 警告拡充 + 消費側結合）

設計の正本は [composition-redesign.md](./composition-redesign.md) §Stage 5。
運用は Stage 2〜4 と同じ（縦切りスライス・PR ごとにユーザー承認でマージ・プレビュー目視）。

## 1. 狙い

Stage 4 までで「崩れないページが速く出て、成果も測れる」ようになった。
Stage 5 はそれを**壊れないまま保つ**仕組み。特に AI が書く和文コピーは長さが暴れるため、
「見出しが3行に折り返してヒーローが崩れる」型の事故を機械で止めることが最重要。

## 2. 決定事項（設計文書からの確定分）

| 項目                     | 決定                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| VRT の検証単位           | **ページ**。統一感はページを並べて初めて判定できる。コンポーネント単体は対象外                                         |
| VRT 基盤                 | Playwright スクリーンショット比較を CI で自前運用（Chromatic は有料のため使わない）                                    |
| 背景リズムの基準         | 他社実態は未検証のまま。**最初に自分たちが良いと判断したスナップショットが基準**になり、以降はズレを検出する           |
| 和文最悪ケース           | 「異常に長い和文」「異常に短い和文」「英語」の3パターンをページ単位ストーリーとして持ち、VRT で固定する                |
| ロゴ6社未満の警告        | **撤回済み**。「ロゴ帯 or 数値バッジのどちらかを必ず置く」+「1〜5社はロゴ帯にしない（実例0件）」の切替ガイドに置き換え |
| 計測タグ・CVR 由来の閾値 | 作らない（検証不能なものは規則にしない）                                                                               |

## 3. VRT の環境固定（Slice 0 で確定させる）

- **比較の裁定者は CI（ubuntu + Playwright 同梱 Chromium）**。OS 差でピクセルが揺れるため、
  基準 PNG は CI と同系環境（この devcontainer = Linux）で生成してコミットする
  → Slice 0 の実測で、**OS・CPU アーキテクチャの差は出なかった**（§7-2）。
  揺れるのは Chromium のバージョンのほう
- 和文フォントを環境にインストールして描画を安定させる（fonts-noto-cjk）。
  さらに各ショット前に `document.fonts.ready` を待つ
- ビューポートは **desktop 1280×800 / mobile 390×844** の2枠
- アニメーション・カウントアップは無効化（`prefers-reduced-motion` を強制）して揺れを消す
- しきい値は最小限（アンチエイリアス誤差のみ許容）。緩いしきい値は「何も検知しない VRT」になる
- 更新手順: `pnpm vrt:update`（devcontainer 内で実行 → PNG をコミット）。
  **基準の更新は「意図した見た目の変更」の PR にだけ含めること**

## 4. スライス

| #     | 内容                                                                                                                                                                                                                                                                            | 完了条件                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **0** | VRT 基盤（Playwright + Storybook static + CI ジョブ）+ 和文最悪ケース3ストーリー + 初回基準スナップショット                                                                                                                                                                     | ページ単位ストーリー（Patterns 全部 + CorporateTop + 最悪ケース3種）× 2 ビューポートの基準 PNG がコミットされ、CI で比較が回る |
| **1** | dev 警告拡充: h1 重複 / 社会的証明スロット空（19/19 が数値訴求を持つ）/ StatsSection の時点表記（asOf）検査（景表法）/ ロゴ社数の切替ガイド（1〜5社でロゴ帯を組むと警告）+ **規範ガードのデモストーリー**（ブランドオーナー要望。警告がコンソールに出る様子を説明付きで見せる） | 各警告がテストで固定され、デモストーリーで目視できる                                                                           |
| **2** | Astro 消費側結合テスト: 最小 Astro アプリを CI でビルドし、生成 HTML/CSS に期待要素（ハッシュ済みクラス・data-brand・Netlify 属性・styles.css の実体）が載ることを検証                                                                                                          | consumer smoke（renderToString）では見えない Astro ビルド経路の事故を検出できる                                                |

## 5. Stage 5 でやらないこと

- コンポーネント単体の VRT（ページで見る方針。Storybook は目視カタログの役割のまま)
- クロスブラウザ VRT（裁定者は Chromium 1系。Safari/Firefox 差は実害が出てから）
- % 閾値の緩い比較（検知しない VRT は無いのと同じ）

## 6. 進捗

- [x] Slice 0 — ページ単位 VRT 基盤 + 和文最悪ケース
- [x] Slice 1 — dev 警告拡充 + 規範ガードのデモ + AnimatedCounter の reduced-motion 対応
- [x] Slice 2 — Astro 消費側結合テスト

### Slice 0 の要点

| 項目     | 実績                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| 基準 PNG | **20 枚 / 合計 4.2MB**（desktop 2.3MB + mobile 2.0MB）。Git LFS は不要                                            |
| 対象     | ページ単位 10 ストーリー × 2 ビューポート（desktop 1280×800 / mobile 390×844）                                    |
| 内訳     | Patterns/LandingPage 7（`計測_onCTAClick` を除く）+ Patterns/WorstCase 2 + Examples/CorporateTop 1                |
| 実行時間 | `pnpm vrt` 全体で 35〜37 秒（Storybook は web のみビルド。初回 28 秒 / vite キャッシュ後 15 秒 + 比較 19〜27 秒） |
| 再現性   | `pnpm vrt` を 2 回連続で緑。比較のみは 3 回連続 + `--workers=6`（CPU を意図的に混ませる）でも緑                   |
| しきい値 | `threshold: 0.1` / `maxDiffPixels: 100`。比率指定（maxDiffPixelRatio）は縦長ページほど緩むため使わない            |

**揺れ対策の内訳**（効いた順）:

1. **rAF の時刻を未来へ飛ばす**（`vrt/pages.spec.ts` の `completeTimeBasedAnimations`）。
   経過時間ベースの JS アニメーションが最初の1フレームで最終値になる
2. **ページ全体を一度スクロールしてから先頭に戻す**。IntersectionObserver 起点の
   AnimateOnScroll / AnimatedCounter / `loading="lazy"` 画像を全部起こす
3. **`reducedMotion: 'reduce'`**（CSS 側は theme.css の `@media` が duration を 1ms に落とす）
   \+ `toHaveScreenshot({ animations: 'disabled' })`
4. **webfont の読み込みを明示的に検証**。Inter / Noto Sans JP が `loaded` でなければ
   「差分」ではなく「フォント未取得」として落とす
5. **Chromium の描画フラグ**（`--font-render-hinting=none` / `--disable-lcd-text` /
   `--force-color-profile=srgb` / `--disable-skia-runtime-opts`）
6. **`locale: 'ja-JP'` / `timezoneId: 'Asia/Tokyo'` の固定**（`Intl.NumberFormat` の桁区切り）

### Slice 1 の要点

| 項目           | 実績                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 追加した警告   | 4種（h1 重複 / 社会的証明スロット空 / StatsSection の時点表記 / ロゴ1〜5社）。既存5種と合わせて **9種**                        |
| 新しい公開 API | `StatsSectionProps.asOf`（minor）。時点は利用側が文字列で渡す（パッケージは文言を持たない）                                     |
| a11y 修正      | AnimatedCounter が `prefers-reduced-motion: reduce` で rAF を回さず最終値を即出しするように（§7-1 の宿題を消化）               |
| デモ           | `Patterns/規範ガード` に10ストーリー（警告9種 + 「出ない例」1種）。各1件だけ鳴ることを実測で確認                               |
| VRT 基準更新   | **16 枚**（8ストーリー × 2 ビューポート）。asOf の caption 追加と、English LP への proof 追加が理由                            |
| 副産物         | **dev 警告は Stage 3〜4 を通じて一度も出ていなかった**（§7-6）。Slice 1 の本体はこの発見と修正                                 |

### Slice 2 の要点

| 項目               | 実績                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 場所               | `packages/astro-consumer-test/`（`private: true` の workspace パッケージ。npm には出ない）                                      |
| ページ             | 3枚。`index`（`defineLandingPage` の製品LP・静的）/ `contact`（`ResourceRequestForm`・静的）/ `cases`（`client:visible`）       |
| 検証項目           | **17件**（HTML 7 / Netlify 3 / アイランド 3 / CSS 4）。1つでも欠けたら exit 1 で何が欠けたか出す                                |
| 実行時間           | `astro build` 6〜7 秒（クリーンから）+ `verify` 1 秒未満。3回連続で緑                                                           |
| CI                 | `astro-consumer` job（check / vrt と並列）。install + `pnpm build` + astro build + verify で **3〜4 分**の見込み                |
| 見つかった不具合   | **2件**。`offers` の DOM 属性漏れ（修正済み・patch）と、SSG のフォームが英語になる問題（§7-10。未修正）                        |
| 見つかった落とし穴 | **1件**。`.astro` で直接セクションを並べると面リズムエンジンが効かない（§7-11）                                                |

**「1行導入」の根拠がこれになった。** `packages/ui-web/README.md` の Setup は
`import '@siracusahq/gtm-design-system/styles.css';` の1行だけで済むと謳っているが、
これまでその主張を裏づけるのは renderToString の smoke だけで、
実際のフレームワークのビルドを通した証拠は無かった。
`src/pages/index.astro` はその1行しか書いていない（PostCSS 設定も Tailwind も無い）ので、
このジョブが緑であること自体が README の主張の実測になっている。

ローカルでの再現:

```bash
pnpm build   # tokens → ui-app → ui-web（astro-consumer-test は含まない。§7-12）
pnpm --filter astro-consumer-test build
pnpm --filter astro-consumer-test verify
```

## 7. 実装で判明した事項

（あとから効く発見をここに記録する。dev 検査は process.env でなく `@/lib/dev` の isDev を使うこと — Stage 4 §7-0）

### 7-1. AnimatedCounter は `prefers-reduced-motion` を見ていない（Slice 1 で解消）

> **解消済み（Slice 1）**: `animated-counter.tsx` が `matchMedia('(prefers-reduced-motion: reduce)')`
> を見て、reduce のときは IntersectionObserver も rAF も回さず最終値を即座に出すようにした。
> 初期値は SSR と同じ 0 のまま effect で確定させるので、ハイドレーションの不一致は起きない。
> VRT 側の `completeTimeBasedAnimations`（rAF の時刻を進める処置）は、
> `matchMedia` を持たない環境や将来の JS 演出に対する保険として残している。
> 以下は当時の記録。


`stats-section.tsx` のコメントは「reduced-motion はトークン層が処理」と書いているが、
これが成り立つのは **CSS アニメーションだけ**。`AnimatedCounter` は
`requestAnimationFrame` で数値を数え上げる **JS 実装**なので、`theme.css` の
`@media (prefers-reduced-motion: reduce)` は届かない。OS 設定で動きを止めている利用者にも
数値がカウントアップして見えている。

Slice 0 では**コンポーネントに手を入れず** VRT 側で rAF の時刻を進めて解決した
（守りのスライスで公開挙動を変えないため）。ただしこれは a11y の実装漏れであり、
`useReducedMotion` 相当のフックで初期値を最終値にする修正を **Slice 1 以降で検討すること**。

なお最初は「本文テキストが変化しなくなるまで待つ」方式を採ったが、CPU が混むと
150ms のあいだ1フレームも配送されず、止まったと誤認して途中の数値で撮ってしまった
（実際に比較1回目で 1,262px の差分）。**時間で待つ対策は、遅くてたまに落ちる VRT を作る。**

### 7-2. 基準 PNG は OS・CPU アーキテクチャの差を受けなかった

当初 §3 は「基準 PNG は CI と同系環境で生成する」としていたが、devcontainer は
**Debian 13 / arm64**、GitHub Actions の `ubuntu-latest` は **Ubuntu 24.04 / amd64** で
そもそも同系ではない。マージ前に実測したところ、devcontainer で生成した基準 PNG は

- Ubuntu 24.04 / arm64（`mcr.microsoft.com/playwright:v1.62.1-noble`）
- Ubuntu 24.04 / amd64（同イメージを `--platform linux/amd64` でエミュレーション）

の両方で **1px の差もなく通った**。フォントを Google Fonts の webfont に固定し、
ヒンティングと LCD 描画と Skia の実行時最適化を切っているため、
描画がシステムフォントや CPU 命令セットに依存しない。

**したがって CI は `ubuntu-latest` でよい。** ただしこの前提は
「Chromium のバージョンが Playwright で固定されている」ことに乗っている。
`@playwright/test` を上げる PR では基準 PNG の作り直しが必要になる可能性が高いので、
バージョンは `1.62.1` と **完全一致で固定**している（`^` を付けない）。

### 7-3. Google Fonts への実行時依存は残した

`.storybook/preview-head.html` が Google Fonts を参照しており、VRT もそれをそのまま使う。
ローカルにフォントを持つ案（システムフォント + `src: local()` / woff2 のリポジトリ同梱）も
検討したが、

- システムフォント依存にすると **OS 差をわざわざ呼び込む**（上の 7-2 が成立しなくなる）
- Noto Sans JP は Google Fonts 上で 100 以上の unicode-range サブセットに分割されており、
  同梱すると「文言を足したら未同梱のサブセットが要求される」事故が起きる

ため、**webfont のまま + 読み込み検証**という形にした。取得に失敗した場合は
「ピクセル差分」ではなく「Inter（欧文）が読み込まれていない」という明示的な失敗になる。
`fonts-noto-cjk` の導入（CI・devcontainer 両方）は、取得に失敗したときに
豆腐（□）ではなく和文が出るための保険であって、描画の主役ではない。

### 7-4. `Examples/LandingPage` を VRT 対象から外している

このストーリーはフッターの copyright に `new Date().getFullYear()` を使っており、
**年が変わると基準 PNG が自動で壊れる**。ページ単位ストーリーではあるが、
Slice 0 の対象は「Patterns 全部 + CorporateTop + 最悪ケース」なので今回は対象外。
将来 VRT に入れるなら、年を固定値の props にするか `clock` API で時刻を固定すること。

### 7-5. dev 警告の文字列は production バンドルにも残る（実行はされない）

Slice 1 で `scripts/consumer-smoke.mjs` に DCE 検証を足したところ、
**警告の日本語文字列は production バンドルから消えない**ことが分かった。
実測（バレル import・esbuild minify）は **5,269 B / brotli 1,238 B**。

原因は `@/lib/dev` という**モジュール境界**にある。tsup（esbuild）は
`export const isDev = ...` を必ず `var isDev = ...` として出力するため
（バンドル時の束縛の平坦化。`splitting` や `treeshake` の設定とは無関係で、
両方を切っても `var` のまま）、消費側の esbuild も Rollup も
「モジュールをまたいだ定数伝播」ができず、`if (isDev && …)` を畳めない。
実測で Vite（Rollup）の production ビルドでも 8/8 の警告文が残った。

- **実行はされない。** `isDev` 自体は `false` に評価されるので、
  利用者のコンソールに警告が出ることはない（smoke がこの向きを検証している）
- 検証として `isDev` を手で `const` に書き換えると 8 件中 6 件が消えた。
  残る2件は `useEffect` のクロージャ内にある検査（h1 重複 / CTA ラベル）

**消し切るには `process.env.NODE_ENV !== 'production'` を各検査の直上に
インライン展開する**しかない（React / Redux が採っている形）。
これは Stage 4 §7-0 で決めた「`@/lib/dev` の isDev を使う」を覆すことになるので、
Slice 1 では**実測の記録にとどめ、手を入れていない**。
バレルの size 枠（55 kB / 実測 50.44 kB）に対して brotli 1.2 kB なので、
費用対効果の判断は別途行うこと。


**裁定（Fable / 2026-08-08）**: 受容する。実行されない文字列 brotli 1.2KB（枠の2%）を消すために
「dev 判定は必ず `@/lib/dev` の isDev」という保守ルール（Stage 4 §7-0）を壊すのは割に合わない。
将来バレル枠が逼迫したときに再検討する。

### 7-6. dev 警告は Stage 3〜4 を通じて一度も出ていなかった

Slice 1 で規範ガードのデモを作った際、**警告がブラウザで1件も出ない**ことが判明した。
原因は `src/lib/dev.ts` の書き方:

```ts
// 誤り（Stage 2〜4 のあいだずっとこれだった）
export const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
```

2つの罠が重なっていた。

1. **`typeof process !== 'undefined'` のガード。**
   ブラウザに `process` グローバルは無く、バンドラはこの `typeof` を畳まない。
   `process.env.NODE_ENV` が `"development"` に置換されていても、
   式全体が実行時に `false` になる。**Storybook でも消費側の Vite アプリでも
   警告が出ていなかった**（Netlify の Storybook でも、ローカルの dev サーバでも）
2. **`process.env?.NODE_ENV` のオプショナルチェーン。**
   esbuild の define は `process.env.NODE_ENV` の**ドット表記の完全一致**しか置換しない。
   `?.` を挟むと置換されず、「文字列は残るのに実行はされない」状態になる
   （Vite は置換してくれるので、この罠は esbuild 単体でしか露見しない）

修正後は `process.env.NODE_ENV !== 'production'` の一行に統一した。
`scripts/consumer-smoke.mjs` が **development で警告文が残ること**と
**production で `process.env.NODE_ENV` が置換されること**を双方向で検証しており、
同じ事故が再発したら CI で落ちる。

**教訓: 「警告を実装した」と「警告が出る」は別。** 検査を足したら、
実際にブラウザで鳴ることを一度は確かめること。

### 7-7. Storybook のビルド版でも dev 検査を残す設定にした

`storybook build` は production ビルドなので、既定では `isDev` が `false` に畳まれ、
**Netlify にデプロイされた Storybook では規範ガードのデモが何も出せない**。
Storybook は npm の配布物ではなくカタログなので、
`packages/ui-web/.storybook/main.ts` の `viteFinal` で
`process.env.NODE_ENV` を `"development"` に固定している。

- npm パッケージ本体（tsup ビルド）はこの define の影響を受けない
- React も dev ビルドで載る（Storybook のバンドルは増えるが、
  カタログとしては React 自身の警告も見えたほうがよい）
- **VRT には影響しなかった**（この変更の前後で 20 枚とも 1px の差もなく通る）

### 7-8. `asOf` は `note` があるときは警告しない

`StatsSection` には既に自由文の `note`（「※2026年6月末時点。当社調べ…」）があり、
時点をそこに書いているページが実在した。`asOf` 未指定だけを条件に警告すると
**規範を守っているページに警告が出る**（誤発火は警告そのものへの信頼を壊す）。

そこで `asOf` と `note` の**両方が無いときだけ**警告する。
役割は分けてある: `asOf` = 基準時点（構造化スロット）/ `note` = 出典・調査方法（自由文）。
両方渡すと caption の枠に2行で並ぶ。

### 7-9. `LandingPage` が `hero.offers` を DOM 属性として出力していた（Slice 2 で修正）

生成 HTML のヒーロー `<section>` に、こう焼き付いていた。

```html
<section class="section_section … hero_section_hero" offers="[object Object],[object Object]">
```

原因は `landing-page.tsx` の `hero()` が `{...h}` をそのまま `HeroSection` に渡していたこと。
`offers` は `HeroSectionProps` に無いため `Section` 経由で DOM まで素通りし、
**React は未知の props を属性としてそのまま出す**（警告も出ない）。

見た目は1pxも変わらないので VRT でも axe でも Storybook の目視でも検出できない。
**生成物を文字列として読む検査でしか見つからない類の事故**であり、
Slice 2 を作った価値がここに出た。修正は `offers` を分割代入で取り除く1行。
`verify.mjs` に「データ props が DOM 属性へ漏れていない」検査を常設した。

### 7-10. SSG で出したフォームは和文ページでも英語になる（未修正・要判断）

`form-section.tsx` の言語判定はこれ1行。

```ts
const useIsJa = () => typeof document !== 'undefined' && document.documentElement.lang === 'ja';
```

サーバ側には `document` が無いので **SSR/SSG では必ず `false`**。
`<html lang="ja">` のページに置いた `ResourceRequestForm` が、実際にこう出た。

```html
<label for="input-name" class="form_primitives_label">Name</label>
…<button …>Download Resource</button>
```

hydrate すればブラウザ側で `ja` に切り替わるが、**フォームのページは hydrate しないのが
Netlify Forms の標準形**（素の POST で受ける）。つまり和文 LP の資料請求フォームが
英語のまま公開される。hydrate する場合はする場合で、SSR 出力（英語）と
クライアント初回描画（日本語）が食い違い、**ハイドレーションの不一致**になる。

日本市場向けの GTM デザインシステムとして、これは無視できない。ただし直し方は
API の選択（`lang` prop を足す / `Page` の context から取る / 既定を `ja` にする）を
含む設計判断なので、Slice 2 の範囲では**触らずに記録だけ**にした。
現状の回避策は `submitLabel` などを明示的に渡すこと。

- 影響: `ContactForm` / `ResourceRequestForm` / `DemoRequestForm` の3つ
- 検出できなかった理由: vitest（jsdom）には `document` があるので常に日本語で通る。
  **サーバ側だけが違う挙動をするコードは、ブラウザ環境のテストでは原理的に見えない**

**解消（2026-08-09 / fix/form-lang-default-ja）**: ブランドオーナー承認のもと
「既定 ja・`lang="en"` で英語」の決定的挙動に変更した。`useIsJa`（document 覗き見）は廃止。
astro-consumer の verify に「contact が日本語で静的出力される」検査を常設。

### 7-11. `.astro` で直接セクションを並べると面リズムエンジンが効かない

Stage 3 の核である `Page` の面リズム（default ↔ muted の交互割当）は、
`React.Children.toArray(children)` で子を1件ずつ見て種別を判定する実装になっている。
つまり **children が React 要素として渡っていること**が前提。

Astro の `.astro` テンプレートで `<Page>` の中にセクションを並べると、
Astro は子を**先にレンダリングした HTML の塊**として React に渡すため、
`Page` から見た子は不透明な1件になる。実測（5セクションを `.astro` で直接並べた検証ページ）:

| コンポーズの場所                            | `page_slotMuted` の出現 |
| ------------------------------------------- | ----------------------- |
| `defineLandingPage` + `<LandingPage>`       | 1件（**効いている**）   |
| `.astro` テンプレートで直接 5 セクション    | **0件**                 |

同じ理由で、暗面3連続の警告・h1 重複の警告・CTA ラベル2種の登録も、
`.astro` で組んだページでは働かない可能性が高い（いずれも Page 配下の React 構造に乗っている）。

**したがって Astro での推奨形は2つに限られる。**

1. `defineLandingPage` + `<LandingPage>`（データ駆動。LP 量産の本線）
2. セクションの並びを `.tsx` のコンポーネントにまとめ、`.astro` からはそれを1つ置くだけにする

「`.astro` に `<Section>` を並べる」は一見自然だが、**リズムも規範ガードも外れた
ただの部品置き場**になる。README にこの制約を書くかどうかは Stage 6 で判断する。
`verify.mjs` には「index（`LandingPage` 経由）で `page_slotMuted` が出ていること」を
常設し、支持されている経路のほうが壊れたら落ちるようにした。

### 7-12. astro-consumer-test をルートの `pnpm build` から除外している

`package.json` のルート `build` は `pnpm -r --filter=!astro-consumer-test build`。
理由は**リリース経路に消費側テストのビルドを挟まないため**で、
`release.yml` は `pnpm build` と `pnpm release`（= `pnpm build && changeset publish`）を
実行する。ここに astro build が入ると、消費側テストの都合（Astro のバージョン差、
ネットワーク、キャッシュ）で **npm への publish が止まる**。

検証は CI の `astro-consumer` job が `pnpm build` の後に明示的に呼ぶ形にした。

派生して2点。

- **pnpm**: `sharp` が astro の依存として入ってくる。postinstall（プリビルドバイナリの
  存在確認）は不要なので `pnpm-workspace.yaml` の `allowBuilds` に **`sharp: false`** と
  明示的に書いた。未宣言だと `ERR_PNPM_IGNORED_BUILDS` で install ごと落ちる
- **changesets**: `private: true` でも**バージョンとタグは付く**（publish だけが除外される）。
  実際 `changeset status` が `astro-consumer-test` を patch 対象に挙げていた。
  `.changeset/config.json` に `"privatePackages": { "version": false, "tag": false }` を
  足して、リリースの成果物から完全に外した

### 7-13. VRT は「知覚しにくい全面的な色差」に盲目（2026-08-10 の実測）

muted 面を #fafafa → #f4f4f5 に変えた際、パターン各ページの基準は**更新不要のまま通った**。
pixelmatch の per-pixel threshold 0.1 に対し、この色差（ΔRGB ≈ 6/255）は閾値未満で
「同じピクセル」と判定されるため。つまり **VRT が守るのはレイアウト・構造・
中〜大の色変化**であり、微妙なトーンシフトは人間の目視（プレビュー確認）が引き続き担う。
しきい値を下げれば拾えるが、アンチエイリアス誤差で偽陽性が増える取引になるため現状維持。
