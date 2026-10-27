---
"@siracusahq/design-system": minor
---

業務 UI もブランドを持つようにした。`<html data-brand="proofline">` などで、primary の段・選択中の面・グラフの 1 色目・ログインの画面の装飾がそのブランドに切り替わる（属性なしはコーポレートで、今までと同じ）。

- 生成物 `styles/generated-brand.css` を足し、`globals.css` が読み込む（`tokens.css`・`semantic.css` を個別に読む場合は、そのあとに読む）
- `AuthLayout`・`AuthVisualContent` は装飾用 brand スケールの JS 定数をやめ、CSS 変数（`--color-bg-brand-deep`・`--color-decor-brand`・`--color-decor-brand-strong`・`--color-text-brand-on-dark`）を使う
- Storybook にブランドの切り替え（ツールバーの Brand）を足した
