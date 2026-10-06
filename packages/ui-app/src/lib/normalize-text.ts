/**
 * 照合用の正規化。全角と半角（NFKC）・ひらがなとカタカナ・大文字と小文字の違いを吸収し、
 * 前後の空白を除く。表示には使わず、一致や絞り込みの比較にだけ使う。
 */
export function normalizeText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .normalize('NFKC')
    .replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60))
    .toLowerCase()
    .trim();
}

/**
 * 数値の入力・貼り付けを読む。
 *
 * - 全角数字・全角のマイナス・数学記号のマイナス（−）・桁区切り（, ，）・「円」「¥」「￥」・空白を許す
 * - 会計の書き方の負数（▲1,200・△1,200・(1,200)）を読む。Excel から貼ったときにこの形で来る
 * - 16 進数（0x10）・指数表記（1e3）・Infinity は読まない
 *
 * 空なら null、数値として読めなければ undefined を返す。
 */
export function parseNumberText(text: string): number | null | undefined {
  let t = text
    .normalize('NFKC')
    .replace(/[\s,円¥]/g, '')
    .replace(/^[−‒–﹣]/, '-');
  if (t === '') return null;
  let negative = false;
  if (/^[▲△]/.test(t)) {
    negative = true;
    t = t.slice(1);
  } else if (/^\(.+\)$/.test(t)) {
    negative = true;
    t = t.slice(1, -1);
  }
  // ▲ や括弧のうえに符号があるもの（▲-5 など）は読まない
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t) || (negative && /^[+-]/.test(t))) return undefined;
  const n = negative ? -Number(t) : Number(t);
  return Number.isFinite(n) ? n || 0 : undefined;
}
