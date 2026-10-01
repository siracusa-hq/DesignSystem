import { useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SpreadsheetGrid,
  getSpreadsheetErrors,
  type SpreadsheetColumn,
  type SpreadsheetGridHandle,
  type SpreadsheetRow,
  type SpreadsheetSelection,
} from '../components/spreadsheet-grid';
import { ContextMenuItem } from '../components/context-menu';

const meta: Meta = {
  title: 'Components/SpreadsheetGrid',
  component: SpreadsheetGrid as never,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '見積明細のような複数行×複数列の一括入力グリッド。矢印/Tab/Enter のセル移動、' +
          'F2・文字入力・ダブルクリックで編集、Shift+矢印/ドラッグで範囲選択、' +
          'Excel/Google Sheets との TSV コピー&ペースト、右クリックの行操作に対応。' +
          '行番号のクリック（Shift+クリック / ドラッグで複数行）で行を選択し、' +
          '右クリックからまとめて挿入・複製・移動・削除でき、' +
          '選択した行は行番号のドラッグ&ドロップでも並び替えられる。' +
          'Cmd/Ctrl+Z で元に戻す、Cmd/Ctrl+Shift+Z または Ctrl+Y でやり直し。' +
          'バリデーションエラーは入力中にリアルタイム表示される。' +
          '日本語入力（IME）でも、選んだセルにそのまま打ち始められる。' +
          'セルごとの入力可否（isCellEditable）・表示の差し替え（column.render）・' +
          '書き込み口（column.setValue）・行の class・行番号・左の列の固定（stickyColumns）・' +
          '合計行（column.footer）を外から決められる。' +
          '選択の通知（onSelectionChange）・ref.select／focus・キー操作の差し込み（onKeyDown）・' +
          '右クリックの項目（contextMenu・rowActions）・アプリ側の元に戻す（history={false}）・' +
          '貼り付けの差し替え（onPaste）で、アプリの画面と連動できる。' +
          '編集中の Ctrl/Cmd+Enter で範囲にまとめて入力、Ctrl/Cmd+X で切り取り、列見出しで列を選ぶ。' +
          '候補つきの入力列（type: \'autocomplete\'）は、打つたびに候補を出し、選ぶと行のほかの項目も書き換えられる。' +
          'getRowDepth を渡すと階層つきの表（treegrid）になり、畳む・開く、配下ごとの並べ替えができる。',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

/* ----- 見積明細（基本形） ----- */

interface EstimateRow extends SpreadsheetRow {
  item: string;
  qty: number | null;
  unit: string | null;
  unitPrice: number | null;
  taxable: boolean;
  note: string;
}

const estimateColumns: SpreadsheetColumn<EstimateRow>[] = [
  { key: 'item', header: '品目', type: 'text', required: true, width: 220 },
  { key: 'qty', header: '数量', type: 'number', min: 0, width: 80 },
  {
    key: 'unit',
    header: '単位',
    type: 'select',
    width: 90,
    options: [
      { value: 'piece', label: '個' },
      { value: 'set', label: '式' },
      { value: 'month', label: 'ヶ月' },
      { value: 'person-day', label: '人日' },
    ],
  },
  { key: 'unitPrice', header: '単価', type: 'number', min: 0, width: 120 },
  { key: 'taxable', header: '課税', type: 'checkbox', width: 60 },
  {
    key: 'amount',
    header: '金額',
    type: 'readonly',
    width: 130,
    getValue: (row) =>
      row.qty != null && row.unitPrice != null
        ? (row.qty * row.unitPrice).toLocaleString()
        : '',
  },
  { key: 'note', header: '備考', type: 'text', width: 200 },
];

const initialEstimate: EstimateRow[] = [
  { item: '要件定義', qty: 10, unit: 'person-day', unitPrice: 80000, taxable: true, note: '' },
  { item: '設計・実装', qty: 40, unit: 'person-day', unitPrice: 75000, taxable: true, note: '' },
  { item: 'サーバー費用', qty: 12, unit: 'month', unitPrice: 50000, taxable: true, note: '12ヶ月分' },
  { item: '保守サポート', qty: 1, unit: 'set', unitPrice: 600000, taxable: true, note: '年間契約' },
];

const createEstimateRow = (): EstimateRow => ({
  item: '',
  qty: null,
  unit: null,
  unitPrice: null,
  taxable: true,
  note: '',
});

/**
 * 見積明細の入力画面を想定した基本形。「金額」は type: 'readonly' + getValue の
 * 計算列（数量 × 単価）。Excel からの貼り付け、右クリックでの行操作を試せる。
 */
export const Default: Story = {
  render: () => {
    const [rows, setRows] = useState(initialEstimate);
    const total = rows.reduce(
      (sum, r) => sum + (r.qty != null && r.unitPrice != null ? r.qty * r.unitPrice : 0),
      0,
    );
    return (
      <div className="flex max-w-[960px] flex-col gap-2">
        <SpreadsheetGrid
          aria-label="見積明細"
          columns={estimateColumns}
          rows={rows}
          onRowsChange={setRows}
          createRow={createEstimateRow}
        />
        <div className="text-right text-sm font-medium">
          合計: {total.toLocaleString()} 円
        </div>
      </div>
    );
  },
};

/**
 * バリデーション。品目は必須、数量・単価は 0 以上。備考にはカスタム validate で
 * 文字数制限を掛けている。セル編集中にもエラーがリアルタイム表示される。
 * 下部の保存ボタンは getSpreadsheetErrors の結果でエラーがあると無効化される。
 */
export const WithValidation: Story = {
  render: () => {
    const columns: SpreadsheetColumn<EstimateRow>[] = [
      ...estimateColumns.slice(0, 6),
      {
        key: 'note',
        header: '備考（20文字まで）',
        type: 'text',
        width: 220,
        validate: (v) =>
          typeof v === 'string' && v.length > 20 ? '20文字以内で入力してください' : null,
      },
    ];
    const [rows, setRows] = useState<EstimateRow[]>([
      { item: '', qty: -1, unit: null, unitPrice: 50000, taxable: true, note: '' },
      { item: '設計', qty: 5, unit: 'person-day', unitPrice: null, taxable: true, note: '' },
    ]);
    const errors = getSpreadsheetErrors(rows, columns);
    return (
      <div className="flex max-w-[960px] flex-col gap-3">
        <SpreadsheetGrid
          aria-label="見積明細（バリデーション）"
          columns={columns}
          rows={rows}
          onRowsChange={setRows}
          createRow={createEstimateRow}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-error-600)]">
            {errors.length > 0 && `${errors.length} 件のエラーがあります`}
          </span>
          <button
            type="button"
            disabled={errors.length > 0}
            className="rounded-md bg-[var(--color-primary-500)] px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            保存
          </button>
        </div>
      </div>
    );
  },
};

