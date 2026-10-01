import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  SpreadsheetGrid,
  type SpreadsheetColumn,
  type SpreadsheetGridProps,
  type SpreadsheetSelection,
} from './spreadsheet-grid';

/* 候補つきの入力列（type: 'autocomplete'）のテスト */

interface Item {
  id: string;
  item: string;
  qty: number | null;
  unit: string | null;
  note: string;
}

const unitColumn: SpreadsheetColumn<Item> = {
  key: 'unit',
  header: '単位',
  type: 'autocomplete',
  options: [
    { value: '式', label: '式' },
    { value: '㎡', label: '㎡' },
    { value: 'ｍ', label: 'ｍ' },
  ],
};

const products = [
  { value: '1', label: '配管工事', data: { qty: 3, unit: '式' } },
  { value: '2', label: '配線工事', data: { qty: 5, unit: 'ｍ' } },
];

const itemColumn: SpreadsheetColumn<Item> = {
  key: 'item',
  header: '品目',
  type: 'autocomplete',
  getOptions: (q) => products.filter((o) => o.label.startsWith(q)),
  onSelectOption: (row, o) => {
    const data = o.data as { qty: number; unit: string };
    return { ...row, item: o.label, qty: data.qty, unit: data.unit };
  },
  focusAfterSelect: () => 'note',
  freeTextOption: (text) => `「${text}」を入力`,
};

const columns: SpreadsheetColumn<Item>[] = [
  itemColumn,
  { key: 'qty', header: '数量', type: 'number' },
  unitColumn,
  { key: 'note', header: '備考', type: 'text' },
];

const makeRows = (): Item[] => [
  { id: 'a', item: 'サーバー構築', qty: 1, unit: '式', note: '' },
  { id: 'b', item: '保守', qty: 12, unit: null, note: '月額' },
];

function Harness({
  onRows,
  ...props
}: Partial<SpreadsheetGridProps<Item>> & { onRows?: (rows: Item[]) => void }) {
  const [rows, setRows] = React.useState(makeRows);
  return (
    <SpreadsheetGrid<Item>
      aria-label="明細"
      columns={columns}
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

const cellAt = (row: number, col: number) =>
  document.querySelector(`tbody tr[aria-rowindex="${row + 1}"]`)!.querySelectorAll('td')[
    col
  ] as HTMLElement;
const lastRows = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.at(-1)![0] as Item[];
const optionTexts = () => screen.getAllByRole('option').map((o) => o.textContent);

describe('決まった候補（options）', () => {
  it('表記ゆれを吸収して絞り込み、先頭を選んだ状態で Enter で入る', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 2));
    await user.keyboard('m2');
    expect(optionTexts()).toEqual(['㎡']);
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Enter}');
    expect(lastRows(onRows)[1].unit).toBe('㎡');
  });

  it('貼り付けは候補と照合し、allowFreeText={false} なら当たらない値で元の値を残す', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness onRows={onRows} columns={[itemColumn, { ...unitColumn, allowFreeText: false }]} />,
    );
    await user.click(cellAt(1, 1));
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => 'm2' } });
    expect(lastRows(onRows)[1].unit).toBe('㎡');
    onRows.mockClear();
    fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => 'ダース' } });
    expect(onRows).not.toHaveBeenCalled();
  });
});

describe('関数で出す候補（getOptions）', () => {
  it('2 文字以上の前方一致で先頭を選び、onSelectOption で複数の項目を書き換え、focusAfterSelect の列へ移る', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const onSelectionChange = vi.fn();
    render(<Harness onRows={onRows} onSelectionChange={onSelectionChange} />);
    await user.click(cellAt(1, 0));
    await user.keyboard('配管');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Enter}');
    expect(lastRows(onRows)[1]).toMatchObject({ item: '配管工事', qty: 3, unit: '式' });
    const selection = onSelectionChange.mock.calls.at(-1)![0] as SpreadsheetSelection;
    expect(selection.active).toEqual({ rowIndex: 1, columnKey: 'note' });
  });

  it('1 文字では候補を選ばず、打った文字をそのまま確定する', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 0));
    await user.keyboard('配');
    const options = screen.getAllByRole('option');
    expect(options.at(-1)).toHaveTextContent('「配」を入力');
    expect(options.at(-1)).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Enter}');
    expect(lastRows(onRows)[1].item).toBe('配');
  });

  it('↑↓ で選ぶ候補を変え、Esc で閉じて取り消す', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 0));
    await user.keyboard('配');
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowDown}');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onRows).not.toHaveBeenCalled();
  });

  it('マウスで候補を選べる（入力欄からフォーカスを外さない）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 0));
    await user.keyboard('配');
    await user.click(screen.getByRole('option', { name: /配線工事/ }));
    expect(lastRows(onRows)[1]).toMatchObject({ item: '配線工事', qty: 5, unit: 'ｍ' });
  });

  it('日本語の変換中の Enter では候補を選ばない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cellAt(1, 0));
    const input = screen.getByRole('combobox');
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: '配管' } });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode: 229 });
    fireEvent.compositionEnd(input);
    expect(onRows).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(lastRows(onRows)[1].item).toBe('配管工事');
  });

  it('has no accessibility violations（候補を開いた状態）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(cellAt(1, 0));
    await user.keyboard('配');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    // 候補は body 直下に出すため body で調べる（ページ全体の landmark の規則は対象外）
    const results = await axe(document.body, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
