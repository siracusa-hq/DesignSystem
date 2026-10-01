---
'@siracusahq/design-system': minor
---

SpreadsheetGrid: セル単位の入力可否（isCellEditable / onEditBlocked）、表示の差し替え（column.render）、書き込み口（column.setValue）、行の class（rowClassName）、行番号（renderRowHeader / rowHeaderWidth）、左の列の固定（stickyColumns）、合計行（column.footer）、column.align / column.className、行 ID（getRowId）を追加。行の型はセル以外の項目（入れ子のオブジェクトなど）も持てるようにした。行は部品に分けて memo 化し、変わった行だけを描き直す。
