---
'@siracusahq/gtm-design-system': minor
---

Stage 2 Slice 6: 公開 API から `className` を全廃した（破壊的変更）。

- プリミティブ8種（Container / Section / Text / Grid / Divider / GradientText /
  AnimatedCounter / AnimateOnScroll）に暫定存置していた `@deprecated className` を削除
- `React.HTMLAttributes` 等の継承経由で `className` を型受容していた穴を全数塞いだ。
  全公開インターフェースを `Omit<…, 'className'>` に統一（sections 18 / layout 3 /
  primitives 12 / form 4）。消費側からの見た目の上書き口はこれで完全に閉じた
- 内部でプリミティブへ `className` を渡していた14箇所は、意匠を持つラッパー要素へ
  移した（余白・読み幅・太字はラッパー、文字の役割は Text/Heading の props）。
  DOM 出力は同一で、見た目は変わらない
- 一酸フォームの会社名オートコンプリートは class 名でしか指定できないため、
  `FormInput` に列挙で閉じた `autofillKey`（値は `'company_name'` のみ）を追加した
