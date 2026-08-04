---
'@siracusahq/gtm-design-system': minor
---

Stage 2 Slice 4b: 未移行の全コンポーネントを CSS Modules + テーマ契約スロットへ移行した。
**破壊的変更を含む**（見た目を選ばせる props の削除）。

移行したもの:

- プリミティブ5件 — Grid / Divider / GradientText / AnimatedCounter / AnimateOnScroll
- セクション13件 — FeatureGrid / FeatureShowcase / BentoGrid / ComparisonTable /
  TestimonialSection / LogoCloud / CaseStudySection / FAQSection /
  PricingTable / PricingCard / CodeBlock / ModuleOverview /
  MigrationComparison / AirPocketFeature

削除した props（面と余白はページが割り当てる / 見た目は構造から導出する）:

- 全セクション共通: `background` / `spacing` / `eyebrowStyle`
- `FeatureGrid`: `cardStyle` / `columns`（列数は件数から導出）
- `TestimonialSection` / `CaseStudySection`: `columns`（同上）
- `BentoGrid`: `BentoItem.variant`（強調は1件目に固定）
- `LogoCloud`: `scrolling`（8件以上で自動スクロール）
- `CodeBlock`: `alignment` / `layout`（`description` の有無から導出）
- `PricingCard`: `action.variant`（常に `cta`）
- `Text`: overline 系 7 バリアント（`Eyebrow` へ完全移行）
- `MarketingButton`: `gradient`（`cta` へ移行）
- `pricingCardVariants` の公開

型が変わったもの:

- `ShowcaseItem.image` → `MediaFrame` / `ProductShot` 要素のみ
- `Testimonial.avatar: ReactNode` → `avatarSrc?: string`（Avatar を内部生成）
- `Testimonial.companyLogo` / `CaseStudy.companyLogo` → `LogoMark` 要素のみ
- `LogoItem.logo: ReactNode` → `{ name, src?, node? }`（内部で `LogoMark` に包む）

追加:

- `PricingCard.priceUnit`（「/月」等の単位スロット）
- `AirPocketFeature.ownName` / `ownStatus`（ハードコード文言の追い出し）
