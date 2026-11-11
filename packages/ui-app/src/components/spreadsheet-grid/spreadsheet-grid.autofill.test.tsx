import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SpreadsheetGrid,
  type SpreadsheetColumn,
  type SpreadsheetGridProps,
  type SpreadsheetWriteSource,
} from './spreadsheet-grid';

/* 空のセルに自動で入れる値（autoFill）・日付の範囲（minDate / maxDate）・
   候補を開いたときの選択（initialOption）・setValue に渡る書き込みのきっかけ（source）のテスト */

interface Entry {
  id: string;
  day: string | null;
  start: string;
  end: string;
  note: string;
}

const TIMES = ['08:50', '09:00', '09:10', '09:20', '10:00', '10:10', '13:00', '14:00'];
const plusHour = (t: string) =>
  `${String(Number(t.slice(0, 2)) + 1).padStart(2, '0')}${t.slice(2)}`;

function makeColumns(sources: SpreadsheetWriteSource[]): SpreadsheetColumn<Entry>[] {
  return [
    {
      key: 'day',
      header: '日付',
      type: 'date',
      minDate: '2026-12-03',
      maxDate: '2026-12-20',
      autoFill: { on: 'edit', value: () => '2026-12-10' },
    },
    {
      key: 'start',
      header: '開始',
      type: 'autocomplete',
      options: TIMES.map((t) => ({ value: t, label: t })),
      autoFill: { on: 'click', value: () => '09:00' },
      // 手で入れたときだけ、終了を 1 時間後にする（貼り付けではしない）
      setValue: (row, value, { source }) => {
        sources.push(source);
        const start = typeof value === 'string' ? value : '';
        const manual = source === 'edit' || source === 'auto';
        return { ...row, start, end: manual && start ? plusHour(start) : row.end };
      },
    },
    {
      key: 'end',
      header: '終了',
      type: 'autocomplete',
      // 文字を打たずに開いたとき（今の値のまま）は全部、打ったら前方一致で絞る
      getOptions: (q, row) =>
        (q === row.end ? TIMES : TIMES.filter((t) => t.startsWith(q))).map((t) => ({
          value: t,
          label: t,
        })),
      initialOption: (row) => row.end || plusHour(row.start || '08:00'),
    },
    {
      key: 'note',
      header: 'メモ',
      type: 'text',
      setValue: (row, value, { source }) => {
        sources.push(source);
        return { ...row, note: typeof value === 'string' ? value : '' };
      },
    },
  ];
}

const twoRows = (): Entry[] => [
  { id: 'a', day: null, start: '', end: '', note: '' },
  { id: 'b', day: '2026-12-05', start: '13:00', end: '14:00', note: '前の行' },
];

function Harness({
  onRows,
  sources = [],
  initial = twoRows(),
  ...props
}: Partial<SpreadsheetGridProps<Entry>> & {
  onRows?: (rows: Entry[]) => void;
  sources?: SpreadsheetWriteSource[];
  initial?: Entry[];
}) {
  const [rows, setRows] = React.useState(initial);
  const columns = React.useMemo(() => makeColumns(sources), [sources]);
  return (
    <SpreadsheetGrid<Entry>
      aria-label="工数"
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

const cellsOf = (rowIndex: number) =>
  within(screen.getAllByRole('row')[rowIndex + 1]).getAllByRole('gridcell');
// 列: 0 日付 / 1 開始 / 2 終了 / 3 メモ（行番号の列は gridcell ではない）
const cell = (rowIndex: number, col: number) => cellsOf(rowIndex)[col];
const paste = (text: string) =>
  fireEvent.paste(screen.getByRole('grid'), { clipboardData: { getData: () => text } });

describe('SpreadsheetGrid autoFill', () => {
  it("on: 'click' は空のセルを押すと値を入れる（setValue には source: 'auto'）", async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const sources: SpreadsheetWriteSource[] = [];
    render(<Harness onRows={onRows} sources={sources} />);
    await user.click(cell(0, 1));
    expect(onRows.mock.calls.at(-1)![0][0]).toMatchObject({ start: '09:00', end: '10:00' });
    expect(sources).toEqual(['auto']);
  });

  it('値のあるセル・Shift を押しながら・入力できないセルには入れない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const { unmount } = render(<Harness onRows={onRows} />);
    await user.click(cell(1, 1));
    expect(onRows).not.toHaveBeenCalled();
    // Shift を押しながら押すのは範囲を広げる操作なので入れない
    await user.keyboard('{Shift>}');
    await user.click(cell(0, 1));
    await user.keyboard('{/Shift}');
    expect(onRows).not.toHaveBeenCalled();
    unmount();
    render(<Harness onRows={onRows} isCellEditable={(row) => row.id !== 'a'} />);
    await user.click(cell(0, 1));
    expect(onRows).not.toHaveBeenCalled();
  });

  it('ドラッグで別のセルまで選んだときは入れない', async () => {
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    const from = cell(0, 1);
    const to = cell(0, 2);
    fireEvent.mouseDown(from, { button: 0 });
    fireEvent.mouseEnter(to);
    fireEvent.mouseUp(to);
    // mousedown と mouseup のセルが違うと、click はセルではなく共通の親に届く
    fireEvent.click(from.parentElement!);
    expect(onRows).not.toHaveBeenCalled();
  });

  it("on: 'edit' は空の日付をダブルクリックすると値を入れ、その月のカレンダーを開く。やめても残る", async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(cell(0, 0));
    expect(onRows.mock.calls.at(-1)![0][0].day).toBe('2026-12-10');
    expect(await screen.findByText('2026年12月')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onRows.mock.calls.at(-1)![0][0].day).toBe('2026-12-10');
  });

  it('文字を打って編集を始めたときは入れない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const sources: SpreadsheetWriteSource[] = [];
    render(<Harness onRows={onRows} sources={sources} />);
    // 押すと 9:00 が入るので、入った値を消してから打つ
    await user.click(cell(0, 1));
    await user.keyboard('{Delete}');
    sources.length = 0;
    await user.keyboard('13');
    await user.keyboard('{Enter}');
    expect(sources).toEqual(['edit']);
    expect(onRows.mock.calls.at(-1)![0][0]).toMatchObject({ start: '13:00', end: '14:00' });
  });
});

