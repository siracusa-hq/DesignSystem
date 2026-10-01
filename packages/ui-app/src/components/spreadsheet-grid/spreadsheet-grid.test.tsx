import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  SpreadsheetGrid,
  getSpreadsheetErrors,
  type SpreadsheetColumn,
  type SpreadsheetGridHandle,
  type SpreadsheetRow,
} from './spreadsheet-grid';

interface EstimateRow extends SpreadsheetRow {
  item: string;
  qty: number | null;
  unit: string | null;
  note: string;
}

const columns: SpreadsheetColumn<EstimateRow>[] = [
  { key: 'item', header: '品目', type: 'text', required: true },
  { key: 'qty', header: '数量', type: 'number', min: 0 },
  {
    key: 'unit',
    header: '単位',
    type: 'select',
    options: [
      { value: 'piece', label: '個' },
      { value: 'set', label: '式' },
    ],
  },
  { key: 'note', header: '備考', type: 'text' },
];

const makeRows = (): EstimateRow[] => [
  { item: 'サーバー構築', qty: 1, unit: 'set', note: '' },
  { item: '保守', qty: 12, unit: null, note: '月額' },
];

function Harness({
  initial = makeRows(),
  cols = columns,
  onRows,
  gridRef,
}: {
  initial?: EstimateRow[];
  cols?: SpreadsheetColumn<EstimateRow>[];
  onRows?: (rows: EstimateRow[]) => void;
  gridRef?: React.Ref<SpreadsheetGridHandle>;
}) {
  const [rows, setRows] = React.useState(initial);
  return (
    <SpreadsheetGrid
      ref={gridRef}
      aria-label="見積明細"
      columns={cols}
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

describe('SpreadsheetGrid 基本描画', () => {
  it('grid ロールと行・セルを描画する', () => {
    render(<Harness />);
    expect(screen.getByRole('grid', { name: '見積明細' })).toBeInTheDocument();
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
    // select はラベルで表示される
    expect(screen.getByText('式')).toBeInTheDocument();
    // 数値はローカライズ表示
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('行番号ヘッダーを表示する', () => {
    render(<Harness />);
    expect(screen.getByRole('rowheader', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2' })).toBeInTheDocument();
  });

  it('必須列のヘッダーに * を表示する', () => {
    render(<Harness />);
    expect(screen.getByText('品目').parentElement?.textContent).toContain('*');
  });

  it('行追加ボタンで行が増える', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(screen.getByRole('button', { name: /行を追加/ }));
    expect(onRows).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ item: '' }),
      ]),
    );
    expect(onRows.mock.calls[0][0]).toHaveLength(3);
  });
});

describe('SpreadsheetGrid キーボードナビゲーション', () => {
  it('クリックでセルがアクティブになり矢印キーで移動する', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const first = getCell('サーバー構築');
    await user.click(first);
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(getCell('保守')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('12').closest('td')).toHaveFocus();
  });

  it('Tab で右のセルへ移動する', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const first = getCell('サーバー構築');
    await user.click(first);
    await user.keyboard('{Tab}');
    const focused = document.activeElement as HTMLElement;
    expect(focused.tagName).toBe('TD');
    expect(focused).not.toBe(first);
    expect(focused.textContent).toBe('1'); // qty セル
  });

  it('範囲の端を越えない', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const first = getCell('サーバー構築');
    await user.click(first);
    await user.keyboard('{ArrowUp}{ArrowLeft}');
    expect(first).toHaveFocus();
  });
});

