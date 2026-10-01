import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  SpreadsheetGrid,
  type SpreadsheetColumn,
  type SpreadsheetGridProps,
} from './spreadsheet-grid';

/* セルの入力可否・表示の差し替え・行の class・行番号・固定列・合計行・行 ID のテスト */

interface Item {
  id: string;
  item: string;
  qty: number | null;
  note: string;
  /** セル以外の項目（入れ子のオブジェクトも持てる） */
  meta?: { source: string };
}

const baseColumns: SpreadsheetColumn<Item>[] = [
  { key: 'item', header: '品目', type: 'text' },
  { key: 'qty', header: '数量', type: 'number' },
  { key: 'note', header: '備考', type: 'text' },
];

const makeRows = (): Item[] => [
  { id: 'a', item: 'サーバー構築', qty: 1, note: '', meta: { source: 'x' } },
  { id: 'b', item: '保守', qty: 12, note: '月額' },
];

function Harness({
  initial = makeRows(),
  onRows,
  ...props
}: Partial<SpreadsheetGridProps<Item>> & {
  initial?: Item[];
  onRows?: (rows: Item[]) => void;
}) {
  const [rows, setRows] = React.useState(initial);
  return (
    <SpreadsheetGrid<Item>
      aria-label="明細"
      columns={baseColumns}
      createRow={() => ({ id: `n${Math.random()}`, item: '', qty: null, note: '' })}
      getRowId={(r) => r.id}
      {...props}
      rows={rows}
      onRowsChange={(next) => {
        setRows(next);
        onRows?.(next);
      }}
    />
  );
}

const getCell = (text: string) => screen.getByText(text).closest('td')!;
const cellAt = (row: number, col: number) =>
  document.querySelector(`tbody tr[aria-rowindex="${row + 1}"]`)!.querySelectorAll('td')[
    col
  ] as HTMLElement;
const lastRows = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.at(-1)![0] as Item[];

describe('セルの入力可否', () => {
  it('isCellEditable が false のセルは、打鍵・Delete・貼り付けで変わらず onEditBlocked が呼ばれる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const onEditBlocked = vi.fn();
    render(
      <Harness
        onRows={onRows}
        onEditBlocked={onEditBlocked}
        isCellEditable={(row, column) => !(row.id === 'a' && column.key === 'qty')}
      />,
    );
    const cell = cellAt(0, 1);
    await user.click(cell);
    expect(cell).toHaveAttribute('aria-readonly', 'true');
    // 入力欄は置かず、セルにフォーカスする
    expect(cell).toHaveFocus();
    await user.keyboard('5');
    await user.keyboard('{Delete}');
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => '9' } });
    expect(onRows).not.toHaveBeenCalled();
    expect(onEditBlocked).toHaveBeenCalledWith(
      expect.objectContaining({
        rowIndex: 0,
        column: expect.objectContaining({ key: 'qty' }),
      }),
    );
  });

  it('範囲の Delete では、入力できないセルだけを飛ばす', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness
        onRows={onRows}
        isCellEditable={(row, column) => !(row.id === 'a' && column.key === 'qty')}
      />,
    );
    await user.click(cellAt(0, 1));
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}{Delete}');
    expect(lastRows(onRows).map((r) => r.qty)).toEqual([1, null]);
  });
});

describe('表示の差し替えと書き込み', () => {
  it('render・rowClassName・renderRowHeader・footer・setValue が使われる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const columns: SpreadsheetColumn<Item>[] = [
      {
        key: 'item',
        header: '品目',
        type: 'text',
        render: (row) => <strong>{`【${row.item}】`}</strong>,
        // 品目を変えたら備考も変える
        setValue: (row, value) => ({ ...row, item: String(value ?? ''), note: '変更あり' }),
        footer: (rows) => `合計 ${rows.length} 行`,
      },
      { key: 'qty', header: '数量', type: 'number', footer: '—' },
    ];
    render(
      <Harness
        columns={columns}
        onRows={onRows}
        rowClassName={(row) => (row.id === 'b' ? 'row-b' : undefined)}
        renderRowHeader={(row, i) => `No.${i + 1}-${row.id}`}
      />,
    );
    expect(screen.getByText('【保守】')).toBeInTheDocument();
    expect(document.querySelector('tr.row-b')).not.toBeNull();
    expect(screen.getByRole('rowheader', { name: 'No.2-b' })).toBeInTheDocument();
    expect(document.querySelector('tfoot')).toHaveTextContent('合計 2 行');
    await user.click(getCell('【保守】'));
    await user.keyboard('X{Enter}');
    expect(lastRows(onRows)[1]).toMatchObject({ item: 'X', note: '変更あり' });
    // セル以外の項目（入れ子のオブジェクト）はそのまま残る
    expect(lastRows(onRows)[0].meta).toEqual({ source: 'x' });
  });

  it('align と className がセルに付く', () => {
    const columns: SpreadsheetColumn<Item>[] = [
      { key: 'item', header: '品目', type: 'text', align: 'center', className: 'cell-item' },
    ];
    render(<Harness columns={columns} />);
    const cell = getCell('保守');
    expect(cell).toHaveClass('cell-item');
    expect(cell).toHaveClass('text-center');
  });
});

describe('列の固定と行 ID', () => {
  it('表の最小幅を、行番号の列と列幅の合計にする（狭いときは横にスクロールする）', () => {
    const columns: SpreadsheetColumn<Item>[] = [
      { key: 'item', header: '品目', type: 'text', width: 200 },
      { key: 'qty', header: '数量', type: 'number' },
    ];
    render(<Harness columns={columns} rowHeaderWidth={60} />);
    expect(screen.getByRole('grid')).toHaveStyle({ minWidth: '420px' });
  });

  it('stickyColumns で行番号の列と左の列を固定する', () => {
    render(<Harness stickyColumns={1} />);
    const row = document.querySelector('tbody tr')!;
    expect((row.querySelector('th') as HTMLElement).style.position).toBe('sticky');
    expect(cellAt(0, 0).style.position).toBe('sticky');
    expect(cellAt(0, 1).style.position).toBe('');
  });

  it('getRowId を渡すと、並べ替えても変更したセルの印が同じ行に残る', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('保守'));
    await user.keyboard('X{Enter}');
    expect(document.querySelectorAll('td[data-dirty]')).toHaveLength(1);
    // 行 1 を行 2 の下へ動かす
    fireEvent.mouseDown(screen.getByRole('rowheader', { name: '1' }));
    fireEvent.mouseEnter(getCell('X').closest('tr')!);
    fireEvent.mouseUp(getCell('X').closest('tbody')!);
    const dirty = document.querySelectorAll('td[data-dirty]');
    expect(dirty).toHaveLength(1);
    expect(dirty[0]).toHaveTextContent('X');
  });

  it('has no accessibility violations（固定列・行番号・合計行・入力不可のセル）', async () => {
    const columns: SpreadsheetColumn<Item>[] = [
      { key: 'item', header: '品目', type: 'text', footer: '合計' },
      { key: 'qty', header: '数量', type: 'number' },
    ];
    const { container } = render(
      <Harness
        columns={columns}
        stickyColumns={1}
        renderRowHeader={(_, i) => `${i + 1}`}
        isCellEditable={(row, column) => !(row.id === 'a' && column.key === 'qty')}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
