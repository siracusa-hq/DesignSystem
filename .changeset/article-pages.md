---
'@siracusahq/gtm-design-system': minor
---

記事系ページ型 `article-list` / `article-detail` を追加した（ページ型 6種 → 8種）

お知らせ（News）とブログの一覧・記事ページ。実測は `docs/research/research-news-blog.md`（7サイト / News 12記事 + ブログ 15記事）と、実装前に通したゲート計測（`packages/ui-web/docs/article-pages-workorder.md` §9-1）。

**追加した部品**

- `ArticleListSection` — フィルタ（カテゴリ / 年）+ カードグリッド + ページ送り。値が2種類以上ある軸だけ自動でフィルタを出す
- `ArticleCard` / `ArticleListItem` — 記事カード。意匠は `CaseCard` と揃え、語彙は分けている（会社名・数値バッジを持たない）。**一覧・関連記事・ContentHub がこの1つの型を共有する**
- `ArticleBodySection` / `ArticleRelatedSection` — 記事本体と関連記事
- `ShareButtons` — X / Facebook / はてブ / LINE / Pocket

**`kind` で News とブログを分ける**

`ArticleBodySection` は `kind: 'news' | 'blog'` の判別ユニオン。**News には著者・監修者・目次・更新日が型として存在しない**（実測 0/12）。両方 optional の1型にすると「著者と目次を持つ News」という実測に無い構成が型で許されてしまうため。

**日付は ISO で受ける**

`publishedAt` は `YYYY-MM-DD` で渡す。表示書式（`YYYY.MM.DD`）はシステムが決める — 実測が4通りに割れており、利用側に選ばせる根拠が無い。`Intl` を使わないのは意図的で、SSG でロケールに依存すると「書いたとおりに出る」性質が失われるため。

**必須にしていないもの**

末尾 CTA（News 7/12・ブログ 11/15）と一覧への戻り導線（News 10/12・ブログ 11/15）は任意。事例記事はどちらも 27/27 で必須だったが、記事系は実測が違う。

**読み幅は事例記事と共有する**

実ブラウザ計測（16本）でブログ中央値 680px / News 780px / 全体 725px。現行 `46.5rem`（744px）との差は 2.6% で、種別ごとに割らず1つに保つ判断をした。ブログが実測レンジの狭い側にいる事実は作業指示書に記録してある。

**規範の更新**

- GUIDELINES §2 に `article-list` / `article-detail` の節を追加
- AGENTS.md / GUIDELINES.md の語彙をページ型8種に更新