/**
 * 一括保存フロー。変更したセルには右上に警告色のマーカーが付き、
 * 「保存」で clearDirty() を呼ぶとマーカーが消える（実アプリでは API 送信成功後に呼ぶ）。
 */
export const UnsavedChanges: Story = {
  render: () => {
    const gridRef = useRef<SpreadsheetGridHandle>(null);
    const [rows, setRows] = useState(initialEstimate);
    const [savedAt, setSavedAt] = useState<string | null>(null);
    return (
      <div className="flex max-w-[960px] flex-col gap-3">
        <SpreadsheetGrid
          ref={gridRef}
          aria-label="見積明細（一括保存）"
          columns={estimateColumns}
          rows={rows}
          onRowsChange={setRows}
          createRow={createEstimateRow}
        />
        <div className="flex items-center justify-end gap-3">
          {savedAt && (
            <span className="text-sm text-[var(--color-on-surface-muted)]">
              {savedAt} に保存しました
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              gridRef.current?.clearDirty();
              setSavedAt(new Date().toLocaleTimeString());
            }}
            className="rounded-md bg-[var(--color-primary-500)] px-4 py-1.5 text-sm font-medium text-white"
          >
            保存
          </button>
        </div>
      </div>
    );
  },
};

/* ----- 全データ型 ----- */

interface TypesRow extends SpreadsheetRow {
  text: string;
  num: number | null;
  sel: string | null;
  date: string | null;
  flag: boolean;
}

