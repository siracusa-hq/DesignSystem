---
'@siracusahq/design-system': minor
---

FilterBar の選択UIを刷新。

- `FilterChipSelect` を新規追加: チップをクリックすると値の候補（例: Role → Owner/Admin/User/Guest）をマルチセレクトできる Linear 型のフィルターチップ
- `FilterSelector` を Radix DropdownMenu ベースに再構築: チェックボックスがネイティブ表示（黒）からブランドカラー（primary）になり、矢印キー・Esc などのキーボード操作に対応
- `FilterSelector` / `FilterChipSelect` をパッケージルートから export