describe('SpreadsheetGrid 編集', () => {
  it('Enter で編集開始し、Enter で確定して下に移動する', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Enter}');
    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
    await user.clear(input);
    await user.type(input, 'ネットワーク設計');
    await user.keyboard('{Enter}');
    expect(onRows).toHaveBeenCalled();
    expect(screen.getByText('ネットワーク設計')).toBeInTheDocument();
    // 下のセルに移動している
    expect(getCell('保守')).toHaveFocus();
  });

  it('文字入力で即編集が始まり、入力文字が draft になる', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('X');
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('X');
  });

  it('Escape で編集をキャンセルする', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{F2}');
    await user.type(screen.getByRole('textbox'), '追記');
    await user.keyboard('{Escape}');
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
  });

  it('数値として不正な入力は Enter で確定されず編集が継続する', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(screen.getByText('12').closest('td')!);
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'abc');
    await user.keyboard('{Enter}');
    // 確定されず、編集モードのまま修正を促す
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    // Escape で破棄すると元の値が残る
    await user.keyboard('{Escape}');
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('最下行のセルを編集して Enter しても行は増えず、変更だけが反映される', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('保守'));
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '新しい品目');
    await user.keyboard('{Enter}');
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(2);
    expect(rows[1].item).toBe('新しい品目');
    expect(screen.getByText('新しい品目')).toBeInTheDocument();
    expect(screen.queryByRole('rowheader', { name: '3' })).not.toBeInTheDocument();
  });

  it('最下行で変更なしの Enter 確定では何も起きない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('保守'));
    await user.keyboard('{F2}{Enter}');
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.queryByRole('rowheader', { name: '3' })).not.toBeInTheDocument();
  });

  it('select 列は Select コンポーネントで編集でき、選択で確定される', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(screen.getByText('式').closest('td')!);
    // 編集開始と同時に Radix Select が開いている
    await user.click(await screen.findByRole('option', { name: '個' }));
    expect(onRows.mock.calls.at(-1)![0][0].unit).toBe('piece');
    expect(screen.getByText('個')).toBeInTheDocument();
    // エディタは閉じている
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('select 編集を選択せず Escape で閉じるとキャンセルされる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(screen.getByText('式').closest('td')!);
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.getByText('式')).toBeInTheDocument();
  });

  it('select 編集で — を選ぶと値がクリアされる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(screen.getByText('式').closest('td')!);
    await user.click(await screen.findByRole('option', { name: '—' }));
    expect(onRows.mock.calls.at(-1)![0][0].unit).toBeNull();
  });

  it('date 列は DatePicker で編集でき、日付選択で確定される', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const dateColumns: SpreadsheetColumn<EstimateRow>[] = [
      { key: 'item', header: '品目', type: 'text' },
      { key: 'due', header: '納期', type: 'date' },
    ];
    render(
      <Harness
        cols={dateColumns}
        initial={[
          { item: 'A', qty: null, unit: null, note: '', due: '2026-10-01' },
        ]}
        onRows={onRows}
      />,
    );
    await user.dblClick(screen.getByText('2026-10-01').closest('td')!);
    // 編集開始と同時にカレンダーが開く（2026年10月を表示）
    expect(await screen.findByText('2026年10月')).toBeInTheDocument();
    await user.click(screen.getByText('20'));
    expect(onRows.mock.calls.at(-1)![0][0].due).toBe('2026-10-20');
  });

  it('date 編集は Escape でキャンセルされる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const dateColumns: SpreadsheetColumn<EstimateRow>[] = [
      { key: 'item', header: '品目', type: 'text' },
      { key: 'due', header: '納期', type: 'date' },
    ];
    render(
      <Harness
        cols={dateColumns}
        initial={[
          { item: 'A', qty: null, unit: null, note: '', due: '2026-10-01' },
        ]}
        onRows={onRows}
      />,
    );
    await user.dblClick(screen.getByText('2026-10-01').closest('td')!);
    await screen.findByText('2026年10月');
    await user.keyboard('{Escape}');
    expect(onRows).not.toHaveBeenCalled();
    expect(screen.getByText('2026-10-01')).toBeInTheDocument();
  });
});

