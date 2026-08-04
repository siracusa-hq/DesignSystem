---
'@siracusahq/tokens': patch
'@siracusahq/gtm-design-system': minor
---

Stage 2 Slice 1: コーポレートトップ用プリミティブ8個を CSS Modules + テーマ契約スロットへ移行し、新規2個を追加した。

- 移行: Container / Section / Heading / Text / MarketingButton / Badge / Link / Logo。
  色参照はすべて抽象スロット（data-brand に自動追従）
- 新規: `Eyebrow`（旧 Text overline 7種の後継・pill 1形）/ `LogoMark`（ロゴ表示の正規化）
- `MarketingButton` に `cta` バリアント追加（`--color-cta-*` 第3役割）。
  `gradient` は cta へのエイリアスとして @deprecated
- Heading に和文 per-size 組版（:lang(ja) で行間 1.30〜1.45・字送り0）を実装
- tokens: スロット `--color-text-brand-strong`（700段）を契約に追加
