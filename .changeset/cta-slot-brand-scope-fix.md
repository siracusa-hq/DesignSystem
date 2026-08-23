---
'@siracusahq/tokens': patch
'@siracusahq/gtm-design-system': patch
---

CTA スロット（`--color-bg-cta` ほか）が全ブランドで既定ブランドのティールに凍結されるバグを修正。カスタムプロパティ内の var() は宣言された要素で解決されてから継承されるため、`:root` だけの宣言では `[data-brand]` の切替に追従しない。codegen のセレクタを `:root, [data-brand]` に変更し、`variant="cta"` のボタン（料金カード・CTABand・CTASection の第1アクション）がページのブランド操作色に正しく追従するようにした。
