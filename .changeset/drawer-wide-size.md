---
'@siracusahq/design-system': minor
---

`DrawerContent` に `size="wide"` を足した（#233）。

- 画面の半分の幅。640px より狭くせず、1100px より広くしない（`clamp(640px, 50vw, 1100px)`）。画面が 640px より狭いときは画面いっぱい
- 明細の表など、640px では窮屈な中身向け。`className` で幅を上書きしている場合は `size="wide"` に切り替えられる
- 固定表示（`pinned`）の引き出しにも `max-w-full` を付け、狭い画面ではみ出さないようにした
