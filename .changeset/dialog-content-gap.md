---
'@siracusahq/design-system': minor
---

`DialogContent` が子要素の間隔（`flex flex-col gap-6`）を持つようになった。`DialogHeader` / 本文 / `DialogFooter` を並べるだけで間隔が揃う。**本文の上下に付けていた余白（`pt-*` / `mt-*` / `py-*` など）や、`DialogContent` への `flex flex-col gap-*` の上書きは外すこと**（外さないと間隔が二重になる）。あわせて、見出しとフッターを固定して本文だけをスクロールさせる `DialogBody` を追加し、デスクトップでは `DialogContent` の高さを画面内（`100dvh - 2rem`）に収めるようにした。
