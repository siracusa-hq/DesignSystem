---
'@siracusahq/gtm-design-system': minor
'@siracusahq/tokens': patch
---

顔になるページの面をニュートラルグレーからブランドティント淡色（白 50% + ramp-50）へ変更し、`<Page>` に面の割当口を2つ追加した。

- `surfaces`: スロットごとの明示割当。LP 系（product / product-portfolio-top / lead-gen）は機械的な交互をやめ、白の連続の中に社会的証明の塊だけがティントで浮かぶ配置になる
- `autoSurface`: 自動割当が沈んだ面に使う色。`corporate-top` は交互リズムを保ったまま色だけティントになる（既定は従来どおり `muted`）

事例系・記事系・獲得系のページ型は従来のニュートラルの自動ゼブラのまま。既定の見た目は変わらない。

tokens 側はティント面のコントラスト期待値（全4ブランド × 白 / CTABand 面 / 本文）をテストに追加。
