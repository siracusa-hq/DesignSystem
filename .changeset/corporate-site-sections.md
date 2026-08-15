---
'@siracusahq/gtm-design-system': minor
---

コーポレートサイトの下層ページ向けに5部品を追加し、フォームに項目拡張の口を開けた

**破壊的変更（0.x の minor に含む）**

- `ContactForm` / `ResourceRequestForm` / `DemoRequestForm` の `ichisanEnabled` の既定値を `true` → `false` に変更した。外部スクリプト（ichisan.jp）を読み込む＝送信先が1つ増える判断であり、利用側が明示的に行うべきものと整理したため。**これまで既定のまま使っていた場合、会社名からの住所・法人番号の自動補完が静かに停止する。** 継続したい場合は `ichisanEnabled` を明示的に渡すこと。

**追加した部品**

- `ProseSection` — 箇条書きに割れない文章（ミッション・代表挨拶）のためのセクション。段落の寸法は `CaseStudyArticleSection` と共有する
- `DocumentArticle` — **法務文書・404 の器**。Markdown 由来の本文を受け、読み幅 46.5rem / 本文 16px・行間 1.80 / 章見出し 26px という事例記事の実測値をそのまま使う。**Markdown → HTML の変換は同梱しない**（依存を増やさないため、変換は利用側の責務）。お知らせ・ブログの記事は `article-detail` ページ型の担当なので、記事固有の語彙は持たせていない
- `CompanyProfileSection` — 会社概要表
- `LeadershipSection` — 経営陣。カードの意匠は `CaseCard` と揃える
- `HistorySection` — 沿革。縦の導線は引かず、節点だけを置く
- `FormCheckbox` — 同意チェック等の真偽値入力。OS 標準の見た目を使わず、`FormInput` と同じ線・角丸・フォーカスリングで描く

**フォームの拡張**

- `inquiryTypes`（問い合わせ種別・`ContactForm` のみ）/ `phone`（電話番号）/ `consent`（個人情報同意）を props として追加した。`consent` は未チェックでは送信できない
- `extraFields` で任意の項目を追加できるようにした。**開いているのは「項目」であって「見た目」ではない** — 受け取るのはデータだけで、描画は DS のフォーム部品に固定される（`className`・`children`・カスタムレンダラは無い）。組み込み項目と `name` が衝突すると dev 警告が出る

**規範の更新**

- GUIDELINES §3 に、散文規則の適用範囲（説明セクションが対象で、読み物の面は対象外）を明記した
- GUIDELINES §4 に、「見た目を選べない」と「内容を足せない」は別であることを追記した
- dev 警告が 9 種 → 11 種になった

**内部の共通化**

- ページ送りを `sections/pagination/` に切り出した。描画結果は変えていない。`article-list` ページ型（article-pages-workorder.md Slice 1）が同じものを必要とするため、先に共有可能な形にしてある
