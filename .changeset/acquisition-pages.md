---
'@siracusahq/gtm-design-system': minor
---

獲得系ページ型 `resources-library` / `seminar-list` / `seminar-detail` を追加した（ページ型 8種 → 11種）

資料ライブラリとセミナーの一覧・詳細。実測は `docs/research/research-resources-seminar.md`（資料 7ページ + 6個票 / セミナー 8ページ + 21本）と、実装前に通したゲート計測（`packages/ui-web/docs/acquisition-pages-workorder.md` §9）。

**追加した部品**

- `ResourceListSection` / `ResourceCard` — 資料ライブラリ。**日付もページャも持たない**（実測 日付 0/7・無限スクロール 0/31）
- `SeminarListSection` / `SeminarCard` — セミナー一覧。予定・終了・アーカイブを1つの一覧で扱う（実測 0/8 が分けていない）
- `SeminarDetailSection` — セミナー詳細。概要 / おすすめ / プログラム / 開催要項 / 登壇者 / 申込フォーム

**`status` で持てる情報が変わる**

`SeminarDetailSection` と `SeminarListItem` は `status: 'upcoming' | 'closed' | 'archive'` の判別ユニオン。**アーカイブに開催日時は、開催予定に視聴期限は型として存在しない。** 全部 optional の1型にすると「開催日時の無い開催予定」「視聴期限のある LIVE」が型で許されてしまうため。

`sold-out`（満席・実測 0/29）と `permanent`（常設・1/21）は型に含めていないが、判別ユニオンへの値追加は非破壊なので根拠が出れば後から足せる。

**`lead-gen` に `header?` を戻した（非破壊）**

資料個票のページ型は新設していない。`lead-gen` との差分がグローバルナビ1点だけで、実測は資料個票 6/6 がナビを持つため。**省略時に剥がす既定は据え置き**で、既存の呼び出しは1つも変わらない（テストで固定してある）。

**共有語彙の決定（Slice 0）**

`ContentImage` / `ContentPerson` を追加した。**カードは統合していない** — 事例 / 記事 / 資料 / セミナーは必須項目が違い、1型に寄せると全部 optional になって「日付の無い記事」「状態の無いセミナー」が型で通ってしまうため。詳細は `docs/composition-redesign.md` 末尾「共有語彙の決定」。

これに伴い `article-pages-workorder.md` §2 の「ContentHub のカード語彙を `ArticleListItem` に合わせる」は撤回した（獲得系のカードは日付を持たないため寄せられない）。ContentHub は4系統のカードを union で受け取る設計になる。

**状態を色だけで区別しない**

「受付中」と「受付終了」を色相だけで分けると色覚特性によっては判別できないため、状態バッジは文言を必ず併記する。

**規範の更新**

- GUIDELINES §2 に `resources-library` / `seminar-list` / `seminar-detail` の節を追加
- AGENTS.md / GUIDELINES.md の語彙をページ型11種に更新
