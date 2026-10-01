import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenuItem } from '@/components/context-menu';
import {
  SpreadsheetGrid,
  type SpreadsheetColumn,
  type SpreadsheetGridHandle,
  type SpreadsheetGridProps,
  type SpreadsheetSelection,
} from './spreadsheet-grid';

/* 選択・キー操作・右クリック・元に戻す・貼り付けをアプリと分け合う口と、
   Excel と同じ操作（範囲入力・範囲への貼り付け・切り取り・列の選択など）のテスト */

interface Item {
  id: string;
  item: string;
  qty: number | null;
  note: string;
}

const columns: SpreadsheetColumn<Item>[] = [
  { key: 'item', header: '品目', type: 'text' },
  { key: 'qty', header: '数量', type: 'number' },
  { key: 'note', header: '備考', type: 'text' },
];

const makeRows = (): Item[] => [
  { id: 'a', item: 'サーバー構築', qty: 1, note: '' },
  { id: 'b', item: '保守', qty: 12, note: '月額' },
];

function Harness({
  initial = makeRows(),
  onRows,
  gridRef,
  ...props
}: Partial<SpreadsheetGridProps<Item>> & {
  initial?: Item[];
  onRows?: (rows: Item[]) => void;
  gridRef?: React.Ref<SpreadsheetGridHandle>;
}) {
  const [rows, setRows] = React.useState(initial);
  return (
    <SpreadsheetGrid<Item>
      ref={gridRef}
      aria-label="明細"
      columns={columns}
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
const lastSelection = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.calls.at(-1)![0] as SpreadsheetSelection;

describe('選択・キー操作・右クリック・元に戻すをアプリと分け合う', () => {
  it('onSelectionChange で選択が届き、ref.select で選べる', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const ref = React.createRef<SpreadsheetGridHandle>();
    render(<Harness gridRef={ref} onSelectionChange={onSelectionChange} />);
    await user.click(getCell('保守'));
    expect(lastSelection(onSelectionChange)).toEqual({
      active: { rowIndex: 1, columnKey: 'item' },
      rowIndexes: [1],
      columnKeys: ['item'],
    });
    act(() =>
      ref.current!.select({ rowIndex: 0, columnKey: 'note' }, { rowIndex: 1, columnKey: 'note' }),
    );
    expect(lastSelection(onSelectionChange).active).toEqual({ rowIndex: 0, columnKey: 'note' });
    expect(lastSelection(onSelectionChange).rowIndexes).toEqual([0, 1]);
    expect(cellAt(0, 2).contains(document.activeElement)).toBe(true);
  });

  it('onKeyDown で preventDefault すると、グリッドはそのキーを処理しない', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Harness
        onSelectionChange={onSelectionChange}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') e.preventDefault();
        }}
      />,
    );
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{ArrowDown}');
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(0);
  });

  it('contextMenu で項目を足し、rowActions={false} で既定の行操作を消せる', async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(
      <Harness
        rowActions={false}
        contextMenu={(target) =>
          target.kind === 'cells' ? (
            <ContextMenuItem onSelect={() => onPick(target)}>カスタム操作</ContextMenuItem>
          ) : null
        }
      />,
    );
    fireEvent.contextMenu(getCell('保守'));
    await user.click(await screen.findByText('カスタム操作'));
    expect(screen.queryByText('行を削除')).not.toBeInTheDocument();
    expect(onPick).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'cells',
        rowIndex: 1,
        rowIndexes: [1],
        columnKey: 'item',
      }),
    );
  });

  it('合計行の右クリックは kind: footer で届く', async () => {
    const footerColumns: SpreadsheetColumn<Item>[] = [
      { key: 'item', header: '品目', type: 'text', footer: '合計' },
    ];
    render(
      <Harness
        columns={footerColumns}
        rowActions={false}
        contextMenu={(target) => (
          <ContextMenuItem>{target.kind === 'footer' ? '合計の操作' : '行の操作'}</ContextMenuItem>
        )}
      />,
    );
    fireEvent.contextMenu(screen.getByText('合計', { selector: 'td' }));
    expect(await screen.findByText('合計の操作')).toBeInTheDocument();
  });

  it('history={false} では Cmd/Ctrl+Z をグリッドが取らず、外からの変更でも変更セルの印を消さない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const outer = vi.fn();
    render(
      <div onKeyDown={(e) => outer(e.key)}>
        <Harness history={false} onRows={onRows} />
      </div>,
    );
    await user.click(getCell('保守'));
    await user.keyboard('X{Enter}');
    expect(onRows).toHaveBeenCalledTimes(1);
    await user.keyboard('{Control>}z{/Control}');
    // グリッドは戻さず、キーはアプリへ届く
    expect(onRows).toHaveBeenCalledTimes(1);
    expect(outer).toHaveBeenCalledWith('z');
    expect(document.querySelector('td[data-dirty]')).not.toBeNull();
  });

  it('onPaste で貼り付けを差し替えられる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness
        onRows={onRows}
        onPaste={({ matrix, selection }) => [
          ...makeRows(),
          {
            id: 'p',
            item: `${matrix[0][0]}@${selection.active.rowIndex}`,
            qty: null,
            note: '',
          },
        ]}
      />,
    );
    await user.click(getCell('保守'));
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => 'A\tB\nC\tD' } });
    expect(lastRows(onRows).map((r) => r.item)).toEqual(['サーバー構築', '保守', 'A@1']);
  });

  it('外から行が足されても、選んでいた行を ID で追いかける', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    function Outer() {
      const [rows, setRows] = React.useState(makeRows);
      return (
        <>
          <button
            type="button"
            onClick={() => setRows((rs) => [{ id: 'z', item: '先頭', qty: null, note: '' }, ...rs])}
          >
            先頭に足す
          </button>
          <SpreadsheetGrid<Item>
            aria-label="明細"
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            getRowId={(r) => r.id}
            onSelectionChange={onSelectionChange}
          />
        </>
      );
    }
    render(<Outer />);
    await user.click(getCell('保守'));
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(1);
    await user.click(screen.getByRole('button', { name: '先頭に足す' }));
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(2);
  });
});