describe('SpreadsheetGrid ライブバリデーション', () => {
  it('入力中にエラーを表示する（確定前）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('12').closest('td')!);
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '-5');
    // min: 0 違反が入力中に表示される
    expect(screen.getByRole('alert')).toHaveTextContent('0 以上を入力してください');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('入力を修正するとエラーが消える', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('12').closest('td')!);
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '-5');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, '5');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('数値でない入力中はパースエラーを表示する', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('12').closest('td')!);
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'abc');
    expect(screen.getByRole('alert')).toHaveTextContent('数値で入力してください');
  });

  it('確定済みの不正セルにエラー表示が付く', () => {
    render(
      <Harness
        initial={[{ item: '', qty: 1, unit: null, note: '' }]}
      />,
    );
    // 必須の品目が空 → aria-invalid な gridcell が存在する
    const invalid = document.querySelector('td[aria-invalid="true"]');
    expect(invalid).not.toBeNull();
    expect(invalid).toHaveAttribute('title', '必須項目です');
  });
});

describe('getSpreadsheetErrors', () => {
  it('全セルのエラーを列挙する', () => {
    const errors = getSpreadsheetErrors(
      [
        { item: '', qty: -1, unit: null, note: '' },
        { item: 'OK', qty: 1, unit: null, note: '' },
      ],
      columns,
    );
    expect(errors).toEqual([
      { rowIndex: 0, columnKey: 'item', message: '必須項目です' },
      { rowIndex: 0, columnKey: 'qty', message: '0 以上を入力してください' },
    ]);
  });

  it('カスタム validate を評価する', () => {
    const errors = getSpreadsheetErrors(
      [{ item: 'x', qty: null, unit: null, note: 'NG' }],
      [
        ...columns.slice(0, 3),
        {
          key: 'note',
          header: '備考',
          type: 'text',
          validate: (v) => (v === 'NG' ? 'NG は使えません' : null),
        },
      ],
    );
    expect(errors).toEqual([
      { rowIndex: 0, columnKey: 'note', message: 'NG は使えません' },
    ]);
  });
});

describe('SpreadsheetGrid 範囲選択とコピペ', () => {
  it('Shift+矢印で範囲選択される', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Shift>}{ArrowDown}{ArrowRight}{/Shift}');
    const selected = document.querySelectorAll('td[aria-selected="true"]');
    expect(selected).toHaveLength(4);
  });

  it('Ctrl+C で選択範囲が TSV としてコピーされる', async () => {
    // userEvent.setup() が navigator.clipboard をスタブするので、それを経由して検証する
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Shift>}{ArrowRight}{ArrowDown}{/Shift}');
    await user.keyboard('{Control>}c{/Control}');
    expect(await navigator.clipboard.readText()).toBe(
      'サーバー構築\t1\n保守\t12',
    );
  });

  it('ペーストで複数セルが一括更新され、足りない行は追加される', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('保守'));
    fireEvent.paste(screen.getByRole('grid'), {
      clipboardData: {
        getData: () => 'デザイン\t3\nテスト\t5',
      },
    });
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(3);
    expect(rows[1]).toMatchObject({ item: 'デザイン', qty: 3 });
    expect(rows[2]).toMatchObject({ item: 'テスト', qty: 5 });
  });

  it('select 列へのペーストはラベルからも値を解決する', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(screen.getByText('式').closest('td')!);
    fireEvent.paste(screen.getByRole('grid'), {
      clipboardData: { getData: () => '個' },
    });
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0].unit).toBe('piece');
  });

  it('Delete で選択範囲がクリアされる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}{Delete}');
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0]).toMatchObject({ item: '', qty: null });
  });
});

