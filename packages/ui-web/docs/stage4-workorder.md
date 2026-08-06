# Stage 4 作業指示書 — リード獲得（計測フック + 追従CTA）

設計の正本は [composition-redesign.md](./composition-redesign.md) §Stage 4。
運用は Stage 2/3 と同じ（縦切りスライス・PR ごとにユーザー承認でマージ・プレビュー目視）。

## 1. 狙い

Stage 3 までは「崩れないページが速く出る」まで。LP は**成果を測って改善する装置**であり、
そのための口が現状ゼロ。Stage 4 で計測の口と、確認できた2形態の追従 CTA を足す。

## 2. 決定事項（設計文書からの確定分）

| 項目 | 決定 |
| --- | --- |
| 計測タグ | **同梱しない**。GA4/GTM はベンダー選択であり DS が決めてはならない。フックまで |
| 追従 CTA | 実測で確認できた2形態のみ（固定ヘッダー内 2CTA / 右下カード）。**全幅下部バーは作らない**（実測 0/19） |
| FloatingCornerCTA の dismiss | **必須**（閉じられない追従要素はモバイルで本文を覆う） |
| FV の CTA | 2本が実測 13/17。**3本以上で dev 警告** |
| フォーム | 項目数の上限規則は作らない（実測1件のみ）。用途別にフォームを分ける実態に従う（用途セレクタは採らない） |

## 3. Slice 0 の API 設計（このスライスで確定させる）

### data-cta（CTA の識別子）

- `MarketingButton` に `ctaId?: string` を追加し、指定時に `data-cta` 属性を出す
- **id はセクションが自動割当する**（呼び出し側に命名させない）:
  - HeroSection: `hero-${i}` / CTABand: `cta-band-${i}` / CTASection: `closing-${i}`
  - MarketingHeader actions: `header-${i}` / PricingTable: `pricing-${i}`
  - フォーム送信ボタン（FormButton）: `form-submit`（form-name で区別できるため一律）
- 消費側が独自配置する MarketingButton は `ctaId` を明示指定できる

### Page.onCTAClick（ページ単位の一括受領）

- `onCTAClick?: (cta: { id: string; label: string; href?: string }, event: React.MouseEvent) => void`
- 実装はルート要素の capture フェーズでのクリック委譲
  （`closest('[data-cta]')`）。context 不要・SSR 安全・追加コストほぼゼロ
- LandingPage にも同名 prop を素通しで追加する

### フォーム送信イベント

- 3フォーム共通に `onResult?: (r: { ok: boolean; status?: number; error?: unknown }) => void` を追加
- `onResult` 指定時は **fetch による AJAX 送信**に切り替える
  （URL エンコード・`form-name` 同梱・POST 先は `action ?? location.pathname`。
  Netlify Forms の AJAX 送信仕様に一致）。成功/失敗を onResult で返す
- `onSubmit`（完全手動）と `action`（ネイティブ POST）の既存経路は変えない。
  ネイティブ POST は遷移するため成功/失敗イベントは原理的に出せない（ドキュメントに明記）

## 4. スライス

| # | 内容 | 完了条件 |
| --- | --- | --- |
| **0** | 計測フック: data-cta 自動割当 + `Page.onCTAClick` + フォーム `onResult`（AJAX） | LandingPage の全 CTA が一意の data-cta を持ち、クリックがページ単位で受領できる。AJAX 送信の成功/失敗がテストで固定されている |
| **1** | 追従 CTA 2部品: `StickyHeaderCTA`（固定ヘッダー内 2CTA。モバイル 45vw×40px 横並び）+ `FloatingCornerCTA`（右下 380×240 カード・×必須・モバイル内部 90%） | 実測値（カミナシ）どおりの構造。dismiss なしでは型が組めない |
| **2** | FV CTA 本数検査（hero の offers 3本以上で dev 警告）+ 送信ボタンラベルの規範（オファー名と一致させる。「送信」を既定にしない） | 警告がテストで固定されている |

## 5. Stage 4 でやらないこと

- 計測タグ・GTM スニペットの同梱（永久にやらない）
- 全幅の下部固定バー（実測 0 件。必要になったら根拠と一緒に）
- スクロール深度・ヒートマップ等の計測（フックの外。利用側ツールの領分）

## 6. 進捗

