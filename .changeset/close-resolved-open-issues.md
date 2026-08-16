---
---

ドキュメントのみの変更のため、公開されるパッケージに影響しない。

`packages/ui-web/docs/` 配下（設計の正本と作業指示書）の更新で、
`package.json` の `files` に含まれないため配布物は変わらない。
CI の changeset ゲートは `packages/` 配下の変更を検知するので、
意図的に不要であることを示す空の changeset を置く。