describe('SpreadsheetGrid の日付の範囲（minDate / maxDate）', () => {
  it('範囲の外の日はカレンダーで選べない', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.dblClick(cell(1, 0));
    const calendar = await screen.findByRole('dialog');
    await within(calendar).findByText('2026年12月');
    expect(within(calendar).getByText('2')).toBeDisabled();
    expect(within(calendar).getByText('21')).toBeDisabled();
    expect(within(calendar).getByText('10')).not.toBeDisabled();
  });

  it('貼り付けは 2026/12/5・2026年12月5日 も読み、範囲の外と暦に無い日は入れない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.click(cell(1, 0));
    paste('2026/12/7');
    expect(onRows.mock.calls.at(-1)![0][1].day).toBe('2026-12-07');
    paste('2026年12月8日');
    expect(onRows.mock.calls.at(-1)![0][1].day).toBe('2026-12-08');
    const calls = onRows.mock.calls.length;
    paste('2026/11/30');
    paste('2026/12/32');
    paste('2026-02-30');
    paste('12/5');
    expect(onRows).toHaveBeenCalledTimes(calls);
  });
});

describe('SpreadsheetGrid initialOption', () => {
  it('文字を打たずに開くと、その候補を選んでおく', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.dblClick(cell(1, 2));
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { selected: true })).toHaveTextContent('14:00');
    // 一覧は全部の候補（打った文字で絞っていない）
    expect(within(listbox).getAllByRole('option')).toHaveLength(TIMES.length);
  });

  it('今と同じ候補を Enter で選んでも、書かない', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(cell(1, 2));
    await screen.findByRole('listbox');
    await user.keyboard('{Enter}');
    expect(onRows).not.toHaveBeenCalled();
  });

  it('↓ で次の候補へ動き、Enter で選ぶ', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(<Harness onRows={onRows} />);
    await user.dblClick(cell(1, 2));
    await screen.findByRole('listbox');
    await user.keyboard('{ArrowUp}{Enter}');
    expect(onRows.mock.calls.at(-1)![0][1].end).toBe('13:00');
  });
});

describe('SpreadsheetGrid setValue の source', () => {
  it("打って確定は 'edit'・貼り付けは 'paste'・Delete は 'clear'・Ctrl+D は 'fill'", async () => {
    const user = userEvent.setup();
    const sources: SpreadsheetWriteSource[] = [];
    render(<Harness sources={sources} />);
    await user.click(cell(0, 3));
    await user.keyboard('メモ{Enter}');
    expect(sources).toEqual(['edit']);
    await user.click(cell(0, 3));
    paste('貼った');
    expect(sources.at(-1)).toBe('paste');
    await user.keyboard('{Delete}');
    expect(sources.at(-1)).toBe('clear');
    // 1 行目のメモを空にしたので、2 行目で Ctrl+D すると上（空）が写る
    await user.click(cell(1, 3));
    await user.keyboard('{Control>}d{/Control}');
    expect(sources.at(-1)).toBe('fill');
  });

  it("候補を選んだときは 'edit'（貼り付けでは終了を変えない）", async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const sources: SpreadsheetWriteSource[] = [];
    render(<Harness onRows={onRows} sources={sources} />);
    await user.click(cell(1, 1));
    paste('09:10');
    expect(onRows.mock.calls.at(-1)![0][1]).toMatchObject({ start: '09:10', end: '14:00' });
    // 打って候補を出し、押して選ぶ
    await user.keyboard('10:1');
    await user.click(await screen.findByRole('option', { name: '10:10' }));
    expect(sources).toEqual(['paste', 'edit']);
    expect(onRows.mock.calls.at(-1)![0][1]).toMatchObject({ start: '10:10', end: '11:10' });
  });
});