/**
 * サポートする全データ型: text / number / select / date / checkbox / readonly。
 * number は右寄せ + 桁区切り表示、checkbox は Space でトグル。select / date は
 * デザインシステムの Select / DatePicker がセルエディタとして開く。
 */
export const AllColumnTypes: Story = {
  render: () => {
    const [rows, setRows] = useState<TypesRow[]>([
      { text: 'テキスト', num: 1234.5, sel: 'a', date: '2026-10-01', flag: true },
      { text: '', num: null, sel: null, date: null, flag: false },
    ]);
    return (
      <SpreadsheetGrid
        aria-label="全データ型"
        className="max-w-[860px]"
        columns={[
          { key: 'text', header: 'text', type: 'text' },
          { key: 'num', header: 'number', type: 'number', width: 110 },
          {
            key: 'sel',
            header: 'select',
            type: 'select',
            width: 110,
            options: [
              { value: 'a', label: '選択肢A' },
              { value: 'b', label: '選択肢B' },
            ],
          },
          { key: 'date', header: 'date', type: 'date', width: 140 },
          { key: 'flag', header: 'checkbox', type: 'checkbox', width: 90 },
          {
            key: 'summary',
            header: 'readonly（計算列）',
            type: 'readonly',
            width: 160,
            getValue: (r) => (r.flag ? '✓ ' : '') + (r.text || '—'),
          },
        ]}
        rows={rows}
        onRowsChange={setRows}
        createRow={() => ({ text: '', num: null, sel: null, date: null, flag: false })}
      />
    );
  },
};

/** 100行での表示・操作確認（想定上限規模） */
export const HundredRows: Story = {
  render: () => {
    const [rows, setRows] = useState<EstimateRow[]>(
      Array.from({ length: 100 }, (_, i) => ({
        item: `明細 ${i + 1}`,
        qty: (i % 9) + 1,
        unit: 'piece',
        unitPrice: 1000 * ((i % 5) + 1),
        taxable: true,
        note: '',
      })),
    );
    return (
      <SpreadsheetGrid
        aria-label="見積明細（100行）"
        className="max-h-[480px] max-w-[960px]"
        columns={estimateColumns}
        rows={rows}
        onRowsChange={setRows}
        createRow={createEstimateRow}
      />
    );
  },
};

/**
 * 行の並び替え（Drag & Drop）。
 *
 * - 1行だけ: 行番号をそのまま掴んでドラッグ（1クリックで掴める）
 * - 複数行: Shift+クリックで行を選択してから、選択した行番号を掴んでドラッグ
 * - ドロップ位置に表示される線のところへ離すと移動する
 *
 * 並び替えも Cmd/Ctrl+Z で元に戻せる。キーボード派は右クリック →
 * 「上へ移動 / 下へ移動」でも同じ操作ができる。
 */
export const DragAndDrop: Story = {
  render: () => {
    const [rows, setRows] = useState<EstimateRow[]>([
      { item: '1. 要件定義', qty: 10, unit: 'person-day', unitPrice: 80000, taxable: true, note: '' },
      { item: '2. 基本設計', qty: 15, unit: 'person-day', unitPrice: 75000, taxable: true, note: '' },
      { item: '3. 実装', qty: 40, unit: 'person-day', unitPrice: 75000, taxable: true, note: '' },
      { item: '4. テスト', qty: 20, unit: 'person-day', unitPrice: 70000, taxable: true, note: '' },
      { item: '5. リリース作業', qty: 1, unit: 'set', unitPrice: 200000, taxable: true, note: '' },
      { item: '6. 保守サポート', qty: 12, unit: 'month', unitPrice: 50000, taxable: true, note: '年間契約' },
    ]);
    return (
      <div className="flex max-w-[960px] flex-col gap-2">
        <p className="text-sm text-[var(--color-on-surface-secondary)]">
          行番号をクリックして選択 → グリップドットを掴んでドラッグで並び替え。
        </p>
        <SpreadsheetGrid
          aria-label="見積明細（並び替え）"
          columns={estimateColumns}
          rows={rows}
          onRowsChange={setRows}
          createRow={createEstimateRow}
        />
      </div>
    );
  },
};

