---
'@siracusahq/design-system': minor
---

スプレッドシート風の一括入力グリッド SpreadsheetGrid を追加。見積明細のような複数行×複数列の編集を想定し、矢印/Tab/Enter のセル移動、F2・文字入力・ダブルクリックでの編集、Shift+矢印/ドラッグでの範囲選択、Excel/Google Sheets との TSV コピー&ペースト、右クリックでの行操作（挿入/複製/移動/削除）に対応。バリデーションエラーはセル入力中にリアルタイム表示される。列型は text / number / select / date / checkbox / readonly（計算列）をサポート。getSpreadsheetErrors で全セルのエラーを集計できる。
