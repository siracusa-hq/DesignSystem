---
'@siracusahq/tokens': minor
'@siracusahq/design-system': minor
---

グラフの色（chart-1〜5）をブランドに合わせて決め、見分けやすさの検査に通るようにした（spec §12 Q15）。

- 1 色目はブランドの色相。2 色目以降は決まった順の候補（スレートの青・琥珀・ローズ・スミレ・ティール・橙・マゼンタ）から、ブランドの色相に近い色を飛ばして使う。`data-brand` で切り替わる
- どのブランドも、明るい画面・暗い画面の両方で、隣り合う色が色覚の多様性でも見分けられ（ΔE≥8）、地とのコントラストが 3:1 以上
- 既定（コーポレート）の色も変わる: 明るい画面 `#038e7d・#026abe・#a87502・#be425f・#733699`、暗い画面 `#039583・#3c95f0・#a87502・#e1627c・#9d60c6`。以前の色は検査に通っていなかった（スレートの青とティールが見分けにくい・琥珀が白地で薄すぎる・暗い画面で明るすぎる）
- `chartColors.semantic` を状態の色（成功・エラー・注意の 600）にした。系列の色はブランドで並びが変わるため
- 系列の色は `semantic.css` から `generated-brand.css` に移った。`semantic.css` を個別に読む消費側は `generated-brand.css` も読む
- tokens: `chartPaletteFor`・`checkCategorical`・`CHART_POOL` などを追加