/* ----- セルの入力可否・表示の差し替え・固定列・合計行 ----- */

interface LineRow {
  id: string;
  kind: 'item' | 'subtotal';
  code: string;
  item: string;
  qty: number | null;
  unit: string | null;
  unitPrice: number | null;
  note: string;
}

const lineUnits = [
  { value: 'piece', label: '個' },
  { value: 'set', label: '式' },
  { value: 'person-day', label: '人日' },
];

const line = (
  kind: LineRow['kind'],
  code: string,
  item: string,
  qty: number | null,
  unit: string | null,
  unitPrice: number | null,
): LineRow => ({ id: `${kind}-${code}-${item}`, kind, code, item, qty, unit, unitPrice, note: '' });

/**
 * セル単位の入力可否（isCellEditable）・表示の差し替え（column.render）・書き込み口
 * （column.setValue）・行の class（rowClassName）・行番号（renderRowHeader）・左の列の固定
 * （stickyColumns）・合計行（column.footer）。
 *
 * - 「小計」の行は品番・数量・単位・単価を入力できない（打つと下に理由が出る）
 * - 品目を書き換えると、品番を消す（setValue で 2 つの項目を一緒に変える）
 * - 横にスクロールしても、行番号・品番・品目の列は左に残る
 */
export const CellControlAndLayout: Story = {
  render: () => {
    const [rows, setRows] = useState<LineRow[]>([
      line('item', 'A-001', '要件定義', 10, 'person-day', 80000),
      line('item', 'A-002', '設計・実装', 40, 'person-day', 75000),
      line('subtotal', '', '小計（開発）', null, null, null),
      line('item', 'B-001', 'サーバー費用', 12, 'piece', 50000),
      line('subtotal', '', '小計（運用）', null, null, null),
    ]);
    const [message, setMessage] = useState('');
    const amountOf = (target: LineRow): number => {
      if (target.kind === 'item') return (target.qty ?? 0) * (target.unitPrice ?? 0);
      // 小計: 直前の小計の次から、この行までの明細の合計
      const end = rows.indexOf(target);
      let sum = 0;
      for (let i = end - 1; i >= 0 && rows[i].kind === 'item'; i--) {
        sum += (rows[i].qty ?? 0) * (rows[i].unitPrice ?? 0);
      }
      return sum;
    };
    const columns: SpreadsheetColumn<LineRow>[] = [
      { key: 'code', header: '品番', type: 'text', width: 100 },
      {
        key: 'item',
        header: '品目',
        type: 'text',
        width: 200,
        required: true,
        setValue: (row, value) => ({ ...row, item: String(value ?? ''), code: '' }),
        footer: '合計',
      },
      {
        key: 'qty',
        header: '数量',
        type: 'number',
        width: 90,
        render: (row) => (row.kind === 'subtotal' ? '—' : row.qty?.toLocaleString()),
      },
      { key: 'unit', header: '単位', type: 'select', width: 90, options: lineUnits },
      { key: 'unitPrice', header: '単価', type: 'number', width: 120 },
      {
        key: 'amount',
        header: '金額',
        type: 'readonly',
        width: 130,
        align: 'right',
        className: 'bg-transparent',
        getValue: (row) => amountOf(row),
        render: (row) => (
          <span className={row.kind === 'subtotal' ? 'font-semibold' : undefined}>
            {amountOf(row).toLocaleString()}
          </span>
        ),
        footer: (all) =>
          all
            .filter((r) => r.kind === 'item')
            .reduce((sum, r) => sum + amountOf(r), 0)
            .toLocaleString(),
      },
      { key: 'note', header: '備考', type: 'text', width: 260 },
    ];
    return (
      <div className="flex max-w-[720px] flex-col gap-2">
        <SpreadsheetGrid<LineRow>
          aria-label="見積明細（入力可否・固定列・合計行）"
          columns={columns}
          rows={rows}
          onRowsChange={setRows}
          getRowId={(row) => row.id}
          createRow={() => ({
            ...line('item', '', '', null, null, null),
            id: `item-${Date.now()}-${Math.random()}`,
          })}
          isCellEditable={(row, column) =>
            !(row.kind === 'subtotal' && ['code', 'qty', 'unit', 'unitPrice'].includes(column.key))
          }
          onEditBlocked={({ row, column }) =>
            setMessage(`「${row.item}」の${column.header}は自動で計算するため入力できません`)
          }
          rowClassName={(row) =>
            row.kind === 'subtotal' ? 'bg-[var(--color-surface-sunken)]' : undefined
          }
          renderRowHeader={(row, i) => (row.kind === 'subtotal' ? '計' : i + 1)}
          rowHeaderWidth={52}
          stickyColumns={2}
        />
        <p className="min-h-5 text-sm text-[var(--color-on-surface-secondary)]">{message}</p>
      </div>
    );
  },
};

