---
'@siracusahq/gtm-design-system': patch
---

Stage 2 Slice 0: CSS Modules 移行基盤を導入した。

- `*.module.css.d.ts` 自動生成（クラス名の typo / リネームを型エラー化）
- stylelint 検問所（生 hex / 名前色 / `--ramp-*` 直参照を禁止）
- 契約テスト（`var()` の未定義トークン参照を検出）
- spacing スケールの CSS 変数実体宣言（`--spacing-0〜24`、TS との同期テスト付き）
- Container を CSS Modules へ移行（パイプラインの end-to-end 実証。見た目は不変）
