---
'@siracusahq/gtm-design-system': minor
---

フォームの言語を決定的に: 既定は日本語、`lang="en"` で英語（ContactForm / ResourceRequestForm / DemoRequestForm）。旧実装はブラウザの document.lang を覗いており、Astro の静的生成では和文ページでもフォームが英語で公開される事故があった。