/* ----- アプリと分け合う（選択・キー操作・右クリック・元に戻す・貼り付け） ----- */

interface TaskRow {
  id: string;
  task: string;
  owner: string;
  hours: number | null;
  starred: boolean;
}

let taskSeq = 0;
/** 新しい行（ID は毎回振り直す。複製にも使う） */
const newTask = (init: Partial<TaskRow> = {}): TaskRow => ({
  task: '',
  owner: '',
  hours: null,
  starred: false,
  ...init,
  id: `task-${++taskSeq}`,
});

/**
 * アプリの画面と連動する例。
 *
 * - 下に、選んだ行数と時間の合計が出る（onSelectionChange）
 * - 元に戻す・やり直すはアプリ側の履歴（history={false}。ボタンと Ctrl/Cmd+Z）
 * - Ctrl/Cmd+D で選んだ行を複製する（onKeyDown で足したショートカット）
 * - 右クリック「★を付ける／外す」（contextMenu で足した項目）
 * - 2 行以上の貼り付けは、選んだ行の下に新しい行として差し込む（onPaste）
 * - 「3 行目の時間へ」で、外からセルを選ぶ（ref.select）
 */
export const AppIntegration: Story = {
  render: () => {
    const gridRef = useRef<SpreadsheetGridHandle>(null);
    const [state, setState] = useState(() => ({
      past: [] as TaskRow[][],
      present: [
        newTask({ task: '要件の確認', owner: '佐藤', hours: 4 }),
        newTask({ task: '画面の設計', owner: '鈴木', hours: 12 }),
        newTask({ task: '実装', owner: '佐藤', hours: 32 }),
        newTask({ task: 'テスト', owner: '田中', hours: 16 }),
      ],
      future: [] as TaskRow[][],
    }));
    const rows = state.present;
    const [selection, setSelection] = useState<SpreadsheetSelection | null>(null);
    const commit = (next: TaskRow[]) =>
      setState((s) => ({ past: [...s.past, s.present], present: next, future: [] }));
    const undo = () =>
      setState((s) =>
        s.past.length
          ? {
              past: s.past.slice(0, -1),
              present: s.past[s.past.length - 1],
              future: [s.present, ...s.future],
            }
          : s,
      );
    const redo = () =>
      setState((s) =>
        s.future.length
          ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) }
          : s,
      );
    const columns: SpreadsheetColumn<TaskRow>[] = [
      {
        key: 'task',
        header: '作業',
        type: 'text',
        width: 220,
        render: (row) => (row.starred ? `★ ${row.task}` : row.task),
      },
      { key: 'owner', header: '担当', type: 'text', width: 120 },
      { key: 'hours', header: '時間', type: 'number', width: 100 },
    ];
    const selectedHours = (selection?.rowIndexes ?? []).reduce(
      (sum, i) => sum + (rows[i]?.hours ?? 0),
      0,
    );
    const buttonClass =
      'rounded-md border border-[var(--color-border)] px-3 py-1 text-sm hover:bg-[var(--color-surface-muted)]';
    return (
      <div className="flex max-w-[640px] flex-col gap-2">
        <div className="flex gap-2">
          <button type="button" className={buttonClass} onClick={undo}>
            元に戻す
          </button>
          <button type="button" className={buttonClass} onClick={redo}>
            やり直す
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => gridRef.current?.select({ rowIndex: 2, columnKey: 'hours' })}
          >
            3 行目の時間へ
          </button>
        </div>
        <SpreadsheetGrid<TaskRow>
          ref={gridRef}
          aria-label="作業（アプリと連動）"
          columns={columns}
          rows={rows}
          onRowsChange={commit}
          getRowId={(row) => row.id}
          createRow={() => newTask()}
          duplicateRow={(row) => newTask(row)}
          history={false}
          onSelectionChange={setSelection}
          onKeyDown={(e, { selection: current }) => {
            const mod = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();
            if (mod && key === 'z') {
              e.preventDefault();
              if (e.shiftKey) redo();
              else undo();
            } else if (mod && key === 'd' && current) {
              e.preventDefault();
              const last = current.rowIndexes[current.rowIndexes.length - 1];
              const copies = current.rowIndexes.map((i) => newTask(rows[i]));
              commit([...rows.slice(0, last + 1), ...copies, ...rows.slice(last + 1)]);
            }
          }}
          contextMenu={(target) =>
            target.kind === 'cells' ? (
              <ContextMenuItem
                onSelect={() => {
                  const on = !target.rowIndexes.every((i) => rows[i].starred);
                  commit(
                    rows.map((row, i) =>
                      target.rowIndexes.includes(i) ? { ...row, starred: on } : row,
                    ),
                  );
                }}
              >
                ★を付ける／外す
              </ContextMenuItem>
            ) : null
          }
          onPaste={({ matrix, selection: current }) => {
            if (matrix.length < 2) return undefined;
            const last = current.rowIndexes[current.rowIndexes.length - 1];
            const added = matrix.map(([task = '', owner = '', hours = '']) =>
              newTask({ task, owner, hours: hours.trim() === '' ? null : Number(hours) }),
            );
            return [...rows.slice(0, last + 1), ...added, ...rows.slice(last + 1)];
          }}
        />
        <p className="text-sm text-[var(--color-on-surface-secondary)]">
          {selection
            ? `${selection.rowIndexes.length} 行を選択・時間の合計 ${selectedHours}`
            : '未選択'}
        </p>
      </div>
    );
  },
};

