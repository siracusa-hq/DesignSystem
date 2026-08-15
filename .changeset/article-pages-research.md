---
---

News / ブログ系ページ型の実測調査（`[NB]`）と、その設計文書への反映。

**リリース不要（空の changeset）。** 本 PR は `packages/ui-web/docs/` の設計文書と
`docs/research/` の調査記録だけを変更しており、`packages/*/src/` は1行も触っていない。
利用者に配られるコードに変更が無いため、バージョンを上げる対象が無い。

実装（`article-list` / `article-detail` の追加）は別 PR で行い、
そちらで minor の changeset を切る。分解は
`packages/ui-web/docs/article-pages-workorder.md`。
