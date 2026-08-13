---
'@siracusahq/gtm-design-system': minor
---

個別事例記事のページ型 `case-study-detail` を追加（実測 9 サイト × 3 記事 = 27 記事）

- `CaseStudyArticleSection`: パンくず → 記事タイトル（h1）→ 会社プロフィール → ヒーロー写真 → 冒頭サマリー → 章、という実測の標準構成を1部品として持つ。章は地の文（`paragraphs`）と問答（`qa`）のどちらか、写真は1章1枚まで
- パターン `case-study-detail`: 記事本体 + 関連事例 + 末尾 CTA。tone 既定は `product`
- `CaseStudyMeta` を新設し、一覧カード（`CaseStudyListItem`）と記事のプロフィールが同じ型を共有する。一覧カードの実装（`CaseCard`）も一覧と関連事例で共有するよう切り出した（見た目の二重実装を作らない）
- 実測に無いものは作っていない: 冒頭の数値タイル（0/27）・引用の飾り枠（0/27）・目次（2/9）・章ごとの面の交替（本文は 9/9 が単一面）