/* ----- 候補つきの入力列（autocomplete） ----- */

interface PartRow {
  id: string;
  item: string;
  qty: number | null;
  unit: string | null;
  unitPrice: number | null;
}

interface PartData {
  unit: string;
  unitPrice: number;
}

const partCatalog: { value: string; label: string; description: string; data: PartData }[] = [
  { value: 'p1', label: '配管工事', description: '給排水', data: { unit: '式', unitPrice: 120000 } },
  { value: 'p2', label: '配線工事', description: '電気', data: { unit: 'ｍ', unitPrice: 800 } },
  { value: 'p3', label: '内装解体', description: '解体', data: { unit: '㎡', unitPrice: 2000 } },
  { value: 'p4', label: '産廃処分費', description: '処分', data: { unit: '式', unitPrice: 50000 } },
  { value: 'p5', label: '養生費', description: '共通', data: { unit: '式', unitPrice: 32000 } },
];

const partUnits = ['式', '個', '台', '㎡', 'ｍ', '人工'].map((u) => ({ value: u, label: u }));

let partSeq = 0;
const newPart = (init: Partial<PartRow> = {}): PartRow => ({
  item: '',
  qty: null,
  unit: null,
  unitPrice: null,
  ...init,
  id: `part-${++partSeq}`,
});

/**
 * 候補つきの入力列（type: 'autocomplete'）。
 *
 * - 品目: 打つたびに候補を出す（getOptions）。2 文字以上の前方一致か完全一致のときだけ
 *   先頭を選ぶ。選ぶと単位・単価も入り（onSelectOption）、数量の列へ移る（focusAfterSelect）。
 *   候補にない名前は、最後の行「…を新しい品目として入力」で入る（freeTextOption）
 * - 単位: 決まった候補（options）を打った文字で絞り込む。全角と半角の違いは吸収する
 *   （m2 で ㎡、m で ｍ にも当たる）。Excel から貼った単位も同じように照合する
 */
