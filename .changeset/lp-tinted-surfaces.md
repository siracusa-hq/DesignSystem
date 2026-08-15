---
'@siracusahq/gtm-design-system': minor
'@siracusahq/tokens': patch
---

LP パターンの面をブランドティント淡色（白 50% + ramp-50）に変更し、`<Page>` に面を明示割当する `surfaces` prop を追加（既定の自動ゼブラは維持）。product / product-portfolio-top / lead-gen は社会的証明などの塊だけがティントで浮かぶ配置になる。

tokens 側はティント面のコントラスト期待値（全4ブランド × 白 / CTABand 面 / 本文）をテストに追加。
