---
'@siracusahq/design-system': minor
---

SpreadsheetGrid に、手入力を助ける指定を足した。

- `autoFill`: 空のセルに自動で入れる値。`on: 'click'` は空のセルを押したとき、`'edit'` は空のセルで編集を始めたとき（ダブルクリック・Enter・F2）に入れる
- `setValue` の 3 つめの引数 `{ source }`: 書き込みのきっかけ（`'edit'`・`'auto'`・`'paste'`・`'fill'`・`'clear'`）。手で入れたときだけほかの項目を整える、といった使い分けに使う
- `minDate`・`maxDate`（type: 'date'）: 選べる日の範囲。範囲の外はカレンダーで選べず、貼り付けても入らない
- `initialOption`（autocomplete）: 文字を打たずに候補を開いたときに選んでおく候補。その候補まで一覧を送る
- date 列の貼り付けで、`2026/12/5`・`2026年12月5日` も読む（暦に無い日は入れない）
- autocomplete で今の値と同じ候補を選んだだけなら、書かない（貼り付けなどと同じ）
- Cmd/Ctrl+矢印で、値の続く端・次の値・表の端へ移る（Excel・Google スプレッドシートと同じ。Shift も押すと範囲を広げる）
