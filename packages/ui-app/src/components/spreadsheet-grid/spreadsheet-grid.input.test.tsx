import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpreadsheetGrid, type SpreadsheetColumn, type SpreadsheetRow } from './spreadsheet-grid';

/* 日本語入力・打ち始めの 1 文字目・数値の解釈・貼り付けのテスト */

interface Item extends SpreadsheetRow {
  item: string;
  qty: number | null;
  unit: string | null;
  note: string;
}

const columns: SpreadsheetColumn<Item>[] = [
  { key: 'item', header: '品目', type: 'text' },
  { key: 'qty', header: '数量', type: 'number' },
  {
    key: 'unit',
    header: '単位',
    type: 'select',
    options: [
      { value: 'set', label: '式' },
      { value: 'sqm', label: '㎡' },
    ],
  },
  { key: 'note', header: '備考', type: 'text' },
];

const makeRows = (): Item[] => [
  { item: 'サーバー構築', qty: 1, unit: 'set', note: '' },
  { item: '保守', qty: 12, unit: null, note: '月額' },
];

function Harness({ onRows }: { onRows?: (rows: Item[]) => void }) {
  const [rows, setRows] = React.useState(makeRows);
  return (
    <SpreadsheetGrid
      aria-label="明細"
      columns={columns}
      rows={rows}
      onRowsChange={(next) => {
        setRows(next);
        onRows?.(next);
      }}
      createRow={() => ({ item: '', qty: null, unit: null, note: '' })}
    />
  );
}

const getCell = (text: string) => screen.getByText(text).closest('td')!;
const cellAt = (row: number, col: number) =>
  document.querySelector(`tbody tr[aria-rowindex="${row + 1}"]`)!.querySelectorAll('td')[
    col
  ] as HTMLElement;
const lastRows = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.at(-1)![0] as Item[];

describe('日本語入力と打ち始め', () => {
  it('選んだセルに続けて打つと、すべての文字が入る（1 文字目が消えない）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 3));
    await user.keyboard('abc');
    expect(screen.getByRole('textbox')).toHaveValue('abc');
    await user.keyboard('{Enter}');
    expect(lastRows(onRows)[1].note).toBe('abc');
  });

  it('入力できるセルを選ぶと、セルの中の入力欄にフォーカスが入る', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('保守'));
    expect(document.activeElement?.tagName).toBe('INPUT');
    expect(getCell('保守').contains(document.activeElement)).toBe(true);
  });

  it('変換の開始で編集に入り、変換確定の Enter では確定せず、次の Enter で確定する', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 3));
    const input = screen.getByRole('textbox');
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'かいたい' } });
    // 同じ入力欄のまま（フォーカスを移さないので変換が途切れない）
    expect(screen.getByRole('textbox')).toBe(input);
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode: 229 });
    fireEvent.compositionEnd(input);
    expect(onRows).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(lastRows(onRows)[1].note).toBe('かいたい');
  });

  it('ダブルクリックで編集に入ると、カーソルは末尾（Excel と同じ）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.dblClick(getCell('保守'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('保守');
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
  });
});

describe('数値の解釈と貼り付け', () => {
  const typeQty = async (text: string) => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('12'));
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, text);
    await user.keyboard('{Enter}');
    return onRows;
  };

  it.each([
    ['１３', 13],
    ['1,200円', 1200],
    ['¥1,500', 1500],
    ['−5', -5],
    ['－3', -3],
    ['▲1,200', -1200],
    ['△5', -5],
    ['(1,200)', -1200],
    ['（３００）', -300],
  ])('「%s」を %d として読む', async (text, expected) => {
    const onRows = await typeQty(text);
    expect(lastRows(onRows)[1].qty).toBe(expected);
  });

  it.each(['0x10', '1e3', 'Infinity'])('「%s」は数値として読まず、編集を続ける', async (text) => {
    const onRows = await typeQty(text);
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('数値で入力してください');
  });

  it('読めない値を貼り付けても、セルを空にしない（元の値を残す）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('12'));
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => 'abc' } });
    expect(onRows).not.toHaveBeenCalled();
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => '1,200円' } });
    expect(lastRows(onRows)[1].qty).toBe(1200);
  });

  it('select への貼り付けは表記ゆれを吸収する（m2 → ㎡）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('式'));
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => 'm2' } });
    expect(lastRows(onRows)[0].unit).toBe('sqm');
  });
});

describe('Excel・スプレッドシートからの貼り付け', () => {
  const paste = (text: string) =>
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => text } });

  it.each([
    ['CRLF（Windows の Excel）', 'A\t2\r\nB\t3\r\n'],
    ['CR だけ（Mac の Excel の一部）', 'A\t2\rB\t3\r'],
  ])('改行が %s でも行に分けて入れる', async (_, text) => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('サーバー構築'));
    paste(text);
    const rows = lastRows(onRows);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ item: 'A', qty: 2 });
    expect(rows[1]).toMatchObject({ item: 'B', qty: 3 });
  });

  it('セル内に改行のあるセル（"…" で囲まれる）は、1 つのセルとして入れる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('月額'));
    paste('"1行目\n2行目"\r\n');
    const rows = lastRows(onRows);
    expect(rows).toHaveLength(2);
    expect(rows[1].note).toBe('1行目\n2行目');
  });

  it('コピーは、改行を含むセルを "…" で囲む（Excel に貼っても 1 つのセルになる）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('月額'));
    paste('"1行目\n2行目"');
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    await user.keyboard('{Control>}c{/Control}');
    expect(await navigator.clipboard.readText()).toBe('\t"1行目\n2行目"');
  });
});
