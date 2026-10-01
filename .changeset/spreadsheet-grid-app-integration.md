---
'@siracusahq/design-system': minor
---

SpreadsheetGrid: アプリと分け合う口を追加。選択の通知（onSelectionChange）、ref.select／ref.focus、グリッドより先に呼ぶキー操作（onKeyDown）、右クリックの項目（contextMenu・rowActions。合計行の右クリックも届く）、アプリ側で持つ元に戻す（history={false}）、貼り付けの差し替え（onPaste）、複製の作り方（duplicateRow）。Excel と同じ操作として、編集中の Ctrl/Cmd+Enter で範囲にまとめて入力、1 つの値を範囲に貼ると範囲すべてに入る、Ctrl/Cmd+X、列見出しで列を選ぶ、打ち始めの ↑↓ で確定して移動、Shift+Enter／Shift+Tab、範囲の外の右クリックでそのセルを選ぶ、を追加。外から rows が変わったときは、選んでいた行を行 ID で追いかける。