describe('SpreadsheetGrid 行操作（コンテキストメニュー）', () => {
  const openMenuOnRow = async (text: string) => {
    const cell = getCell(text);
    fireEvent.contextMenu(cell);
  };

  it('行を削除できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await openMenuOnRow('サーバー構築');
    await user.click(await screen.findByText('行を削除'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(1);
    expect(rows[0].item).toBe('保守');
  });

  it('上に行を挿入できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await openMenuOnRow('保守');
    await user.click(await screen.findByText('上に行を挿入'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(3);
    expect(rows[1].item).toBe('');
    expect(rows[2].item).toBe('保守');
  });

  it('行を複製できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await openMenuOnRow('サーバー構築');
    await user.click(await screen.findByText('行を複製'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(3);
    expect(rows[1].item).toBe('サーバー構築');
  });

  it('下へ移動できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await openMenuOnRow('サーバー構築');
    await user.click(await screen.findByText('下へ移動'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows[0].item).toBe('保守');
    expect(rows[1].item).toBe('サーバー構築');
  });
});

describe('SpreadsheetGrid 行選択と複数行操作', () => {
  const threeRows = (): EstimateRow[] => [
    { item: 'A', qty: 1, unit: null, note: '' },
    { item: 'B', qty: 2, unit: null, note: '' },
    { item: 'C', qty: 3, unit: null, note: '' },
  ];

  it('行番号クリックで行全体が選択される', async () => {
    const user = userEvent.setup();
    render(<Harness initial={threeRows()} />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    // 1行目の全4セルが選択される
    const selected = document.querySelectorAll('td[aria-selected="true"]');
    expect(selected).toHaveLength(4);
    expect(
      screen.getByRole('rowheader', { name: '1' }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('Shift+クリックで複数行に拡張される', async () => {
    const user = userEvent.setup();
    render(<Harness initial={threeRows()} />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    const second = screen.getByRole('rowheader', { name: '2' });
    await user.keyboard('{Shift>}');
    await user.click(second);
    await user.keyboard('{/Shift}');
    expect(document.querySelectorAll('td[aria-selected="true"]')).toHaveLength(8);
  });

  it('複数行選択して右クリックするとまとめて削除できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('rowheader', { name: '2' }));
    await user.keyboard('{/Shift}');
    // 選択範囲内の行を右クリック
    fireEvent.contextMenu(getCell('A'));
    await user.click(await screen.findByText('2行を削除'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(1);
    expect(rows[0].item).toBe('C');
  });

  it('複数行選択で「下に2行を挿入」できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('rowheader', { name: '2' }));
    await user.keyboard('{/Shift}');
    fireEvent.contextMenu(getCell('B'));
    await user.click(await screen.findByText('下に2行を挿入'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows).toHaveLength(5);
    expect(rows.map((r: EstimateRow) => r.item)).toEqual(['A', 'B', '', '', 'C']);
  });

  it('複数行を複製できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    await user.click(screen.getByRole('rowheader', { name: '2' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('rowheader', { name: '3' }));
    await user.keyboard('{/Shift}');
    fireEvent.contextMenu(getCell('B'));
    await user.click(await screen.findByText('2行を複製'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: EstimateRow) => r.item)).toEqual(['A', 'B', 'C', 'B', 'C']);
  });

  it('選択範囲の外を右クリックした場合はその1行だけが対象になる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('rowheader', { name: '2' }));
    await user.keyboard('{/Shift}');
    // 選択外の3行目を右クリック → 単一行メニュー
    fireEvent.contextMenu(getCell('C'));
    await user.click(await screen.findByText('行を削除'));
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: EstimateRow) => r.item)).toEqual(['A', 'B']);
  });

  it('未選択の行は1回のドラッグ操作でそのまま移動できる', () => {
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    const h1 = screen.getByRole('rowheader', { name: '1' });
    // クリック→再クリック不要: 押した瞬間に掴めている
    fireEvent.mouseDown(h1);
    fireEvent.mouseEnter(getCell('C').closest('tr')!);
    fireEvent.mouseUp(getCell('C').closest('tbody')!);
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: EstimateRow) => r.item)).toEqual(['B', 'C', 'A']);
  });

  it('選択した行をドラッグ&ドロップで並び替えられる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    const h1 = screen.getByRole('rowheader', { name: '1' });
    await user.click(h1); // 行1を選択
    fireEvent.mouseDown(h1); // 選択済みヘッダーからドラッグ開始
    fireEvent.mouseEnter(getCell('C').closest('tr')!); // 行3の上へ
    fireEvent.mouseUp(getCell('C').closest('tbody')!);
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: EstimateRow) => r.item)).toEqual(['B', 'C', 'A']);
  });

  it('複数行ブロックをまとめてドラッグ&ドロップできる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    // 行2〜3を選択
    await user.click(screen.getByRole('rowheader', { name: '2' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('rowheader', { name: '3' }));
    await user.keyboard('{/Shift}');
    // 選択ブロックを先頭へ移動
    const h2 = screen.getByRole('rowheader', { name: '2' });
    fireEvent.mouseDown(h2);
    fireEvent.mouseEnter(getCell('A').closest('tr')!);
    fireEvent.mouseUp(getCell('A').closest('tbody')!);
    const rows = onRows.mock.calls.at(-1)![0];
    expect(rows.map((r: EstimateRow) => r.item)).toEqual(['B', 'C', 'A']);
  });

  it('行 D&D は Undo で元に戻せる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness initial={threeRows()} onRows={onRows} />);
    const h1 = screen.getByRole('rowheader', { name: '1' });
    await user.click(h1);
    fireEvent.mouseDown(h1);
    fireEvent.mouseEnter(getCell('C').closest('tr')!);
    fireEvent.mouseUp(getCell('C').closest('tbody')!);
    expect(
      onRows.mock.calls.at(-1)![0].map((r: EstimateRow) => r.item),
    ).toEqual(['B', 'C', 'A']);
    await user.keyboard('{Control>}z{/Control}');
    expect(
      onRows.mock.calls.at(-1)![0].map((r: EstimateRow) => r.item),
    ).toEqual(['A', 'B', 'C']);
  });

  it('動かさずに離した場合はその行だけの選択になる', async () => {
    const user = userEvent.setup();
    render(<Harness initial={threeRows()} />);
    await user.click(screen.getByRole('rowheader', { name: '1' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('rowheader', { name: '2' }));
    await user.keyboard('{/Shift}');
    expect(document.querySelectorAll('td[aria-selected="true"]')).toHaveLength(8);
    // 選択済みヘッダーを押してそのまま離す → 行2だけの選択に戻る
    const h2 = screen.getByRole('rowheader', { name: '2' });
    fireEvent.mouseDown(h2);
    fireEvent.mouseUp(h2.closest('tbody')!);
    expect(document.querySelectorAll('td[aria-selected="true"]')).toHaveLength(4);
    expect(h2).toHaveAttribute('aria-selected', 'true');
  });

  it('Shift+Space で選択行スパンが行選択になる', async () => {
    const user = userEvent.setup();
    render(<Harness initial={threeRows()} />);
    await user.click(getCell('B'));
    await user.keyboard('{Shift>} {/Shift}');
    expect(document.querySelectorAll('td[aria-selected="true"]')).toHaveLength(4);
    expect(
      screen.getByRole('rowheader', { name: '2' }),
    ).toHaveAttribute('aria-selected', 'true');
  });
});

