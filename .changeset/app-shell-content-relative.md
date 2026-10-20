---
'@siracusahq/design-system': patch
---

AppShellContent（main）に `relative` を付け、本文の中の position:absolute な要素（sr-only のラベルなど）が main の外へ逃げて文書のスクロール領域を伸ばさないようにする（本文の末尾でさらにスクロールすると枠ごと流れて画面の下半分が白くなる不具合の修正）。
