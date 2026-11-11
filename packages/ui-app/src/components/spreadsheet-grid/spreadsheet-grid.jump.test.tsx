import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SpreadsheetGrid,
  type SpreadsheetColumn,
  type SpreadsheetSelection,
} from './spreadsheet-grid';

/* Cmd/Ctrl+矢印で端へ移る（Excel・Google スプレッドシートと同じ）のテスト */

interface Line {
  id: string;
  a: string;
  b: string;
  c: string;
  d: string;
}

const columns: SpreadsheetColumn<Line>[] = [
  { key: 'a', header: 'A', type: 'text' },
  { key: 'b', header: 'B', type: 'text' },
  { key: 'c', header: 'C', type: 'text' },
  // 計算列は表示する値で見る
  { key: 'd', header: 'D', type: 'readonly', getValue: (row) => (row.a ? `${row.a}!` : '') },
];

// A 列: 1〜3 行に値・4〜5 行は空・6 行に値・7〜8 行は空
// 1 行目: A・B に値・C は空・D は計算で値
const rows: Line[] = [
  { id: '1', a: 'a1', b: 'b1', c: '', d: '' },
  { id: '2', a: 'a2', b: '', c: '', d: '' },
  { id: '3', a: 'a3', b: '', c: '', d: '' },
  { id: '4', a: '', b: '', c: '', d: '' },
  { id: '5', a: '', b: '', c: '', d: '' },
  { id: '6', a: 'a6', b: '', c: '', d: '' },
  { id: '7', a: '', b: '', c: '', d: '' },
  { id: '8', a: '', b: '', c: '', d: '' },
];

function setup() {
  const onSelectionChange = vi.fn();
  render(
    <SpreadsheetGrid<Line>
      aria-label="表"
      columns={columns}
      rows={rows}
      onRowsChange={() => {}}
      getRowId={(r) => r.id}
      onSelectionChange={onSelectionChange}
    />,
  );
  const last = (): SpreadsheetSelection => onSelectionChange.mock.calls.at(-1)![0];
  return { user: userEvent.setup(), last };
}
const cell = (rowIndex: number, col: number) =>
  within(screen.getAllByRole('row')[rowIndex + 1]).getAllByRole('gridcell')[col];

describe('SpreadsheetGrid Cmd/Ctrl+矢印', () => {
  it('↓: 値の続く端 → 次の値 → 表の端。↑ はその逆', async () => {
    const { user, last } = setup();
    await user.click(cell(0, 0));
    await user.keyboard('{Meta>}{ArrowDown}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 2, columnKey: 'a' });
    await user.keyboard('{Meta>}{ArrowDown}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 5, columnKey: 'a' });
    await user.keyboard('{Meta>}{ArrowDown}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 7, columnKey: 'a' });
    await user.keyboard('{Meta>}{ArrowUp}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 5, columnKey: 'a' });
    await user.keyboard('{Meta>}{ArrowUp}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 2, columnKey: 'a' });
    await user.keyboard('{Meta>}{ArrowUp}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 0, columnKey: 'a' });
  });

  it('空のセルからは次の値へ。Windows の Ctrl でも同じ', async () => {
    const { user, last } = setup();
    await user.click(cell(3, 0));
    await user.keyboard('{Control>}{ArrowDown}{/Control}');
    expect(last().active).toEqual({ rowIndex: 5, columnKey: 'a' });
  });

  it('←→: 同じ行で値の続く端・次の値・表の端へ（計算列は表示する値で見る）', async () => {
    const { user, last } = setup();
    await user.click(cell(0, 0));
    await user.keyboard('{Meta>}{ArrowRight}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 0, columnKey: 'b' });
    await user.keyboard('{Meta>}{ArrowRight}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 0, columnKey: 'd' });
    await user.keyboard('{Meta>}{ArrowLeft}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 0, columnKey: 'b' });
    await user.keyboard('{Meta>}{ArrowLeft}{/Meta}');
    expect(last().active).toEqual({ rowIndex: 0, columnKey: 'a' });
  });

  it('Shift も押すと範囲を広げる', async () => {
    const { user, last } = setup();
    await user.click(cell(0, 0));
    await user.keyboard('{Shift>}{Meta>}{ArrowDown}{/Meta}{/Shift}');
    expect(last().rowIndexes).toEqual([0, 1, 2]);
    expect(last().columnKeys).toEqual(['a']);
  });

  it('端にいるときは動かない', async () => {
    const { user, last } = setup();
    await user.click(cell(7, 0));
    const before = last();
    await user.keyboard('{Meta>}{ArrowDown}{/Meta}');
    expect(last().active).toEqual(before.active);
  });
});