describe('SpreadsheetGrid dirty マーカー', () => {
  it('値を元に戻すとマーカーが消える（ベースライン比較）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const cell = getCell('サーバー構築');
    await user.click(cell);
    // 変更 → マーカーが付く
    await user.keyboard('{F2}');
    let input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '別の値');
    await user.keyboard('{Enter}');
    expect(document.querySelector('td[data-dirty]')).not.toBeNull();
    // 手で元の値に戻す → マーカーが消える
    await user.click(screen.getByText('別の値').closest('td')!);
    await user.keyboard('{F2}');
    input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'サーバー構築');
    await user.keyboard('{Enter}');
    expect(document.querySelector('td[data-dirty]')).toBeNull();
  });

  it('Undo で値が戻るとマーカーも消える', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '別の値');
    await user.keyboard('{Enter}');
    expect(document.querySelector('td[data-dirty]')).not.toBeNull();
    await user.keyboard('{Control>}z{/Control}');
    expect(document.querySelector('td[data-dirty]')).toBeNull();
  });

  it('編集したセルに data-dirty が付き、clearDirty で消える', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<SpreadsheetGridHandle>();
    render(<Harness gridRef={ref} />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '変更後');
    await user.keyboard('{Escape}');
    expect(document.querySelector('td[data-dirty]')).toBeNull();
    await user.keyboard('{F2}');
    const input2 = screen.getByRole('textbox');
    await user.clear(input2);
    await user.type(input2, '変更後2');
    fireEvent.blur(input2);
    expect(document.querySelector('td[data-dirty]')).not.toBeNull();
    act(() => ref.current!.clearDirty());
    expect(document.querySelector('td[data-dirty]')).toBeNull();
  });
});

