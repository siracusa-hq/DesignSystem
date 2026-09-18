---
'@siracusahq/design-system': minor
---

会社名の入力補完 `CompanyLookupField` と、その基盤になる非同期の入力補完 `Autocomplete` を追加。`Autocomplete` は Combobox と違い自由入力を保ったまま候補を出す（間引き・最低文字数・直前照会の abort・同一文字列の再利用・WAI-ARIA combobox のキーボード操作）。`CompanyLookupField` は候補に社名・法人番号・所在地だけを出し、選ぶと `onCompanySelect` で候補をそのまま呼び出し側へ渡す（フォーム側が法人番号欄・住所欄に入れる。候補の供給は `searchCompanies` で外から注入。Polastack では `@polastack/sdk` の `client.registry.searchCorporations` + `toCompanyCandidate`）。
