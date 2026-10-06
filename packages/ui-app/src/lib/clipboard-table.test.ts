import { describe, it, expect } from 'vitest';
import { formatClipboardTable, parseClipboardTable } from './clipboard-table';

describe('parseClipboardTable', () => {
  it.each([
    ['LF', 'a\t1\nb\t2\n'],
    ['CRLF（Windows の Excel）', 'a\t1\r\nb\t2\r\n'],
    ['CR だけ（Mac の Excel の一部）', 'a\t1\rb\t2\r'],
  ])('改行が %s でも行に分ける', (_, text) => {
    expect(parseClipboardTable(text)).toEqual([
      ['a', '1'],
      ['b', '2'],
    ]);
  });

  it('最後の改行は行として数えず、空のセルは残す', () => {
    expect(parseClipboardTable('a\t\tc\r\n')).toEqual([['a', '', 'c']]);
    expect(parseClipboardTable('a')).toEqual([['a']]);
    expect(parseClipboardTable('')).toEqual([]);
  });

  it('"…" で囲まれたセルは、中の改行・タブ・"" ごと 1 つのセルとして読む', () => {
    expect(parseClipboardTable('x\t"1行目\n2行目"\r\n"a\tb"\t"5インチ"""\r\n')).toEqual([
      ['x', '1行目\n2行目'],
      ['a\tb', '5インチ"'],
    ]);
  });

  it('囲まれたセルの中の CRLF・CR は LF にそろえる', () => {
    expect(parseClipboardTable('"a\r\nb\rc"')).toEqual([['a\nb\nc']]);
  });

  it('セルの途中の " や、閉じていない " はそのまま文字として読む', () => {
    expect(parseClipboardTable('5"\t"abc\n')).toEqual([['5"', '"abc']]);
    expect(parseClipboardTable('"abc"def\t1')).toEqual([['"abc"def', '1']]);
  });
});

describe('formatClipboardTable', () => {
  it('列をタブ、行を改行でつなぐ', () => {
    expect(
      formatClipboardTable([
        ['a', '1'],
        ['b', ''],
      ]),
    ).toBe('a\t1\nb\t');
  });

  it('改行・タブを含むセルと " で始まるセルは "…" で囲み、中の " は "" にする', () => {
    expect(formatClipboardTable([['1行目\n2行目', 'a\tb', '"引用"', '5"']])).toBe(
      '"1行目\n2行目"\t"a\tb"\t"""引用"""\t5"',
    );
  });

  it('parseClipboardTable で元の表に戻る', () => {
    const table = [
      ['名称', '規格\n2 行目', '"a"'],
      ['', 'x\ty', '5"'],
    ];
    expect(parseClipboardTable(formatClipboardTable(table))).toEqual(table);
  });
});
