---
'@siracusahq/gtm-design-system': minor
---

Stage 2 Slice 2+3: コーポレートトップを構成するセクション・レイアウトを移行し、検証関門を通過した。

- 移行: HeroSection / StatsSection / SecurityBadges / CTASection /
  MarketingHeader / MarketingFooter / PageLayout（CSS Modules + スロット参照）
- 新規: `ServicePortfolio`（product-portfolio-top 型の主役。カードが data-brand で
  各ブランド色に切り替わる）/ SectionHeader（内部共有）
- **破壊的**: 削除 — `background` / `spacing` / `eyebrowStyle`（対象セクション）、
  `HeroSection` の `titleGradient` / `backgroundPattern` / `layout`（→ `imagePlacement`）、
  `CTASection` の `backgroundMesh` / `logoStrip`、`StatsSection.animated`、
  `actions[].variant`（自動割当: Hero=primary/secondary、CTA=cta/secondary）
- 追加: `CTASection.kicker` / `StatsSection.note`（時点注記）/
  `SecurityBadge.category`（認証・受賞・法定表示の3系統）
- Storybook: `Examples/CorporateTop`（検証関門の実ページ）
