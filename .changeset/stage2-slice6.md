---
'@siracusahq/gtm-design-system': minor
---

配布をコンパイル済み単一 CSS に切り替え、公開 API から className を全廃（Stage 2 Slice 6）。セットアップは `import '@siracusahq/gtm-design-system/styles.css'` の1行になり、Tailwind と `@source` の設定は不要（旧 `./globals.css` / `./theme.css` export は削除）。全公開インターフェースから `className` を除去（イチサンフォーム連携は `FormInput.autofillKey` で維持）。
