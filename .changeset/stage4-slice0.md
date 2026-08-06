---
'@siracusahq/gtm-design-system': minor
---

計測フックを追加（Stage 4 Slice 0）。`MarketingButton` / `FormButton` / `PricingCard` に `ctaId` を追加し、指定時に `data-cta` を出力する。id はセクションが自動割当するため呼び出し側は命名不要（ヘッダー `header-${i}` / FV `hero-${i}` / 中間帯 `cta-band-${i}` / 料金 `pricing-${i}` / 締め `closing-${i}` / フォーム送信 `form-submit`）。`Page` と `LandingPage` に `onCTAClick` を追加し、ページ内の CTA クリックを `{ id, label, href }` として一括で受け取れるようにした（capture フェーズのクリック委譲）。フォーム3種に `onResult` を追加し、指定時は Netlify Forms の AJAX 仕様（URL エンコード・`form-name` 同梱）で fetch 送信して成功/失敗を返す。既存の `onSubmit` / `action` / ネイティブ POST の挙動は変えていない。計測タグ（GA4 / GTM 等）は同梱しない。
