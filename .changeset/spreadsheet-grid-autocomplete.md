---
'@siracusahq/design-system': minor
---

SpreadsheetGrid に候補つきの入力列（type: 'autocomplete'）を追加。決まった候補（options）は打った文字で絞り込み（全角/半角・ひらがな/カタカナ・大文字/小文字の違いを吸収）、関数で出す候補（getOptions）は 2 文字以上の前方一致か完全一致のときだけ先頭を選ぶ。renderOption・optionsHeader・optionsWidth で表示を変え、onSelectOption で行のほかの項目も書き換え、focusAfterSelect で選んだあとに移る列を決める。候補にない文字も確定でき（allowFreeText）、freeTextOption で「打った文字をそのまま入れる」行を出せる。日本語入力の変換中は候補を選ばない。候補つき入力列と Excel の貼り付けの読み取りで大きくなったため、サイズ枠（SpreadsheetGrid のみ）を 60 kB に上げた。
