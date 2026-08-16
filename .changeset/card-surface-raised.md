---
'@siracusahq/gtm-design-system': patch
---

沈んだ面の上でカード・フォーム部品が背景と同じ色になる不具合を修正した。

`<Page>` の面スロットは `--color-surface` を再定義して面を塗るため、スロットの内側で自分の背景に `--color-surface` を使っていた部品（ServicePortfolio / FeatureGrid / PricingCard / CaseStudyCard / TestimonialSection / SecurityBadges / ComparisonTable / MigrationComparison / Pagination / ShareButtons / フォーム部品 / SelectField / ProductShot / MarketingButton の secondary）が面と同色になり、浮いて見えなかった。浮く面のための `--color-surface-raised` に統一した（`.bgDark` が両方を暗い値へ振り替えているため暗面でも正しく効く）。

ニュートラルの muted 面でも起きていた（カードが `#f4f4f5` になる）が、面がほぼ白のため目視で気づきにくかった。同じ誤りを二度作らないよう、`css-modules-contract.test.ts` に「スロット内の部品は `--color-surface` を背景に使わない」検査を追加した。
