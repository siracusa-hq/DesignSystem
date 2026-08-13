---
'@siracusahq/gtm-design-system': patch
---

CodeBlock のウィンドウ枠とコード面で背景色が割れていた不具合を修正（ビジュアル微修正 #7）。shiki がテーマ背景（github-dark #24292e）をインライン style で焼き込みクラス指定の打ち消しに勝っていたため、!important で透過させ --color-neutral-950 の1色に統一。
