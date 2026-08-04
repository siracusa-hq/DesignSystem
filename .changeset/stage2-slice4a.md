---
'@siracusahq/gtm-design-system': minor
---

Stage 2 Slice 4a: ビジュアル資産プリミティブ3種を追加した。

- `MediaFrame` — 固定アスペクト比（16:9/4:3/3:2/1:1）のメディアスロット。
  素材未定時はプレースホルダを表示（構造を先に組める）
- `ProductShot` — プロダクト画面専用。ブラウザ枠/枠なし・下端フェード・
  影と角丸は常に同一処理。傾き・パースは提供しない（実測8社で0件）
- `Avatar` — 1:1 円形固定。イニシャルフォールバック
- `HeroSection.image` を MediaFrame/ProductShot 要素のみに型制約
- `MarketingButton.fullWidth` 追加（ヘッダーの inline style を置換）