export const Autocomplete: Story = {
  render: () => {
    const [rows, setRows] = useState<PartRow[]>([
      newPart({ item: '配管工事', qty: 1, unit: '式', unitPrice: 120000 }),
      newPart(),
      newPart(),
    ]);
    const columns: SpreadsheetColumn<PartRow>[] = [
      {
        key: 'item',
        header: '品目',
        type: 'autocomplete',
        width: 220,
        getOptions: (query) => partCatalog.filter((p) => !query || p.label.includes(query)),
        renderOption: (option) => {
          const data = option.data as PartData;
          return (
            <span className="flex items-baseline justify-between gap-3">
              <span>
                {option.label}
                <span className="ml-2 text-xs text-[var(--color-on-surface-muted)]">
                  {option.description}
                </span>
              </span>
              <span className="tabular-nums text-xs text-[var(--color-on-surface-secondary)]">
                {data.unitPrice.toLocaleString()}／{data.unit}
              </span>
            </span>
          );
        },
        optionsHeader: () => 'よく使う品目・↑↓で選んで Enter',
        optionsWidth: 320,
        onSelectOption: (row, option) => {
          const data = option.data as PartData;
          return { ...row, item: option.label, unit: data.unit, unitPrice: data.unitPrice };
        },
        focusAfterSelect: () => 'qty',
        freeTextOption: (text) => `「${text}」を新しい品目として入力`,
      },
      { key: 'qty', header: '数量', type: 'number', width: 90 },
      {
        key: 'unit',
        header: '単位',
        type: 'autocomplete',
        width: 80,
        align: 'center',
        options: partUnits,
        optionsWidth: 120,
      },
      { key: 'unitPrice', header: '単価', type: 'number', width: 120 },
      {
        key: 'amount',
        header: '金額',
        type: 'readonly',
        width: 130,
        align: 'right',
        getValue: (row) =>
          row.qty != null && row.unitPrice != null
            ? (row.qty * row.unitPrice).toLocaleString()
            : '',
      },
    ];
    return (
      <SpreadsheetGrid<PartRow>
        aria-label="見積明細（候補つき）"
        className="max-w-[720px]"
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
        getRowId={(row) => row.id}
        createRow={() => newPart()}
      />
    );
  },
};

/* ----- 階層（treegrid） ----- */

interface EstimateNode {
  id: string;
  depth: number;
  item: string;
  qty: number | null;
  unit: string | null;
  unitPrice: number | null;
}

let nodeSeq = 0;
const estimateNode = (
  depth: number,
  item: string,
  qty: number | null = null,
  unit: string | null = null,
  unitPrice: number | null = null,
): EstimateNode => ({ id: `node-${++nodeSeq}`, depth, item, qty, unit, unitPrice });

const estimateUnits = ['式', '個', '㎡', 'ｍ', '人工'].map((u) => ({ value: u, label: u }));

/** 子を持つ行（すぐ下により深い行が続く行）と、金額（子を持つ行は子の合計） */
const summarize = (rows: EstimateNode[]) => {
  const n = rows.length;
  const isParent = rows.map((r, i) => i + 1 < n && rows[i + 1].depth > r.depth);
  const amount = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    if (!isParent[i]) {
      amount[i] = (rows[i].qty ?? 0) * (rows[i].unitPrice ?? 0);
      continue;
    }
    for (let k = i + 1; k < n && rows[k].depth > rows[i].depth; k++) {
      if (rows[k].depth === rows[i].depth + 1) amount[i] += amount[k];
    }
  }
  return { isParent, amount };
};

