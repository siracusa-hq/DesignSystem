import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SpreadsheetGrid,
  getSpreadsheetErrors,
  type SpreadsheetColumn,
  type SpreadsheetGridHandle,
  type SpreadsheetRow,
} from '../components/spreadsheet-grid';

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
          '右クリックからまとめて挿入・複製・移動・削除できる。' +
          'Cmd/Ctrl+Z で元に戻す、Cmd/Ctrl+Shift+Z または Ctrl+Y でやり直し。' +
          'バリデーションエラーは入力中にリアルタイム表示される。',
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
export const DirtyTracking: Story = {
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
