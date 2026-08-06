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
- [ ] Slice 1
- [ ] Slice 2

## 7. 実装で判明した事項

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
