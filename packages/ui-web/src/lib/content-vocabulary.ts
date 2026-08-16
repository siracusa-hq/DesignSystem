/**
 * 系統をまたいで共有する小さな語彙（獲得系 Slice 0 の結論。
 * docs/composition-redesign.md 末尾「共有語彙の決定」）。
 *
 * **カードは統合していない。** 事例 / 記事 / 資料 / セミナーは必須項目が違い、
 * 1型に寄せると全部 optional になって「日付の無い記事」「状態の無いセミナー」が
 * 型で通ってしまう。統合したのは、その下にある小さな語彙だけ。
 */

/**
 * 画像。`alt` を必須にする契約は3系統で共通だったため統合した。
 *
 * TypeScript は構造的部分型なので、既存の `{ src; alt }` を持つ型
 * （`ArticleListItem.thumbnail` など）とはそのまま相互に代入できる。
 */
export interface ContentImage {
  src: string;
  /** 何が写っているかを書く。装飾なら空文字にする */
  alt: string;
}

/**
 * 人物（登壇者・執筆者）。
 *
 * セミナーの登壇者に使う。`CaseSpeakerList`（最大4名のタプル）と
 * `ArticlePerson`（著者・監修者）は構造的に互換なので改名していない —
 * 改名は破壊的変更で、得られるものが名前の統一だけになるため。
 */
export interface ContentPerson {
  name: string;
  /** 所属・会社名 */
  organization?: string;
  /** 肩書き */
  role?: string;
  /** 経歴・プロフィール文 */
  bio?: string;
  photo?: ContentImage;
}
