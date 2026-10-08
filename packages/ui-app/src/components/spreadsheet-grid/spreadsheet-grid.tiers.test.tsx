import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  SpreadsheetGrid,
  getSpreadsheetErrors,
  type SpreadsheetColumn,
  type SpreadsheetRow,
} from './spreadsheet-grid';

/* 2段セル（fields）: 会計システムの仕訳入力を想定 */

interface JournalRow extends SpreadsheetRow {
  debitAccount: string;
  creditAccount: string;
  amount: number | null;
  description: string;
}

const journalColumns: SpreadsheetColumn<JournalRow>[] = [
  {
    key: 'account',
    header: '勘定科目',
    fields: [
      { key: 'debitAccount', header: '借方科目', type: 'text', required: true },
      { key: 'creditAccount', header: '貸方科目', type: 'text', required: true },
    ],
  },
  { key: 'amount', header: '金額', type: 'number', min: 0 },
  { key: 'description', header: '摘要', type: 'text' },
];

const journalRows = (): JournalRow[] => [
  { debitAccount: '現金', creditAccount: '売上', amount: 10000, description: '商品A' },
  { debitAccount: '仕入', creditAccount: '買掛金', amount: 6000, description: '商品B' },
];

function Harness({
  initial = journalRows(),
  cols = journalColumns,
  onRows,
}: {
  initial?: JournalRow[];
  cols?: SpreadsheetColumn<JournalRow>[];
  onRows?: (rows: JournalRow[]) => void;
}) {
  const [rows, setRows] = React.useState(initial);
  return (
    <SpreadsheetGrid
      aria-label="仕訳明細"
      columns={cols}
      rows={rows}
      onRowsChange={(next) => {
        setRows(next);
        onRows?.(next);
      }}
      createRow={() => ({
        debitAccount: '',
        creditAccount: '',
        amount: null,
        description: '',
      })}
    />
  );
}

const getCell = (text: string) => screen.getByText(text).closest('td')!;
// 入力できるセルでは、フォーカスはセルの中の入力欄（日本語入力のため）
const expectFocusIn = (cell: HTMLElement) =>
  expect(cell.contains(document.activeElement)).toBe(true);

describe('SpreadsheetGrid 2段セル: 描画', () => {
  it('1レコードが2つの tr で描画され、1段列は rowSpan=2 になる', () => {
    render(<Harness />);
    // 2レコード × 2段 = 4行（tbody内）
    expect(document.querySelectorAll('tbody tr')).toHaveLength(4);
    // 上段・下段の両方が見える
    expect(screen.getByText('現金')).toBeInTheDocument();
    expect(screen.getByText('売上')).toBeInTheDocument();
    // 1段列（金額）は rowSpan=2
    expect(screen.getByText('10,000').closest('td')).toHaveAttribute('rowspan', '2');
    // 行番号も rowSpan=2 で1レコードに1つだけ
    const header = screen.getByRole('rowheader', { name: '1' });
    expect(header).toHaveAttribute('rowspan', '2');
    expect(screen.queryByRole('rowheader', { name: '3' })).not.toBeInTheDocument();
  });

  it('2段セルの td に data-tier が付く', () => {
    render(<Harness />);
    expect(getCell('現金')).toHaveAttribute('data-tier', '0');
    expect(getCell('売上')).toHaveAttribute('data-tier', '1');
    expect(screen.getByText('10,000').closest('td')).not.toHaveAttribute('data-tier');
  });

  it('列ヘッダーに上段/下段のラベルが積まれて表示される', () => {
    render(<Harness />);
    expect(screen.getByText('借方科目')).toBeInTheDocument();
    expect(screen.getByText('貸方科目')).toBeInTheDocument();
  });

  it('階層（getRowDepth）との併用はエラーになる', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <SpreadsheetGrid
          aria-label="x"
          columns={journalColumns}
          rows={journalRows()}
          onRowsChange={() => {}}
          getRowDepth={() => 0}
        />,
      ),
    ).toThrow(/同時に使えません/);
    spy.mockRestore();
  });
});