- [x] Slice 0 — 計測フック（data-cta / `Page.onCTAClick` / フォーム `onResult`）
  - `MarketingButton` / `FormButton` に `ctaId` を追加（指定時のみ `data-cta` を出力）。
    見た目は一切変えていない（属性とイベントだけ）
  - id の自動割当: `header-${i}` / `hero-${i}` / `cta-band-${i}` / `pricing-${i}` /
    `closing-${i}` / `form-submit`。**呼び出し側に命名させない**ので、
    どの LP でも同じキーで集計できる
  - 委譲ロジックは `src/lib/cta-click.ts` の `createCTAClickCapture()` に切り出した。
    `Page` と `LandingPage` が同じ実装を共有する
  - フォームは `onResult` 指定時のみ AJAX に切り替わる。
    既存の `onSubmit` / `action` / ネイティブ POST の挙動は不変（テストで固定）
  - `pnpm build` / `smoke` / codegen 差分なし / `lint:css` / `typecheck` / `test`（343件）/
    `size`（全枠が上限内。MarketingButton 8.18kB / 上限 10kB）すべて緑
- [x] Slice 1 — 追従 CTA 2部品（`StickyHeaderCTA` / `FloatingCornerCTA`）
  - 実測で確認できた2形態**だけ**を作った。全幅の下部固定バーは作っていない（実測 0/19）
  - `StickyHeaderCTA`: `position: fixed; top: 0; width: 100%` / `--z-header`。
    モバイルは CTA 2本が各 `45vw`・高さ `40px` で横並び、行高 60px。
    **高さぶんのスペーサーを部品が内蔵する**（呼び出し側で上余白を作らせない）。
    ナビは持たない（獲得 LP 用の簡易ヘッダー。フルナビは `MarketingHeader` の領分）
  - `FloatingCornerCTA`: `bottom/right: 30px; width: 380px`、モバイルは左右 `1rem` に張り
    内部ボタン `90%`。**× は常に描画され、消すための props を持たない**。
    閉じると同じマウントの間は再表示しない（内部 state。永続化はしない = 再訪時は出る）
  - data-cta 自動割当: `sticky-header-${i}` / `floating-${i}`
  - `--z-floating: 50`（`--z-header` より下・本文より上）を theme.css と
    `src/tokens/animation.ts` の `zIndex` の両方に追加
  - `createCTAClickCapture` を公開エクスポートに追加（下記 §7 の理由）
  - `pnpm build` / `smoke` / `codegen`（新規 d.ts 2件をコミット）/ `lint:css` /
    `typecheck`（src + stories）/ `test`（371件。うち新規26件）/
    `size`（バレル 49.27kB / 上限 55kB、styles.css 9.48kB / 上限 10kB）すべて緑
- [x] Slice 2 — 2026-08-06 完了。
  - FV の CTA 本数検査: HeroSection が actions 3本以上で dev 警告（実測: 2本が 13/17）。
    defineLandingPage 側は型で締めた（`OfferPair` = 最大2本のタプル。3本目はコンパイルエラー。
    lead-gen は1本固定）。**警告より型エラーのほうが強い防壁**なので、量産ルートは型で守る
  - 送信ボタンラベルの規範: 3フォームに `submitLabel` を追加（オファー名に合わせる用）。
    ContactForm の既定を汎用の「送信する / Send Message」から「問い合わせる / Contact Us」に変更。
    汎用語（送信・送信する・Submit・Send 等）を渡すと dev 警告
  - process.env.NODE_ENV を直接書くと DTS ビルドが落ちる（Stage 3 Slice 0 と同じ罠）。
    dev 検査は必ず `@/lib/dev` の `isDev` を使うこと（§7 に再掲）

## 7. 実装で判明した事項

0. **dev 検査で `process.env.NODE_ENV` を直接参照しない。** tsup の DTS ビルドは
   @types/node を持たず TS2580 で落ちる。必ず `@/lib/dev` の `isDev` を使う
   （Stage 3 Slice 0 に続き Slice 2 でも踏んだ。二度目なのでここに昇格して記録）

- **`LandingPage` の CTA 委譲は `Page` ではなく `PageLayout` に張る必要があった。**
  `MarketingHeader` は `PageLayout` の直下・`<Page>` の**外**に描画されるため、
  §3 の設計どおり `Page.onCTAClick` へ素通しすると `header-${i}` の CTA だけ
  取りこぼす。ヘッダー CTA は追従 CTA（Slice 1）の主戦場でもあり、
  計測できないと id を振る意味がない。
  委譲は1箇所（`PageLayout` の `onClickCapture`）だけに置いて二重発火を避けている。
  `Page.onCTAClick` は「一点物のページ」（README (b) の組み方）用に残してある。
  → **Slice 1 で追従 CTA を作るときも、`Page` の外に出る部品は同じ罠を踏む。**
  固定ヘッダー内 2CTA / 右下カードのどちらも `Page` の外に置かれる可能性が高いので、
  委譲点をどこにするかを先に決めること