function TreeEstimate({ initial, className }: { initial: EstimateNode[]; className?: string }) {
  const [rows, setRows] = useState(initial);
  const { isParent, amount } = useMemo(() => summarize(rows), [rows]);
  const indexOf = useMemo(() => new Map(rows.map((row, i) => [row.id, i])), [rows]);
  const at = (row: EstimateNode) => indexOf.get(row.id) ?? -1;
  const columns: SpreadsheetColumn<EstimateNode>[] = [
    { key: 'item', header: '名称', type: 'text', width: 260, footer: '合計' },
    {
      key: 'qty',
      header: '数量',
      type: 'number',
      width: 90,
      render: (row) => (isParent[at(row)] ? '1' : row.qty?.toLocaleString()),
    },
    {
      key: 'unit',
      header: '単位',
      type: 'autocomplete',
      width: 80,
      align: 'center',
      options: estimateUnits,
      optionsWidth: 120,
      render: (row) => (isParent[at(row)] ? '式' : row.unit),
    },
    {
      key: 'unitPrice',
      header: '単価',
      type: 'number',
      width: 110,
      render: (row) => (isParent[at(row)] ? '' : row.unitPrice?.toLocaleString()),
    },
    {
      key: 'amount',
      header: '金額',
      type: 'readonly',
      width: 130,
      align: 'right',
      className: 'bg-transparent',
      getValue: (row) => amount[at(row)],
      render: (row) => (
        <span className={isParent[at(row)] ? 'font-semibold' : undefined}>
          {(amount[at(row)] ?? 0).toLocaleString()}
        </span>
      ),
      footer: (all) =>
        all
          .reduce((sum, row, i) => (row.depth === 0 ? sum + (amount[i] ?? 0) : sum), 0)
          .toLocaleString(),
    },
  ];
  return (
    <SpreadsheetGrid<EstimateNode>
      aria-label="見積明細（階層）"
      className={className}
      columns={columns}
      rows={rows}
      onRowsChange={setRows}
      getRowId={(row) => row.id}
      getRowDepth={(row) => row.depth}
      treeColumnKey="item"
      createRow={(context) => estimateNode(context?.depth ?? 0, '')}
      isCellEditable={(row, column) =>
        !(isParent[at(row)] && ['qty', 'unit', 'unitPrice'].includes(column.key))
      }
      rowClassName={(row) =>
        row.depth === 0 ? 'font-semibold bg-[var(--color-surface-sunken)]' : undefined
      }
      stickyColumns={1}
    />
  );
}

/**
 * 階層つきの表（getRowDepth を渡すと treegrid になる）。データは平らな配列のまま、
 * 行の深さで親子を決める（行の親は、直前にある、より浅い行）。
 *
 * - ▼／▶ で畳む・開く。矢印キーの移動・範囲・コピーは畳んだ配下を飛ばす
 * - 行番号をドラッグすると配下ごと動く。落とせるのは同じ親の兄弟の間だけ（線が出る位置）
 * - 右クリックの挿入・複製・上下移動・削除も配下ごと。挿入は同じ深さで入る
 * - 子を持つ行の数量・単位・単価は入力できず（isCellEditable）、金額は子の合計
 */
export const Tree: Story = {
  render: () => (
    <TreeEstimate
      className="max-w-[760px]"
      initial={[
        estimateNode(0, '解体工事'),
        estimateNode(1, '内装解体'),
        estimateNode(2, '床解体', 10, '㎡', 2000),
        estimateNode(2, '壁解体', 20, '㎡', 1500),
        estimateNode(1, '産廃処分'),
        estimateNode(2, '産廃処分費', 1, '式', 50000),
        estimateNode(0, '設備工事'),
        estimateNode(1, '給排水'),
        estimateNode(2, '配管', 15, 'ｍ', 3000),
        estimateNode(2, '継手', 12, '個', 450),
      ]}
    />
  ),
};

/** 階層つきで約 300 行（10 × 3 × 9 の 3 階層）。打鍵や矢印の移動で、変わった行だけ描き直す */
export const TreeThreeHundredRows: Story = {
  render: () => {
    const initial: EstimateNode[] = [];
    for (let a = 1; a <= 10; a++) {
      initial.push(estimateNode(0, `大項目 ${a}`));
      for (let b = 1; b <= 3; b++) {
        initial.push(estimateNode(1, `中項目 ${a}-${b}`));
        for (let c = 1; c <= 9; c++) {
          initial.push(estimateNode(2, `明細 ${a}-${b}-${c}`, c, '個', 1000 * b));
        }
      }
    }
    return <TreeEstimate className="max-h-[520px] max-w-[760px]" initial={initial} />;
  },
};
