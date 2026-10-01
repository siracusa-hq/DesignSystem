import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  SpreadsheetGrid,
  type SpreadsheetColumn,
  type SpreadsheetGridHandle,
  type SpreadsheetGridProps,
  type SpreadsheetSelection,
} from './spreadsheet-grid';

/* 階層（getRowDepth で treegrid になる）のテスト */

interface Item {
  id: string;
  item: string;
  qty: number | null;
  depth: number;
}

const columns: SpreadsheetColumn<Item>[] = [
  { key: 'item', header: '品目', type: 'text' },
  { key: 'qty', header: '数量', type: 'number' },
];

const tree = (): Item[] => [
  { id: 'A', item: 'A', qty: 1, depth: 0 },
  { id: 'A1', item: 'A1', qty: 1, depth: 1 },
  { id: 'A2', item: 'A2', qty: 1, depth: 1 },
  { id: 'B', item: 'B', qty: 1, depth: 0 },
  { id: 'B1', item: 'B1', qty: 1, depth: 1 },
];

let seq = 0;
function Harness({
  onRows,
  gridRef,
  ...props
}: Partial<SpreadsheetGridProps<Item>> & {
  onRows?: (rows: Item[]) => void;
  gridRef?: React.Ref<SpreadsheetGridHandle>;
}) {
  const [rows, setRows] = React.useState(tree);
  return (
    <SpreadsheetGrid<Item>
      ref={gridRef}
      aria-label="明細"
      columns={columns}
      getRowId={(r) => r.id}
      getRowDepth={(r) => r.depth}
      createRow={(context) => ({
        id: `n${++seq}`,
        item: '',
        qty: null,
        depth: context?.depth ?? 0,
      })}
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
const ids = (rows: Item[]) => rows.map((r) => r.id);
const lastRows = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.at(-1)![0] as Item[];
const lastSelection = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.calls.at(-1)![0] as SpreadsheetSelection;

/** 行番号を押して、別の行の上で動かして離す（階層つきは行の上下半分で前後を決める） */
const drag = (from: string, over: string) => {
  const header = screen.getByRole('rowheader', {
    name: String(tree().findIndex((r) => r.id === from) + 1),
  });
  fireEvent.mouseDown(header);
  const tr = getCell(over).closest('tr')!;
  fireEvent.mouseMove(tr, { clientY: 10 });
  fireEvent.mouseUp(tr);
};

describe('階層の表示と移動', () => {
  it('treegrid として行に aria-level・aria-expanded を付け、畳むと配下を出さない', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Harness onSelectionChange={onSelectionChange} />);
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
    const rowA = getCell('A').closest('tr')!;
    expect(rowA).toHaveAttribute('aria-level', '1');
    expect(rowA).toHaveAttribute('aria-expanded', 'true');
    expect(getCell('A1').closest('tr')).toHaveAttribute('aria-level', '2');
    expect(getCell('A1').closest('tr')).not.toHaveAttribute('aria-expanded');
    fireEvent.mouseDown(screen.getAllByRole('button', { name: '畳む' })[0]);
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
    expect(rowA).toHaveAttribute('aria-expanded', 'false');
    // 畳んだ配下を飛ばして移動する
    await user.click(getCell('A'));
    await user.keyboard('{ArrowDown}');
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(3);
  });

  it('選んでいた行が畳まれて隠れたら、見えている親へ選択を移す', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Harness onSelectionChange={onSelectionChange} />);
    await user.click(getCell('A2'));
    fireEvent.mouseDown(screen.getAllByRole('button', { name: '畳む' })[0]);
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(0);
  });

  it('ref.select で隠れた行を選ぶと、上位を開いて選ぶ', () => {
    const ref = React.createRef<SpreadsheetGridHandle>();
    const onSelectionChange = vi.fn();
    render(<Harness gridRef={ref} onSelectionChange={onSelectionChange} />);
    fireEvent.mouseDown(screen.getAllByRole('button', { name: '畳む' })[1]);
    expect(screen.queryByText('B1')).not.toBeInTheDocument();
    act(() => ref.current!.select({ rowIndex: 4, columnKey: 'qty' }));
    expect(screen.getByText('B1')).toBeInTheDocument();
    expect(lastSelection(onSelectionChange).active).toEqual({ rowIndex: 4, columnKey: 'qty' });
  });

  it('畳む状態はアプリ側でも持てる（collapsedRowIds / onCollapsedRowIdsChange）', () => {
    const onCollapsedRowIdsChange = vi.fn();
    render(
      <Harness
        collapsedRowIds={new Set(['A'])}
        onCollapsedRowIdsChange={onCollapsedRowIdsChange}
      />,
    );
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('button', { name: '開く' }));
    expect(onCollapsedRowIdsChange).toHaveBeenCalledWith(new Set());
  });
});

describe('階層の並べ替えと行操作', () => {
  it('行のドラッグは同じ親の兄弟の間だけ、配下ごと動く', () => {
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    // 別の親（B）の子の位置へは落とせない
    drag('A1', 'B1');
    expect(onRows).not.toHaveBeenCalled();
    // 兄弟の後ろへは動かせる
    drag('A1', 'A2');
    expect(ids(lastRows(onRows))).toEqual(['A', 'A2', 'A1', 'B', 'B1']);
  });

  it('上位の行を動かすと配下ごと動く', () => {
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    drag('A', 'B');
    expect(ids(lastRows(onRows))).toEqual(['B', 'B1', 'A', 'A1', 'A2']);
  });

  it('右クリックの「下へ移動」は兄弟と配下ごと入れ替え、兄弟がなければ押せない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    fireEvent.contextMenu(getCell('A'));
    await user.click(await screen.findByText('下へ移動'));
    expect(ids(lastRows(onRows))).toEqual(['B', 'B1', 'A', 'A1', 'A2']);
    fireEvent.contextMenu(getCell('B1'));
    expect(await screen.findByRole('menuitem', { name: '下へ移動' })).toHaveAttribute(
      'data-disabled',
    );
  });

  it('既定の行操作の削除は配下ごと消す', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    fireEvent.contextMenu(getCell('A'));
    await user.click(await screen.findByText('行を削除'));
    expect(ids(lastRows(onRows))).toEqual(['B', 'B1']);
  });

  it('「下に行を挿入」は配下の後ろに同じ深さで入れる（createRow に depth が渡る）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    fireEvent.contextMenu(getCell('A'));
    await user.click(await screen.findByText('下に行を挿入'));
    const rows = lastRows(onRows);
    expect(ids(rows).slice(0, 3)).toEqual(['A', 'A1', 'A2']);
    expect(rows[3]).toMatchObject({ item: '', depth: 0 });
    expect(rows[4].id).toBe('B');
  });

  it('has no accessibility violations（階層・固定列・合計行）', async () => {
    const footerColumns: SpreadsheetColumn<Item>[] = [
      { key: 'item', header: '品目', type: 'text', footer: '合計' },
      { key: 'qty', header: '数量', type: 'number' },
    ];
    const { container } = render(
      <Harness columns={footerColumns} stickyColumns={1} renderRowHeader={(_, i) => `${i + 1}`} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