describe('SpreadsheetGrid 2段セル: ナビゲーション', () => {
  it('ArrowDown で 上段 → 下段 → 次レコード上段 の順に移動する', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('現金'));
    expectFocusIn(getCell('現金'));
    await user.keyboard('{ArrowDown}');
    expectFocusIn(getCell('売上'));
    await user.keyboard('{ArrowDown}');
    expectFocusIn(getCell('仕入'));
    // ArrowUp は逆順（次レコード上段 → 前レコード下段）
    await user.keyboard('{ArrowUp}');
    expectFocusIn(getCell('売上'));
    await user.keyboard('{ArrowUp}');
    expectFocusIn(getCell('現金'));
  });

  it('1段列からの ArrowDown は段を飛ばして次レコードへ移動する', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('10,000').closest('td')!);
    await user.keyboard('{ArrowDown}');
    expectFocusIn(screen.getByText('6,000').closest('td')!);
  });

  it('下段から右の1段列へ移動し、戻ると上段になる', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('売上'));
    await user.keyboard('{ArrowRight}');
    expectFocusIn(screen.getByText('10,000').closest('td')!);
    await user.keyboard('{ArrowLeft}');
    // 1段列は t=0 なので、戻りも上段
    expectFocusIn(getCell('現金'));
  });
});

describe('SpreadsheetGrid 2段セル: 編集', () => {
  it('上段と下段をそれぞれ編集できる（Enter で上段 → 下段へ）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(getCell('現金'));
    await user.keyboard('{Control>}a{/Control}普通預金{Enter}');
    expect(onRows.mock.calls.at(-1)![0][0].debitAccount).toBe('普通預金');
    // Enter 確定で下段に移動しているので、そのまま下段（貸方）を編集
    await user.keyboard('{F2}');
    await user.keyboard('{Control>}a{/Control}雑収入{Enter}');
    const latest = onRows.mock.calls.at(-1)![0][0];
    expect(latest.debitAccount).toBe('普通預金');
    expect(latest.creditAccount).toBe('雑収入');
  });

  it('下段フィールドのバリデーションが効く', () => {
    render(
      <Harness
        initial={[
          { debitAccount: '現金', creditAccount: '', amount: 100, description: '' },
        ]}
      />,
    );
    const invalid = document.querySelector('td[aria-invalid="true"]');
    expect(invalid).not.toBeNull();
    expect(invalid).toHaveAttribute('title', '必須項目です');
    expect(invalid).toHaveAttribute('data-tier', '1');
  });

  it('getSpreadsheetErrors が各段のフィールドを検証する', () => {
    const errors = getSpreadsheetErrors(
      [{ debitAccount: '', creditAccount: '', amount: -1, description: '' }],
      journalColumns,
    );
    expect(errors).toEqual([
      { rowIndex: 0, columnKey: 'debitAccount', message: '必須項目です' },
      { rowIndex: 0, columnKey: 'creditAccount', message: '必須項目です' },
      { rowIndex: 0, columnKey: 'amount', message: '0 以上を入力してください' },
    ]);
  });

  it('2段セルでも dirty マーカーは段ごとに付く', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.dblClick(getCell('現金'));
    await user.keyboard('{Control>}a{/Control}普通預金{Enter}');
    const dirtyCells = document.querySelectorAll('td[data-dirty]');
    expect(dirtyCells).toHaveLength(1);
    expect(dirtyCells[0]).toHaveAttribute('data-tier', '0');
  });
});

describe('SpreadsheetGrid 2段セル: コピー & ペースト & クリア', () => {
  it('コピーは1レコード2行の TSV になる（1段列は上段に値・下段は空）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('現金'));
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await user.keyboard('{Control>}c{/Control}');
    expect(await navigator.clipboard.readText()).toBe('現金\t10000\n売上\t');
  });

  it('2行1レコードの TSV を貼り付けると上下段に展開される', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('現金'));
    await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{ArrowDown}{/Shift}');
    fireEvent.paste(screen.getByRole('grid'), {
      clipboardData: {
        getData: () => '旅費交通費\t3000\n現金\t\n通信費\t1200\n未払金\t',
      },
    });
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0]).toMatchObject({
      debitAccount: '旅費交通費',
      creditAccount: '現金',
      amount: 3000,
    });
    expect(rows[1]).toMatchObject({
      debitAccount: '通信費',
      creditAccount: '未払金',
      amount: 1200,
    });
  });

  it('貼り付けで行が足りなければレコード単位で追加される', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('仕入')); // 2レコード目の上段
    fireEvent.paste(screen.getByRole('grid'), {
      clipboardData: {
        getData: () => 'A\t1\nB\t\nC\t2\nD\t',
      },
    });
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(3); // 1レコード追加（2行で1レコード）
    expect(rows[1]).toMatchObject({ debitAccount: 'A', creditAccount: 'B', amount: 1 });
    expect(rows[2]).toMatchObject({ debitAccount: 'C', creditAccount: 'D', amount: 2 });
  });

  it('下段から貼り始めると下段 → 次レコード上段の順に入る', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('売上')); // 1レコード目の下段
    fireEvent.paste(screen.getByRole('grid'), {
      clipboardData: { getData: () => 'X\nY' },
    });
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0].creditAccount).toBe('X');
    expect(rows[1].debitAccount).toBe('Y');
  });

  it('Delete で選択レコードの上下段がクリアされる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('現金'));
    await user.keyboard('{Delete}');
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0]).toMatchObject({ debitAccount: '', creditAccount: '' });
    // 他の列は選択されていないので残る
    expect(rows[0].amount).toBe(10000);
  });
});

