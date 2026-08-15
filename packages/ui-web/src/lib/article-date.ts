/**
 * 記事の日付表示。
 *
 * **書式はシステムが決める。** 実測が4通りに割れており
 * （`2026.07.07` / `2026-08-14` / `2025/12/19` / `2026年07月14日`。
 * docs/research/research-news-blog.md §3-1）、利用側に選ばせる根拠が無い。
 * 最頻の `YYYY.MM.DD` に正規化する。
 *
 * `Intl` を使わないのは意図的。静的出力（SSG）でロケールに依存すると
 * 「書いたとおりに出る」性質が失われ、フォームの `lang` で踏んだのと同じ事故になる
 * （stage5-workorder.md §7-10）。
 */
export function formatArticleDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  // 想定外の値は握りつぶさずそのまま出す（利用側が気づけるように）
  return m ? `${m[1]}.${m[2]}.${m[3]}` : iso;
}

/** ISO 日付から年を取り出す（一覧の年フィルタ用）。取れなければ undefined */
export function articleYear(iso: string): string | undefined {
  const m = /^(\d{4})-\d{2}-\d{2}/.exec(iso);
  return m ? m[1] : undefined;
}
