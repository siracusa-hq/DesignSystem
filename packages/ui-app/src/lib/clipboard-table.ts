/**
 * 表計算ソフト（Excel・Google スプレッドシート・Numbers）とやり取りする、
 * クリップボードの文字（タブ区切り・改行区切り）の読み書き。
 *
 * - 列はタブ、行は改行で区切る。改行は CRLF（Windows）・LF・CR（Mac の Excel の一部）のどれも受ける
 * - 改行やタブを含むセルは "…" で囲まれ、中の " は "" になる（Excel と同じ）
 */

/** i の位置から始まる "…" のセルを読む。囲みとして正しくなければ null */
function readQuoted(text: string, i: number): { value: string; end: number } | null {
  let value = '';
  let j = i + 1;
  while (j < text.length) {
    if (text[j] !== '"') {
      value += text[j];
      j++;
    } else if (text[j + 1] === '"') {
      value += '"';
      j += 2;
    } else {
      // 閉じの " のあとは、セルの終わり（タブ・改行・文字の終わり）でなければ囲みではない
      const next = text[j + 1];
      if (next !== undefined && next !== '\t' && next !== '\r' && next !== '\n') return null;
      return { value: value.replace(/\r\n?/g, '\n'), end: j + 1 };
    }
  }
  return null;
}

/**
 * コピーされた文字を行と列に分ける。最後の改行は行として数えない。
 * セルの途中の " や閉じていない " は、そのまま文字として読む。
 */
export function parseClipboardTable(text: string): string[][] {
  const rows: string[][] = [];
  if (!text) return rows;
  let row: string[] = [];
  let i = 0;
  for (;;) {
    const quoted = text[i] === '"' ? readQuoted(text, i) : null;
    if (quoted) {
      row.push(quoted.value);
      i = quoted.end;
    } else {
      let j = i;
      while (j < text.length && text[j] !== '\t' && text[j] !== '\r' && text[j] !== '\n') j++;
      row.push(text.slice(i, j));
      i = j;
    }
    if (i >= text.length) {
      rows.push(row);
      return rows;
    }
    if (text[i] === '\t') {
      i++;
      continue;
    }
    // 改行で行を閉じる
    i += text[i] === '\r' && text[i + 1] === '\n' ? 2 : 1;
    rows.push(row);
    row = [];
    if (i >= text.length) return rows;
  }
}

/** 行と列を、表計算ソフトに貼れる文字にする（parseClipboardTable の逆） */
export function formatClipboardTable(rows: string[][]): string {
  return rows
    .map((cells) =>
      cells
        .map((cell) =>
          /[\t\r\n]/.test(cell) || cell.startsWith('"') ? `"${cell.replace(/"/g, '""')}"` : cell,
        )
        .join('\t'),
    )
    .join('\n');
}