describe('SpreadsheetGrid 2段セル: 行操作', () => {
  it('行操作（削除）はレコード単位で動く', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    fireEvent.contextMenu(getCell('現金'));
    await user.click(await screen.findByText('行を削除'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(1);
    expect(rows[0].debitAccount).toBe('仕入');
  });

  it('行番号クリックでレコード全体（上下段）が選択される', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    // account(2) + amount(1) + description(1) = 4
    expect(document.querySelectorAll('td[aria-selected="true"]')).toHaveLength(4);
  });

  it('行 D&D はレコード単位で並び替わり Undo で戻せる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    const h1 = screen.getByRole('rowheader', { name: '1' });
    fireEvent.mouseDown(h1);
    fireEvent.mouseEnter(getCell('仕入').closest('tr')!);
    fireEvent.mouseUp(h1.closest('tbody')!);
    let rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: JournalRow) => r.debitAccount)).toEqual(['仕入', '現金']);
    await user.keyboard('{Control>}z{/Control}');
    rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: JournalRow) => r.debitAccount)).toEqual(['現金', '仕入']);
  });
});

describe('SpreadsheetGrid 2段セル: select エディタ', () => {
  const selectColumns: SpreadsheetColumn<JournalRow>[] = [
    {
      key: 'account',
      header: '勘定科目',
      fields: [
        {
          key: 'debitAccount',
          header: '借方科目',
          type: 'select',
          options: [
            { value: 'cash', label: '現金' },
            { value: 'travel', label: '旅費交通費' },
          ],
        },
        {
          key: 'creditAccount',
          header: '貸方科目',
          type: 'select',
          options: [
            { value: 'cash', label: '現金' },
            { value: 'sales', label: '売上高' },
          ],
        },
      ],
    },
    { key: 'amount', header: '金額', type: 'number' },
  ];

  it('下段の select は下段フィールドに書き込む', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness
        cols={selectColumns}
        initial={[
          { debitAccount: 'travel', creditAccount: '', amount: 100, description: '' },
        ]}
        onRows={onRows}
      />,
    );
    await user.dblClick(screen.getByText('旅費交通費').closest('tr')!.nextElementSibling!
      .querySelector('td')!);
    await user.click(await screen.findByRole('option', { name: '現金' }));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0].creditAccount).toBe('cash');
    expect(rows[0].debitAccount).toBe('travel');
  });
});

describe('SpreadsheetGrid select エディタ（空値からの選択）', () => {
  // 2段セルの実装中に見つかった main 由来のバグのリグレッションテスト:
  // Radix は選択時にも onOpenChange(false) が onValueChange より先に届くことが
  // あり、空値のセルで「選ばずに閉じた」と誤判定して選択が破棄されていた
  it('値が空のセルでも選択肢のクリックで確定される（単段）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness
        cols={[
          { key: 'debitAccount', header: '借方', type: 'text' },
          {
            key: 'creditAccount',
            header: '貸方',
            type: 'select',
            options: [
              { value: 'cash', label: '現金' },
              { value: 'sales', label: '売上高' },
            ],
          },
          { key: 'amount', header: '金額', type: 'number' },
        ]}
        initial={[
          { debitAccount: 'x', creditAccount: '', amount: 100, description: '' },
        ]}
        onRows={onRows}
      />,
    );
    const emptySelectCell = screen
      .getByText('100')
      .closest('td')!.previousElementSibling as HTMLElement;
    await user.dblClick(emptySelectCell);
    await user.click(await screen.findByRole('option', { name: '現金' }));
    expect(onRows.mock.calls.at(-1)![0][0].creditAccount).toBe('cash');
  });

  it('選択せず Escape で閉じると取消される（遅延取消の確認）', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness
        cols={[
          { key: 'debitAccount', header: '借方', type: 'text' },
          {
            key: 'creditAccount',
            header: '貸方',
            type: 'select',
            options: [{ value: 'cash', label: '現金' }],
          },
        ]}
        initial={[
          { debitAccount: 'x', creditAccount: '', amount: null, description: '' },
        ]}
        onRows={onRows}
      />,
    );
    const emptySelectCell = getCell('x').nextElementSibling as HTMLElement;
    await user.dblClick(emptySelectCell);
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('SpreadsheetGrid 2段セル: a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Harness />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
