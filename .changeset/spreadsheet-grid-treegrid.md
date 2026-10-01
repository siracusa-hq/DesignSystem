---
'@siracusahq/design-system': minor
---

SpreadsheetGrid に階層を追加。getRowDepth を渡すと階層つきの表（treegrid）になり、データは平らな配列のまま行の深さで親子を決める。treeColumnKey の列に字下げと ▼／▶ を出して畳む・開く（collapsedRowIds / onCollapsedRowIdsChange で外からも持てる）。矢印キーの移動・範囲・コピーは畳んだ配下を飛ばし、選んでいた行が隠れたら見えている親へ移る。行のドラッグと右クリックの上下移動は配下ごと動き、同じ親の兄弟の間にしか落とせない。既定の削除・複製は配下ごと、挿入は同じ深さ（createRow に depth が渡る）。行には aria-level・aria-expanded を付ける。
