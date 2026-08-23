---
'@siracusahq/tokens': patch
'@siracusahq/gtm-design-system': patch
---

fix: CTA スロット（`--color-bg-cta` ほか4変数）がブランド切替に追従しない問題を修正（#157）

CSS カスタムプロパティの `var()` は宣言要素の計算値確定時に解決されてから継承されるため、`:root` での宣言だけでは `data-brand` 切替に追従しなかった（0.18 の修正は不完全）。codegen を変更し、各 `[data-brand='...']` ブロック内でも CTA スロット4変数を再宣言してブランドスコープ上で再解決させる。回帰テストを追加。
