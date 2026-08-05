---
'@siracusahq/gtm-design-system': minor
---

Stage 2 Slice 5: フォームを Netlify Forms 標準にし、BentoGrid を削除した。

- **Formspree を完全削除**（ブランド側決定。ホスティングが Netlify に一本化済み）。
  フォーム3種は `data-netlify` / `form-name` / honeypot を標準で描画し、
  Netlify に置くだけで送信が機能する。`formName` / `action`（サンクスページ）/
  独自バックエンド用の `onSubmit` を提供。`formspreeId` / 送信状態UIは削除
- フォーム3種とプリミティブを CSS Modules へ移行（送信ボタンは CTA 第3役割）。
  `autocomplete` / `inputmode` を標準付与（入力摩擦の削減）
- **BentoGrid を削除**（国内BtoB実測19ページで採用ゼロ・FeatureGrid 等と役割重複）。
  海外 dev-tool 向け展開が現実になった時点で、当該セグメントの調査を踏まえ再設計する
