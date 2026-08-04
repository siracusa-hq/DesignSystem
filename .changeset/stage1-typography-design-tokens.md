---
'@siracusahq/tokens': minor
'@siracusahq/gtm-design-system': minor
---

Stage 1 後半: 和文タイポグラフィの修正と意匠トークンの拡張。

**gtm-design-system**

- 和文組版を `:lang(ja)` に一本化（`<html lang="ja">` が前提）:
  `line-break: strict` / `text-spacing-trim: space-all` / `overflow-wrap: break-word` /
  見出しの `palt` が body の `cv01/cv03/cv04/tnum` を上書きするバグを修正
  （数値訴求の等幅数字を保持）/ 見出し `text-wrap: balance`・本文 `pretty`
- **和文ガード**（@layer 外）: 和文見出しの負の字送りを構造的に無効化し、
  行間を 1.35/1.45 に補正（国内BtoB 8社実測: 負の字送り0社・見出し行間1.3〜1.4収束）
- デッドコード `.lang-ja` / `.lang-en` を削除
- 2層シャドウ `raised / card / card-hover / overlay` を追加（LPカード用・neutral由来の影色）
- 役割名ラディウス `control / media / card / panel / pill` を追加
- 演出系モーション `--duration-reveal(640ms) / --duration-ambient(1200ms)` と
  `--ease-entrance / exit / emphasis` を追加。`prefers-reduced-motion` はトークン層で一括処理
- `AnimateOnScroll` のハードコード（600ms / ease-out）を演出系トークンに置換

**tokens**

- 第3のオプション役割 `--color-cta-*` を追加（既定は操作色への var() フォールバック。
  data-brand 切替に自動追従）
