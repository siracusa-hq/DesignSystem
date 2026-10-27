---
'@siracusahq/tokens': minor
'@siracusahq/design-system': minor
'@siracusahq/gtm-design-system': minor
---

業務ツールのブランド（`out-reacher`・`ad-operator`・`content-maker`）を登録した（spec §12 Q16）。

- `<html data-brand="out-reacher">` などで、primary の段・選択中の面・グラフの色・装飾が切り替わる。各ツールの `index.css` での書き写しは要らなくなる
- ロゴがまだないので全段を生成する。500 は書き写していた色とほぼ同じ（Out Reacher `#673ab7` → `#6445a6`、AdOperator `#0b78cf` → `#1675c6`、Content Maker `#b94047` → `#b64349`）。彩度を操作段の契約帯に収めたため、わずかに落ち着く
- グラフの色: 決まった順のまま飛ばした並びが検査に通らないときだけ、順を保って飛ばす色を増やす規則を足した。既存ブランドの並びは変わらない
- ui-web: `PAGE_BRANDS` に 3 つを足した
