---
'@siracusahq/design-system': minor
---

`DialogContent` / `AlertDialogContent` が子要素の間隔（`flex flex-col gap-6`）を持つようになった。見出し・本文・フッターを並べるだけで間隔が揃う。**本文の上下に付けていた余白（`pt-*` / `mt-*` / `py-*` など）や、`flex flex-col gap-*` の上書きは外すこと**（外さないと間隔が二重になる）。`AlertDialogFooter` が持っていた `mt-6` は削除した（見出し＋フッターだけの構成なら見た目は変わらない。フッターに `mt-*` を付けて調整していた場合は外す）。あわせて、見出しとフッターを固定して本文だけをスクロールさせる `DialogBody` / `AlertDialogBody` を追加し、デスクトップでは高さを画面内（`100dvh - 2rem`）に収めるようにした。
