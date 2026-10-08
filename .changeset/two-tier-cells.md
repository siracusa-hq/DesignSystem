---
'@siracusahq/design-system': minor
---

SpreadsheetGrid に2段セル（fields）を追加。列定義に fields: [上段, 下段] を指定すると、その列は1レコードが上下2段で描画される（会計システムの仕訳入力の借方/貸方など）。fields を持たない列は rowSpan=2 で1段のまま。矢印キー・Enter は上段→下段→次レコードの順に移動し、コピー&ペーストは1レコード=2行の TSV で Excel と相互運用できる。バリデーション・未保存マーカーは段ごと、行操作・D&D・Undo はレコード単位。階層（getRowDepth）とは同時に使えない。あわせて、値が空の select セルで選択肢を選んでも確定されないことがある不具合を修正。