- `MarketingHeader` はデスクトップ用とモバイルメニュー用で同じ actions を2回描画する。
  同じ導線なので `header-${i}` を共有させた（CSS でどちらか一方しか表示されない）。
  DOM 上は同じ id が2つ存在しうるので、**`data-cta` を DOM の一意キーとして
  扱ってはならない**（あくまで「どの導線か」の分類キー）
- `Page` の `onCTAClick` は `onClickCapture` を横取りする。呼び出し側が
  `onClickCapture` を渡していた場合に消さないよう、明示的に合成している
  （`createCTAClickCapture` の第2引数）
- Storybook の actions アドオンは `args` に値を入れると発火しない
  （明示値がスパイを上書きするため）。`argTypes: { onCTAClick: { action: … } }`
  だけを置いて args に入れない形にした（`計測_onCTAClick` ストーリー）
- `@storybook/addon-actions` は addon-essentials 経由の推移的依存でしかなく、
  pnpm の strict な node_modules では ui-web から直接 import できない。
  `action()` を直接呼ぶ書き方は使えない

### Slice 1（追従 CTA）

- **委譲の罠（Slice 0 §7 の予告）は現実になった。両部品とも `Page` の外に置かれる。**
  `StickyHeaderCTA` は `PageLayout` の `header` スロット、`FloatingCornerCTA` は
  `footer` スロットか `PageLayout` の外（body 直下）。どちらも `Page.onCTAClick` では
  拾えない。委譲点は**両方を含む祖先の `onClickCapture` 1箇所**に置くのが正解で、
  そのために `createCTAClickCapture` を公開エクスポートに追加した
  （これが無いと JSDoc の「祖先に張れ」という案内を利用者が実行できない）。
  両部品の JSDoc に「単体使用時は `Page.onCTAClick` では拾えない」と明記済み。
  テストは `PageLayout` の header / footer スロットに挿して委譲を固定している
- **`LandingPage` は現状この2部品を内包できない。** `PageLayout` の
  `header` / `footer` は ReactNode スロットを持つが、`LandingPage` は
  `headerProps` / `footerProps`（データ）しか通さないため。
  実戦例のストーリーは `<div onClickCapture>` で `StickyHeaderCTA` +
  `LandingPage` + `FloatingCornerCTA` を包む形にした。
  **パターン（`defineLandingPage`）への組み込みは今回やらない。**
  どのページ型に追従 CTA を既定で付けるべきかの実測データが無く、
  「常時 CTA を出す/出さない」は事業判断であって DS が決めることではない。
  やるとしたら `PageLayout` に `overlays?: React.ReactNode` スロットを足し、
  `LandingPage` に `stickyCta` / `floatingCta` を通す形になる（根拠が出たら）
- **`45vw × 2` は `Container` の中に収まらない。** `Container` のモバイル
  `padding-inline` は 1rem（両側 2rem）で、`90vw + gap` が収まるのは画面幅 400px 以上。
  375px 端末で横スクロールが出るため、`StickyHeaderCTA` だけ `Container` を使わず
  自前の padding（0.5rem）を持たせた。**実測の `45vw` は「ロゴを出さない」と
  セットの値**（2本で 90vw を使い切るため物理的にロゴが入らない）。
  モバイルでロゴを隠す判断はここから来ている
- **`FloatingCornerCTA` の高さ（実測 240px）は固定しなかった。** 実測値は
  「その内容での結果」であって仕様ではない。和文コピーは長さが暴れるため
  高さを固定すると溢れる（Stage 5 の「日本語の最悪ケース」と同じ問題）。
  幅・位置は実測どおり固定している。長い和文のストーリーで確認できる
- デスクトップの行高だけ実測が無いため、`MarketingHeader` の bar（4rem）に
  揃えた。モバイル 60px は実測どおり
- `--z-floating: 50` を追加した。`src/tokens/tokens.test.ts` の TS ⇄ CSS 突き合わせは
  color / spacing / elevation / motion の4系統だけを見ており `--z-*` は対象外だが、
  値を2箇所に書かない原則に従って `src/tokens/animation.ts` の `zIndex` にも入れた。
  `css-modules-contract.test.ts` は module.css ごとに自動でテストが増える作りなので、
  新規 CSS Modules 2件はそのまま検査対象に入った（追記不要）
- `FloatingCornerCTA` の `title` だけ `React.ReactNode` ではなく `string` にした。
  `role="complementary"` の `aria-label` の既定値に使うため。
  ハードコードテキストを持たずに a11y の既定を成立させる唯一の手
