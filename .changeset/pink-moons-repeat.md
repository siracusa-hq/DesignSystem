---
'@siracusahq/gtm-design-system': patch
---

`LandingPage` が `hero.offers` を DOM 属性として出力していた問題を修正。

生成 HTML のヒーロー `<section>` に `offers="[object Object],[object Object]"` という
無効な属性が焼き付いていた（React は未知の props をそのまま属性として出すため）。
画面上は何も変わらないので目視でも既存テストでも気づけず、Stage 5 Slice 2 で追加した
Astro 消費側結合テストの生成物検査で発覚した。`offers` は `actions` に変換して渡す
内部データであり、DOM に出す意図は元から無い。