describe('Excel と同じ操作', () => {
  it('編集中の Ctrl+Enter で範囲の入力できるセルすべてに入る', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(0, 1));
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}7{Control>}{Enter}{/Control}');
    expect(lastRows(onRows).map((r) => r.qty)).toEqual([7, 7]);
  });

  it('1 つの値を範囲に貼ると範囲すべてに入る', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(0, 2));
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => '同じ' } });
    expect(lastRows(onRows).map((r) => r.note)).toEqual(['同じ', '同じ']);
  });

  it('Ctrl+X でコピーしてから空にする', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('保守'));
    await user.keyboard('{Control>}x{/Control}');
    expect(await navigator.clipboard.readText()).toBe('保守');
    expect(lastRows(onRows)[1].item).toBe('');
  });

  it('列見出しのクリックで列を選ぶ', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('columnheader', { name: '数量' }));
    expect(document.querySelectorAll('td[aria-selected="true"]')).toHaveLength(2);
  });

  it('打ち始めで入った編集中は ↓ で確定して下へ、Shift+Enter で上へ', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const onSelectionChange = vi.fn();
    render(<Harness onRows={onRows} onSelectionChange={onSelectionChange} />);
    await user.click(cellAt(0, 2));
    await user.keyboard('X{ArrowDown}');
    expect(lastRows(onRows)[0].note).toBe('X');
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(1);
    await user.keyboard('Y{Shift>}{Enter}{/Shift}');
    expect(lastRows(onRows)[1].note).toBe('Y');
    expect(lastSelection(onSelectionChange).active.rowIndex).toBe(0);
  });

  it('範囲の外を右クリックすると、そのセルを選び直す', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Harness onSelectionChange={onSelectionChange} />);
    await user.click(cellAt(0, 0));
    fireEvent.contextMenu(cellAt(1, 2));
    expect(lastSelection(onSelectionChange).active).toEqual({ rowIndex: 1, columnKey: 'note' });
  });
});