describe('SpreadsheetGrid checkbox 列', () => {
  const checkboxColumns: SpreadsheetColumn<EstimateRow>[] = [
    { key: 'item', header: '品目', type: 'text' },
    { key: 'taxable', header: '課税', type: 'checkbox' },
  ];

  it('Space でトグルできる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <Harness
        cols={checkboxColumns}
        initial={[{ item: 'A', qty: null, unit: null, note: '', taxable: false }]}
        onRows={onRows}
      />,
    );
    await user.click(getCell('A'));
    await user.keyboard('{ArrowRight} ');
    expect(onRows.mock.calls.at(-1)![0][0].taxable).toBe(true);
  });
});

describe('SpreadsheetGrid Undo / Redo', () => {
  it('Ctrl+Z でセル編集が取り消され、Ctrl+Shift+Z でやり直せる', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{F2}');
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '変更後');
    await user.keyboard('{Escape}');
    // Escape は編集破棄なので一旦確定し直す
    await user.keyboard('{F2}');
    const input2 = screen.getByRole('textbox');
    await user.clear(input2);
    await user.type(input2, '変更後');
    await user.keyboard('{Enter}');
    expect(screen.getByText('変更後')).toBeInTheDocument();

    await user.keyboard('{Control>}z{/Control}');
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
    expect(screen.queryByText('変更後')).not.toBeInTheDocument();

    await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');
    expect(screen.getByText('変更後')).toBeInTheDocument();
  });

  it('Ctrl+Y でもやり直せる', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}{Delete}');
    expect(screen.queryByText('サーバー構築')).not.toBeInTheDocument();
    await user.keyboard('{Control>}z{/Control}');
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
    await user.keyboard('{Control>}y{/Control}');
    expect(screen.queryByText('サーバー構築')).not.toBeInTheDocument();
  });

  it('行削除を Undo で復元できる', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    fireEvent.contextMenu(getCell('サーバー構築'));
    await user.click(await screen.findByText('行を削除'));
    expect(screen.queryByText('サーバー構築')).not.toBeInTheDocument();
    await user.keyboard('{Control>}z{/Control}');
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
    expect(onRows.mock.calls.at(-1)![0]).toHaveLength(2);
  });

  it('ペーストを Undo で取り消せる', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(getCell('サーバー構築'));
    fireEvent.paste(screen.getByRole('grid'), {
      clipboardData: { getData: () => 'X\t9\nY\t8' },
    });
    expect(screen.getByText('X')).toBeInTheDocument();
    await user.keyboard('{Control>}z{/Control}');
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
    expect(screen.getByText('保守')).toBeInTheDocument();
    expect(screen.queryByText('X')).not.toBeInTheDocument();
  });

  it('Undo 後に新しい変更をすると Redo 履歴が消える', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    // 変更1: 数量セルをクリア
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Delete}');
    expect(screen.queryByText('サーバー構築')).not.toBeInTheDocument();
    // Undo で復元
    await user.keyboard('{Control>}z{/Control}');
    expect(screen.getByText('サーバー構築')).toBeInTheDocument();
    // 変更2（新しい変更）
    await user.keyboard('X');
    const input = screen.getByRole('textbox');
    await user.keyboard('{Enter}');
    expect(input).not.toBeInTheDocument();
    // Redo しても変更1は戻らない
    await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('履歴がない状態の Undo は何もしない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(getCell('サーバー構築'));
    await user.keyboard('{Control>}z{/Control}');
    expect(onRows).not.toHaveBeenCalled();
  });
});

describe('SpreadsheetGrid a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Harness />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
