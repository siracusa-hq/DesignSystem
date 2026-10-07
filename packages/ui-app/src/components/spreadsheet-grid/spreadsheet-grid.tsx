import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatClipboardTable, parseClipboardTable } from '@/lib/clipboard-table';
import { normalizeText, parseNumberText } from '@/lib/normalize-text';
import { Checkbox } from '@/components/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/select';
import { DatePicker } from '@/components/date-picker';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/context-menu';

/* --------------------------------------------------------
   SpreadsheetGrid

   見積明細のような「複数行 × 複数列」を一括入力・編集するための
   スプレッドシート風グリッド。〜300行程度を想定（仮想化なし）。

   - データは完全制御型（rows / onRowsChange）。保存はアプリ側が
     rows を一括送信する前提で、本コンポーネントは通信を行わない
   - 数式・セル参照はサポートしない。計算列は type: 'readonly' +
     getValue でアプリ側から定義する
   - バリデーションはセル編集中にもリアルタイムに表示する
   - Cmd/Ctrl+Z で Undo、Cmd/Ctrl+Shift+Z / Ctrl+Y で Redo。
     グリッド内部からの変更のみが履歴対象（外部からの rows 差し替えで
     履歴はリセットされる）。history={false} ならアプリ側で持つ
   - 入力できるセルを選んでいる間は、セルに透明な入力欄を置いて
     フォーカスを渡す。打鍵や日本語入力（IME）の変換開始で、
     そのまま同じ入力欄で編集に入る（変換が途切れない）
   - getRowDepth を渡すと階層つきの表（treegrid）になる。データは
     平らな配列のまま、行の深さで親子を決める
   -------------------------------------------------------- */

export type SpreadsheetCellValue = string | number | boolean | null | undefined;
export type SpreadsheetRow = Record<string, SpreadsheetCellValue>;

export type SpreadsheetColumnType =
  'text' | 'number' | 'select' | 'date' | 'checkbox' | 'readonly' | 'autocomplete';

export interface SpreadsheetSelectOption {
  value: string;
  label: string;
}

/** autocomplete 列の候補 */
export interface SpreadsheetOption<T = unknown> {
  value: string;
  label: string;
  /** 候補行の補足（renderOption 未指定時に薄字で表示） */
  description?: string;
  /** 付随データ。onSelectOption にそのまま渡る */
  data?: T;
}

export interface SpreadsheetColumn<Row extends object = SpreadsheetRow> {
  key: string;
  header: string;
  type: SpreadsheetColumnType;
  /** 列幅(px)。既定 160 */
  width?: number;
  /** type: 'select' の選択肢。type: 'autocomplete' では決まった候補（打った文字で絞り込む） */
  options?: SpreadsheetSelectOption[];
  required?: boolean;
  /** type: 'number' の下限/上限 */
  min?: number;
  max?: number;
  /** カスタム検証。エラーメッセージを返すとエラー表示（null/undefined で合格） */
  validate?: (value: SpreadsheetCellValue, row: Row) => string | null | undefined;
  /** type: 'readonly' の値（計算列）。表示とコピーに使う。例: (r) => r.qty * r.price */
  getValue?: (row: Row) => React.ReactNode;
  /** 編集中でないときの表示を差し替える。readonly 以外の列でも使える */
  render?: (row: Row, cell: { rowIndex: number; editable: boolean }) => React.ReactNode;
  /**
   * セルに値を書く。編集の確定・貼り付け・Delete・範囲入力のすべてがここを通る。
   * 既定は `{ ...row, [key]: value }`。ほかの項目も一緒に変えたいときに使う
   */
  setValue?: (row: Row, value: SpreadsheetCellValue) => Row;
  /** 合計行に出す中身。どれかの列に指定すると合計行が出る */
  footer?: React.ReactNode | ((rows: Row[]) => React.ReactNode);
  /** 文字の寄せ。既定は number が右、ほかは左 */
  align?: 'left' | 'center' | 'right';
  /** セル（td）に足す class */
  className?: string;
  /** autocomplete: 打った文字と行から候補を出す（手元で計算する前提で同期） */
  getOptions?: (query: string, row: Row) => SpreadsheetOption[];
  /** autocomplete: 候補 1 件の表示。既定は label と description */
  renderOption?: (
    option: SpreadsheetOption,
    state: { active: boolean },
  ) => React.ReactNode;
  /** autocomplete: 候補の上に出す見出し */
  optionsHeader?: (row: Row) => React.ReactNode;
  /** autocomplete: 候補の幅(px)。既定はセル幅（最低 200） */
  optionsWidth?: number;
  /** autocomplete: 候補を選んだときに行へ反映する（複数の項目を書き換えてよい）。既定は value をこの列に書く */
  onSelectOption?: (row: Row, option: SpreadsheetOption) => Row;
  /** autocomplete: 候補を選んだあとに移る列（同じ行）。返さなければ Enter は下・Tab は右へ */
  focusAfterSelect?: (row: Row, option: SpreadsheetOption) => string | undefined;
  /** autocomplete: 候補にない文字も確定できるか。既定 true */
  allowFreeText?: boolean;
  /** autocomplete: 候補の最後に「打った文字をそのまま入れる」行を出す（その表示） */
  freeTextOption?: (text: string) => React.ReactNode;
}

export interface SpreadsheetError {
  rowIndex: number;
  columnKey: string;
  message: string;
}

export interface SpreadsheetCellRef {
  rowIndex: number;
  columnKey: string;
}

export interface SpreadsheetSelection {
  /** 起点のセル（フォーカスのあるセル） */
  active: SpreadsheetCellRef;
  /** 範囲に入っている行（表に出ている行だけ・上から順） */
  rowIndexes: number[];
  /** 範囲に入っている列（左から順） */
  columnKeys: string[];
}

export type SpreadsheetMenuTarget =
  | {
      kind: 'cells';
      /** 右クリックした行 */
      rowIndex: number;
      /** 対象の行（右クリックした行が範囲内なら範囲の行、外ならその行だけ） */
      rowIndexes: number[];
      columnKey: string;
    }
  | { kind: 'footer'; columnKey: string };

export interface SpreadsheetGridHandle {
  /** 変更済みセルのマーカーをすべて消す（保存完了後に呼ぶ） */
  clearDirty: () => void;
  /** セルを選ぶ（見えるところまでスクロールする）。extendTo を渡すと範囲を選ぶ */
  select: (cell: SpreadsheetCellRef, extendTo?: SpreadsheetCellRef) => void;
  /** グリッドにフォーカスを戻す */
  focus: () => void;
}

export interface SpreadsheetGridProps<Row extends object = SpreadsheetRow> {
  columns: SpreadsheetColumn<Row>[];
  rows: Row[];
  /** 編集・行操作・ペーストなど、すべての変更がここに集約される */
  onRowsChange: (rows: Row[]) => void;
  /** 行追加時の初期値。既定は空オブジェクト。階層つきでは depth が渡る */
  createRow?: (context?: { depth: number }) => Row;
  /** 下部の行追加ボタンを隠す */
  hideAddRow?: boolean;
  /** 行追加ボタンのラベル。既定「行を追加」 */
  addRowLabel?: string;
  'aria-label': string;
  className?: string;

  /** 行の ID。React の key と変更セルの印の基準に使う。既定は行オブジェクトの同一性 */
  getRowId?: (row: Row) => string;
  /** セルごとの入力可否。false のセルは編集・Delete・貼り付け・範囲入力の対象外 */
  isCellEditable?: (
    row: Row,
    column: SpreadsheetColumn<Row>,
    rowIndex: number,
  ) => boolean;
  /** 入力できないセルに入力しようとしたとき（理由を知らせる用） */
  onEditBlocked?: (cell: {
    row: Row;
    rowIndex: number;
    column: SpreadsheetColumn<Row>;
  }) => void;
  /** 行に付ける class */
  rowClassName?: (row: Row, rowIndex: number) => string | undefined;
  /** 行番号の列の中身。既定は 1 からの連番 */
  renderRowHeader?: (row: Row, rowIndex: number) => React.ReactNode;
  /** 行番号の列の幅(px)。既定 44 */
  rowHeaderWidth?: number;
  /** 左から固定する列の数（行番号の列も固定する）。DataTable と同じ名前 */
  stickyColumns?: number;

  /** 選択が変わったとき */
  onSelectionChange?: (selection: SpreadsheetSelection | null) => void;
  /** グリッドより先に呼ぶ。event.preventDefault() すると、グリッドはそのキーを処理しない */
  onKeyDown?: (
    event: React.KeyboardEvent,
    context: { selection: SpreadsheetSelection | null; editing: boolean },
  ) => void;
  /** 右クリックメニューに足す中身（ContextMenuItem など） */
  contextMenu?: (target: SpreadsheetMenuTarget) => React.ReactNode;
  /** 既定の行操作（挿入・複製・移動・削除）をメニューに出すか。既定 true */
  rowActions?: boolean;
  /**
   * 元に戻すをグリッドの中で持つか。既定 true。false なら Cmd/Ctrl+Z・Y を
   * グリッドが取らず、外から rows が変わっても変更セルの印を消さない
   */
  history?: boolean;
  /**
   * 貼り付けを差し替える。行を返すとそれを使い、undefined なら既定の動き。
   * matrix は parseClipboardTable で行と列に分けたもの（Excel の改行・"…" で囲まれたセルも読む）
   */
  onPaste?: (paste: {
    text: string;
    matrix: string[][];
    selection: SpreadsheetSelection;
  }) => Row[] | undefined;
  /** 複製で行を作る。既定は浅いコピー */
  duplicateRow?: (row: Row) => Row;

  /** 階層の深さ（0 が最上位）。指定すると階層つきの表（treegrid）になる */
  getRowDepth?: (row: Row, rowIndex: number) => number;
  /** 字下げと ▶ を出す列。既定は先頭の列 */
  treeColumnKey?: string;
  /** 畳んでいる行の ID。指定しなければグリッドの中で持つ */
  collapsedRowIds?: ReadonlySet<string>;
  onCollapsedRowIdsChange?: (ids: Set<string>) => void;
}

/* ----- 値の読み書き ----- */

const cellOf = <Row extends object>(
  row: Row | undefined,
  key: string,
): SpreadsheetCellValue =>
  row ? ((row as Record<string, unknown>)[key] as SpreadsheetCellValue) : undefined;

/** 透明な入力欄を置いて、打鍵・日本語入力で編集に入る列 */
const TEXT_INPUT_TYPES: SpreadsheetColumnType[] = ['text', 'number', 'autocomplete'];
const EDITABLE_TYPES: SpreadsheetColumnType[] = [
  'text',
  'number',
  'select',
  'date',
  'autocomplete',
];

// 空値（null / undefined / 空文字）は同一とみなして比較する
const normalizeForCompare = (v: SpreadsheetCellValue) =>
  v === undefined || v === null || v === '' ? null : v;

/* ----- バリデーション ----- */

function validateCell<Row extends object>(
  column: SpreadsheetColumn<Row>,
  value: SpreadsheetCellValue,
  row: Row,
): string | null {
  if (column.type !== 'readonly' && column.required) {
    const empty =
      value === null || value === undefined || value === '' || value === false;
    if (column.type === 'checkbox' ? value !== true : empty) {
      return '必須項目です';
    }
  }
  if (column.type === 'number' && value !== null && value !== undefined && value !== '') {
    const num = typeof value === 'number' ? value : parseNumberText(String(value));
    if (num === undefined || num === null || Number.isNaN(num))
      return '数値で入力してください';
    if (column.min !== undefined && num < column.min)
      return `${column.min} 以上を入力してください`;
    if (column.max !== undefined && num > column.max)
      return `${column.max} 以下を入力してください`;
  }
  return column.validate?.(value, row) ?? null;
}

/** 全セルを検証してエラー一覧を返す。アプリ側の「保存ボタン無効化」などに使う */
export function getSpreadsheetErrors<Row extends object>(
  rows: Row[],
  columns: SpreadsheetColumn<Row>[],
): SpreadsheetError[] {
  const errors: SpreadsheetError[] = [];
  rows.forEach((row, rowIndex) => {
    for (const column of columns) {
      if (column.type === 'readonly') continue;
      const message = validateCell(column, cellOf(row, column.key), row);
      if (message) errors.push({ rowIndex, columnKey: column.key, message });
    }
  });
  return errors;
}

/* ----- 値の変換 ----- */

function parseDraft(
  type: SpreadsheetColumnType,
  draft: string,
): { ok: boolean; value: SpreadsheetCellValue } {
  if (type === 'number') {
    const num = parseNumberText(draft);
    return num === undefined ? { ok: false, value: null } : { ok: true, value: num };
  }
  if (type === 'select' || type === 'date') {
    return { ok: true, value: draft === '' ? null : draft };
  }
  return { ok: true, value: draft };
}

/** 読めない値の印（貼り付けではセルを変えずに元の値を残す） */
const KEEP: unique symbol = Symbol('keep');
type PastedValue = SpreadsheetCellValue | typeof KEEP;

/** 選択肢の照合。値かラベルの完全一致を先に、なければ表記ゆれを吸収して探す */
function matchOption(
  options: SpreadsheetSelectOption[] | undefined,
  text: string,
): string | undefined {
  if (!options) return undefined;
  const exact =
    options.find((o) => o.value === text) ?? options.find((o) => o.label === text);
  if (exact) return exact.value;
  const q = normalizeText(text);
  if (!q) return undefined;
  return (
    options.find((o) => normalizeText(o.value) === q) ??
    options.find((o) => normalizeText(o.label) === q)
  )?.value;
}

function parsePastedValue<Row extends object>(
  column: SpreadsheetColumn<Row>,
  text: string,
): PastedValue {
  const trimmed = text.trim();
  switch (column.type) {
    case 'number': {
      const num = parseNumberText(trimmed);
      return num === undefined ? KEEP : num;
    }
    case 'checkbox':
      return /^(true|1|yes|✓|○)$/i.test(trimmed);
    case 'date': {
      if (trimmed === '') return null;
      const normalized = trimmed.normalize('NFKC').replace(/\//g, '-');
      return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : KEEP;
    }
    case 'select': {
      if (trimmed === '') return null;
      // value か label のどちらでも受け付ける（Excel からはラベルが貼られがち）
      return matchOption(column.options, trimmed) ?? KEEP;
    }
    case 'autocomplete': {
      if (trimmed === '') return '';
      const hit = matchOption(column.options, trimmed);
      if (hit !== undefined) return hit;
      return column.allowFreeText === false ? KEEP : trimmed;
    }
    default:
      return text;
  }
}

function formatCellForCopy<Row extends object>(
  column: SpreadsheetColumn<Row>,
  row: Row,
): string {
  const value = cellOf(row, column.key);
  if (column.type === 'checkbox') return value === true ? 'TRUE' : 'FALSE';
  if (column.type === 'readonly' && column.getValue) {
    const computed = column.getValue(row);
    if (typeof computed === 'string' || typeof computed === 'number') {
      return String(computed);
    }
  }
  if (column.type === 'select' || column.type === 'autocomplete') {
    const option = column.options?.find((o) => o.value === value);
    if (option) return option.label;
  }
  return value === null || value === undefined ? '' : String(value);
}

function formatCellForDisplay<Row extends object>(
  column: SpreadsheetColumn<Row>,
  row: Row,
): React.ReactNode {
  if (column.type === 'readonly' && column.getValue) return column.getValue(row);
  const value = cellOf(row, column.key);
  if (value === null || value === undefined || value === '') return null;
  if (column.type === 'select' || column.type === 'autocomplete') {
    return column.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  if (column.type === 'number' && typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}

/** 決まった候補の絞り込み（前方一致を先に、次に部分一致） */
function filterOptions(
  options: SpreadsheetSelectOption[],
  query: string,
): SpreadsheetOption[] {
  const q = normalizeText(query);
  if (!q) return options;
  const starts = options.filter((o) => normalizeText(o.label).startsWith(q));
  const includes = options.filter(
    (o) => !starts.includes(o) && normalizeText(o.label).includes(q),
  );
  return [...starts, ...includes];
}

/* ----- 階層 -----

   平らな行の並びと深さから親子を決める。行の親は「直前にある、より浅い行」。
   end[i] は i の配下の終わり（含まない）。 */

interface TreeInfo {
  depth: number[];
  parent: Int32Array;
  end: Int32Array;
}

function buildTree(depths: number[]): TreeInfo {
  const n = depths.length;
  const parent = new Int32Array(n).fill(-1);
  const end = new Int32Array(n);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && depths[stack[stack.length - 1]] >= depths[i]) {
      end[stack.pop()!] = i;
    }
    parent[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }
  while (stack.length) end[stack.pop()!] = n;
  return { depth: depths, parent, end };
}

/** from〜to（含まない）の行のまとまりを、at の位置（元の並びでの位置）へ動かす */
function moveBlock<T>(items: T[], from: number, to: number, at: number): T[] {
  const block = items.slice(from, to);
  const rest = [...items.slice(0, from), ...items.slice(to)];
  const insertAt = at > from ? at - block.length : at;
  rest.splice(insertAt, 0, ...block);
  return rest;
}

const INDENT = 18;
const TOGGLE_WIDTH = 16;

/* ----- select / date のセルエディタ -----

   既存の Select / DatePicker（Radix Popover ベース）をセルエディタとして使う。
   どちらも Portal を使うため blur ベースの確定は成立しない（フォーカスが
   Portal に移った瞬間に blur が発火する）。そのため確定・取消は
   「値の選択 = 確定」「Escape / 選択せず閉じる = 取消」で扱い、
   別セルクリック時の取消はグリッド側の onMouseDown で面倒を見る。 */

const SELECT_CLEAR_VALUE = '__spreadsheet_grid_clear__';

function SelectCellEditor<Row extends object>({
  column,
  value,
  invalid,
  onCommit,
  onCancel,
}: {
  column: SpreadsheetColumn<Row>;
  value: SpreadsheetCellValue;
  invalid: boolean;
  onCommit: (value: SpreadsheetCellValue) => void;
  onCancel: () => void;
}) {
  const committedRef = React.useRef(false);
  return (
    <Select
      defaultOpen
      value={typeof value === 'string' && value !== '' ? value : undefined}
      onValueChange={(v) => {
        committedRef.current = true;
        onCommit(v === SELECT_CLEAR_VALUE ? null : v);
      }}
      onOpenChange={(open) => {
        // 値を選ばずに閉じたら取消（選択時は onValueChange が先に走る）
        if (!open && !committedRef.current) onCancel();
      }}
    >
      <SelectTrigger
        aria-label={column.header}
        aria-invalid={invalid || undefined}
        className="h-full w-full rounded-none border-0 bg-[var(--color-surface-raised)] px-2 text-sm ring-2 ring-inset ring-[var(--color-primary-500)]"
      >
        <SelectValue placeholder="—" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SELECT_CLEAR_VALUE}>—</SelectItem>
        {column.options?.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateCellEditor<Row extends object>({
  column,
  value,
  invalid,
  onCommit,
  onCancel,
}: {
  column: SpreadsheetColumn<Row>;
  value: SpreadsheetCellValue;
  invalid: boolean;
  onCommit: (value: SpreadsheetCellValue) => void;
  onCancel: () => void;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // 編集開始と同時にカレンダーを開く（DatePicker は open を外から制御できない
  // ため、トリガーのクリックで開く）
  React.useEffect(() => {
    triggerRef.current?.focus();
    triggerRef.current?.click();
  }, []);

  return (
    <div
      className="h-full w-full"
      onKeyDown={(e) => {
        // Portal 内のキー操作も React ツリー経由でここに届く。
        // グリッドのナビゲーションには渡さない
        e.stopPropagation();
        if (e.key === 'Escape') onCancel();
      }}
    >
      <DatePicker
        ref={triggerRef}
        value={typeof value === 'string' ? value : ''}
        onValueChange={(v) => onCommit(v === '' ? null : v)}
        aria-label={column.header}
        aria-invalid={invalid || undefined}
        size="sm"
        className="h-full w-full rounded-none border-0 ring-2 ring-inset ring-[var(--color-primary-500)]"
      />
    </div>
  );
}

/* ----- 候補の一覧（autocomplete） -----

   表のスクロールで切れないよう body に置き、セルの下（空きがなければ上）に出す。
   入力欄からフォーカスを動かさない（mousedown を止める）。 */

type OptionItem =
  { kind: 'option'; option: SpreadsheetOption } | { kind: 'free'; text: string };

function OptionsPopup({
  anchor,
  width,
  header,
  items,
  highlight,
  listId,
  renderOption,
  freeTextOption,
  onHover,
  onPick,
}: {
  anchor: HTMLElement | undefined;
  width?: number;
  header: React.ReactNode;
  items: OptionItem[];
  highlight: number;
  listId: string;
  renderOption?: (
    option: SpreadsheetOption,
    state: { active: boolean },
  ) => React.ReactNode;
  freeTextOption?: (text: string) => React.ReactNode;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!anchor) return;
    const measure = () => setRect(anchor.getBoundingClientRect());
    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [anchor]);

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-option-index="${highlight}"]`)
      ?.scrollIntoView?.({ block: 'nearest' });
  }, [highlight]);

  if (!rect || typeof document === 'undefined') return null;
  const w = width ?? Math.max(200, rect.width);
  const below = window.innerHeight - rect.bottom - 12;
  const above = rect.top - 12;
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - w - 8));
  // 下に余裕がなければセルの上側に出す
  const style: React.CSSProperties =
    below < 260 && above > below
      ? { bottom: window.innerHeight - rect.top + 2, left, maxHeight: above, width: w }
      : { top: rect.bottom + 2, left, maxHeight: below, width: w };

  return createPortal(
    <div
      ref={listRef}
      id={listId}
      role="listbox"
      className="fixed z-popover overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-1 text-sm shadow-lg"
      style={style}
      onMouseDown={(e) => e.preventDefault()}
    >
      {header && (
        <div className="px-3 pb-1 pt-1.5 text-xs text-[var(--color-on-surface-muted)]">
          {header}
        </div>
      )}
      {items.map((item, i) => {
        const activeItem = i === highlight;
        return (
          <div
            key={item.kind === 'option' ? `o:${item.option.value}:${i}` : 'free'}
            id={`${listId}-${i}`}
            data-option-index={i}
            role="option"
            aria-selected={activeItem}
            className={cn(
              'cursor-pointer px-3 py-1.5',
              activeItem && 'bg-[var(--color-surface-accent)]',
            )}
            onMouseEnter={() => onHover(i)}
            onClick={() => onPick(i)}
          >
            {item.kind === 'free' ? (
              freeTextOption ? (
                freeTextOption(item.text)
              ) : (
                item.text
              )
            ) : renderOption ? (
              renderOption(item.option, { active: activeItem })
            ) : (
              <span className="flex items-baseline gap-2">
                <span className="truncate">{item.option.label}</span>
                {item.option.description && (
                  <span className="truncate text-xs text-[var(--color-on-surface-muted)]">
                    {item.option.description}
                  </span>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

/* ----- 行 ----- */

interface CellPos {
  r: number;
  c: number;
}

interface EditingState {
  r: number;
  c: number;
  draft: string;
  /** enter: 打ち始めで入った（↑↓で確定して移動）／edit: Enter・F2・ダブルクリックで入った */
  mode: 'enter' | 'edit';
  original: string;
  /** 候補の選択位置（-1 は選んでいない） */
  highlight: number;
}

interface EditingView {
  c: number;
  draft: string;
  liveError: string | null;
  items: OptionItem[] | null;
  highlight: number;
  header: React.ReactNode;
}

/** 行に渡す操作。参照は変わらない（中で最新の状態を読む） */
interface GridApi<Row extends object> {
  isDirty: (row: Row, key: string) => boolean;
  setCellRef: (r: number, c: number, node: HTMLTableCellElement | null) => void;
  getCell: (r: number, c: number) => HTMLTableCellElement | undefined;
  setInputRef: (node: HTMLInputElement | null) => void;
  cellMouseDown: (r: number, c: number, e: React.MouseEvent) => void;
  cellMouseEnter: (r: number, c: number) => void;
  cellDoubleClick: (r: number, c: number) => void;
  cellContextMenu: (r: number, c: number) => void;
  headerMouseDown: (r: number, e: React.MouseEvent) => void;
  headerMouseEnter: (r: number) => void;
  rowMouseEnter: (r: number) => void;
  rowMouseMove: (r: number, e: React.MouseEvent<HTMLTableRowElement>) => void;
  toggleCollapse: (r: number) => void;
  inputChange: (value: string) => void;
  inputCompositionStart: () => void;
  inputBlur: () => void;
  inputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  pickerCommit: (value: SpreadsheetCellValue) => void;
  pickerCancel: () => void;
  checkboxChange: (r: number, c: number, checked: boolean) => void;
  optionHover: (index: number) => void;
  optionPick: (index: number) => void;
}

interface RowViewProps<Row extends object> {
  row: Row;
  r: number;
  columns: SpreadsheetColumn<Row>[];
  /** この行がアクティブなら列の位置、違えば -1 */
  activeC: number;
  /** 範囲に入っていれば左右の列、入っていなければ -1 */
  selLeft: number;
  selRight: number;
  rowSelected: boolean;
  editing: EditingView | null;
  dropEdge: 'top' | 'bottom' | null;
  dragging: boolean;
  dirtyVersion: number;
  depth: number;
  treeCol: number;
  hasChildren: boolean;
  collapsed: boolean;
  treeMode: boolean;
  stickyLefts: (number | undefined)[];
  headerSticky: boolean;
  isCellEditable?: (
    row: Row,
    column: SpreadsheetColumn<Row>,
    rowIndex: number,
  ) => boolean;
  /** rowClassName の結果（文字列で受け取り、変わった行だけ描き直す） */
  className?: string;
  renderRowHeader?: (row: Row, rowIndex: number) => React.ReactNode;
  listId: string;
  errorId: string;
  api: GridApi<Row>;
}

function RowViewInner<Row extends object>(p: RowViewProps<Row>) {
  const { row, r, columns, api } = p;
  const headerContent = p.renderRowHeader ? p.renderRowHeader(row, r) : r + 1;
  const dropShadow =
    p.dropEdge === 'top'
      ? 'shadow-[inset_0_2px_0_var(--color-primary-500)]'
      : p.dropEdge === 'bottom'
        ? 'shadow-[inset_0_-2px_0_var(--color-primary-500)]'
        : null;

  return (
    <tr
      aria-rowindex={r + 1}
      aria-level={p.treeMode ? p.depth + 1 : undefined}
      aria-expanded={p.treeMode && p.hasChildren ? !p.collapsed : undefined}
      className={cn('bg-[var(--color-surface-raised)]', p.className)}
      onMouseEnter={() => api.rowMouseEnter(r)}
      onMouseMove={p.dragging ? (e) => api.rowMouseMove(r, e) : undefined}
    >
      <th
        scope="row"
        aria-selected={p.rowSelected || undefined}
        onMouseDown={(e) => api.headerMouseDown(r, e)}
        onMouseEnter={() => api.headerMouseEnter(r)}
        onContextMenu={() => api.cellContextMenu(r, 0)}
        style={p.headerSticky ? { position: 'sticky', left: 0 } : undefined}
        className={cn(
          'group cursor-grab select-none border-b border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1 text-center text-xs font-normal text-[var(--color-on-surface-muted)]',
          'hover:bg-[var(--color-surface-muted)]',
          p.headerSticky && 'z-10',
          p.rowSelected &&
            'bg-[var(--color-surface-accent)] text-[var(--color-on-surface-accent)] font-medium',
          dropShadow,
          p.dragging && 'cursor-grabbing',
        )}
      >
        <span className="flex items-center justify-center">
          {/* ドラッグ可能のアフォーダンス。選択行は常時、
              未選択行はホバーで薄く表示（常にレンダリングして
              レイアウトシフトを防ぐ） */}
          <GripVertical
            aria-hidden
            className={cn(
              '-ml-1 h-3.5 w-3.5 shrink-0',
              p.rowSelected ? 'opacity-60' : 'opacity-0 group-hover:opacity-40',
            )}
          />
          {headerContent}
        </span>
      </th>
      {columns.map((column, c) => {
        const value = cellOf(row, column.key);
        const typeEditable = column.type !== 'readonly';
        const editable =
          typeEditable && (p.isCellEditable ? p.isCellEditable(row, column, r) : true);
        const isEditing = p.editing?.c === c;
        const isActive = p.activeC === c;
        const selected = p.selLeft >= 0 && c >= p.selLeft && c <= p.selRight;
        const textInput = isActive && editable && TEXT_INPUT_TYPES.includes(column.type);
        const pickerEditing =
          isEditing && (column.type === 'select' || column.type === 'date');
        const textEditing = isEditing && !pickerEditing;
        const error =
          isEditing || column.type === 'readonly'
            ? null
            : validateCell(column, value, row);
        const dirty = column.type !== 'readonly' && api.isDirty(row, column.key);
        const left = p.stickyLefts[c];
        const align = column.align ?? (column.type === 'number' ? 'right' : 'left');

        let display: React.ReactNode =
          column.type === 'checkbox' && !column.render ? (
            <span className="flex items-center justify-center">
              <Checkbox
                tabIndex={-1}
                disabled={!editable}
                checked={value === true}
                onCheckedChange={(checked) => api.checkboxChange(r, c, checked === true)}
              />
            </span>
          ) : (
            <span className="block truncate">
              {column.render
                ? column.render(row, { rowIndex: r, editable })
                : formatCellForDisplay(column, row)}
            </span>
          );
        if (c === p.treeCol) {
          display = (
            <span
              className="flex min-w-0 items-center gap-1"
              style={{ paddingLeft: p.depth * INDENT }}
            >
              {p.hasChildren ? (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={p.collapsed ? '開く' : '畳む'}
                  className="grid h-4 w-4 shrink-0 place-items-center rounded text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-muted)]"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    api.toggleCollapse(r);
                  }}
                >
                  {p.collapsed ? (
                    <ChevronRight aria-hidden className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown aria-hidden className="h-3.5 w-3.5" />
                  )}
                </button>
              ) : (
                <span aria-hidden className="w-4 shrink-0" />
              )}
              <span className="min-w-0 flex-1">{display}</span>
            </span>
          );
        }
        const inputOffset = c === p.treeCol ? 8 + p.depth * INDENT + TOGGLE_WIDTH : 0;

        return (
          <td
            key={column.key}
            ref={(node) => api.setCellRef(r, c, node)}
            role="gridcell"
            tabIndex={isActive && !textInput ? 0 : -1}
            aria-colindex={c + 2}
            aria-selected={selected || undefined}
            aria-readonly={!editable || undefined}
            aria-invalid={error ? true : undefined}
            title={error ?? undefined}
            data-dirty={dirty || undefined}
            data-error={error ? true : undefined}
            data-locked={(typeEditable && !editable) || undefined}
            onMouseDown={(e) => api.cellMouseDown(r, c, e)}
            onMouseEnter={() => api.cellMouseEnter(r, c)}
            onDoubleClick={() => api.cellDoubleClick(r, c)}
            onContextMenu={() => api.cellContextMenu(r, c)}
            style={left !== undefined ? { position: 'sticky', left } : undefined}
            className={cn(
              'relative h-9 border-b border-r border-[var(--color-border)] px-2 outline-none last:border-r-0',
              align === 'right' && 'text-right',
              align === 'center' && 'text-center',
              column.type === 'number' && 'tabular-nums',
              column.type === 'readonly' &&
                'bg-[var(--color-surface-sunken)] text-[var(--color-on-surface-secondary)]',
              typeEditable && !editable && 'text-[var(--color-on-surface-muted)]',
              column.className,
              // 固定した列は、行の背景（色と模様）を引き継いで下を流れるセルを隠す。
              // 列の className より後に置き、アプリの指定で透けないようにする
              left !== undefined && 'z-10 bg-inherit [background-image:inherit]',
              // 編集中のセルは、入力中のエラー表示が隣の行に隠れないよう前に出す
              isEditing && 'z-20',
              // エラーは淡い塗り + 細いリングに留める（赤を強くしすぎない）。
              // 選択中は選択色を優先し、アクティブ枠は ring と別プロパティ
              // （shadow）なので共存する。固定した列では下が透けない色にする
              error &&
                !isEditing &&
                (left !== undefined
                  ? 'bg-[color-mix(in_oklab,var(--color-error-500)_10%,var(--color-surface-raised))]'
                  : 'bg-[color-mix(in_oklab,var(--color-error-500)_10%,transparent)]'),
              error && !isEditing && 'ring-1 ring-inset ring-[var(--color-error-400)]',
              selected && !isEditing && 'bg-[var(--color-surface-accent)]',
              isActive &&
                !isEditing &&
                'shadow-[inset_0_0_0_2px_var(--color-primary-500)]',
              // 行 D&D のドロップ位置インジケータ（行全体に線を引く）
              dropShadow,
              pickerEditing && 'p-0',
            )}
          >
            {pickerEditing ? (
              column.type === 'select' ? (
                <SelectCellEditor
                  column={column}
                  value={value ?? null}
                  invalid={!!validateCell(column, value ?? null, row)}
                  onCommit={api.pickerCommit}
                  onCancel={api.pickerCancel}
                />
              ) : (
                <DateCellEditor
                  column={column}
                  value={value ?? null}
                  invalid={!!validateCell(column, value ?? null, row)}
                  onCommit={api.pickerCommit}
                  onCancel={api.pickerCancel}
                />
              )
            ) : textEditing ? null : (
              display
            )}
            {textInput && (
              <input
                ref={api.setInputRef}
                type="text"
                value={textEditing ? p.editing!.draft : ''}
                inputMode={column.type === 'number' ? 'decimal' : undefined}
                spellCheck={false}
                autoComplete="off"
                role={column.type === 'autocomplete' ? 'combobox' : undefined}
                aria-expanded={
                  column.type === 'autocomplete' ? !!p.editing?.items?.length : undefined
                }
                aria-controls={
                  column.type === 'autocomplete' && p.editing?.items?.length
                    ? p.listId
                    : undefined
                }
                aria-activedescendant={
                  column.type === 'autocomplete' && p.editing && p.editing.highlight >= 0
                    ? `${p.listId}-${p.editing.highlight}`
                    : undefined
                }
                aria-label={
                  textEditing
                    ? column.header
                    : `${column.header} ${formatCellForCopy(column, row)}`.trim()
                }
                aria-invalid={textEditing && p.editing!.liveError ? true : undefined}
                aria-describedby={
                  textEditing && p.editing!.liveError ? p.errorId : undefined
                }
                onChange={(e) => api.inputChange(e.target.value)}
                onCompositionStart={api.inputCompositionStart}
                onBlur={api.inputBlur}
                onKeyDown={api.inputKeyDown}
                style={inputOffset ? { left: inputOffset } : undefined}
                className={cn(
                  'absolute inset-y-0 right-0 h-full border-0 bg-transparent px-2 text-sm outline-none',
                  !inputOffset && 'left-0',
                  align === 'right' && 'text-right',
                  align === 'center' && 'text-center',
                  textEditing
                    ? cn(
                        'z-0 bg-[var(--color-surface-raised)] text-[var(--color-on-surface)] caret-[var(--color-primary-600)] ring-2 ring-inset',
                        p.editing!.liveError
                          ? 'ring-[var(--color-error-400)]'
                          : 'ring-[var(--color-primary-500)]',
                      )
                    : 'text-transparent caret-transparent',
                )}
              />
            )}
            {textEditing && p.editing!.liveError && (
              <div
                id={p.errorId}
                role="alert"
                className="absolute left-0 top-full z-10 mt-0.5 flex items-center gap-1 whitespace-nowrap rounded border border-[var(--color-error-200)] bg-[var(--color-surface-raised)] px-2 py-1 text-xs text-[var(--color-error-600)] shadow-md"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {p.editing!.liveError}
              </div>
            )}
            {textEditing && p.editing!.items && p.editing!.items.length > 0 && (
              <OptionsPopup
                anchor={api.getCell(r, c)}
                width={column.optionsWidth}
                header={p.editing!.header}
                items={p.editing!.items}
                highlight={p.editing!.highlight}
                listId={p.listId}
                renderOption={column.renderOption}
                freeTextOption={column.freeTextOption}
                onHover={api.optionHover}
                onPick={api.optionPick}
              />
            )}
            {dirty && (
              <span
                aria-hidden
                className="absolute right-0 top-0 h-0 w-0 border-l-[6px] border-t-[6px] border-l-transparent border-t-[var(--color-warning-500)]"
              />
            )}
          </td>
        );
      })}
    </tr>
  );
}

const RowView = React.memo(RowViewInner) as typeof RowViewInner;

/* ----- 本体 ----- */

function SpreadsheetGridInner<Row extends object>(
  props: SpreadsheetGridProps<Row>,
  ref: React.ForwardedRef<SpreadsheetGridHandle>,
) {
  const {
    columns,
    rows,
    onRowsChange,
    createRow = () => ({}) as Row,
    hideAddRow = false,
    addRowLabel = '行を追加',
    className,
    'aria-label': ariaLabel,
    getRowId,
    isCellEditable,
    onEditBlocked,
    rowClassName,
    renderRowHeader,
    rowHeaderWidth = 44,
    stickyColumns = 0,
    onSelectionChange,
    onKeyDown: onKeyDownProp,
    contextMenu,
    rowActions = true,
    history = true,
    onPaste: onPasteProp,
    duplicateRow,
    getRowDepth,
    treeColumnKey,
    collapsedRowIds,
    onCollapsedRowIdsChange,
  } = props;

  const [active, setActive] = React.useState<CellPos | null>(null);
  const [anchor, setAnchor] = React.useState<CellPos | null>(null);
  const [editing, setEditingState] = React.useState<EditingState | null>(null);
  const editingRef = React.useRef<EditingState | null>(null);
  const setEditing = (next: EditingState | null) => {
    editingRef.current = next;
    setEditingState(next);
  };
  const [menuTarget, setMenuTarget] = React.useState<SpreadsheetMenuTarget | null>(null);
  const [dirtyVersion, bumpDirtyVersion] = React.useReducer((v: number) => v + 1, 0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const theadRef = React.useRef<HTMLTableSectionElement>(null);
  const tfootRef = React.useRef<HTMLTableSectionElement>(null);
  const headerCellRefs = React.useRef<(HTMLTableCellElement | null)[]>([]);
  const cellRefs = React.useRef(new Map<string, HTMLTableCellElement>());
  const activeInputRef = React.useRef<HTMLInputElement | null>(null);
  const draggingRef = React.useRef(false);
  const committingRef = React.useRef(false);
  const pendingFocusRef = React.useRef(false);
  // フォーカスがグリッドの中にあるか。フォーカスしていた入力欄がセルの移動で
  // 消えると、ブラウザはフォーカスを body に戻す（blur は出ない）。そのときも
  // 「中にあった」とみなして、移った先のセルへフォーカスを戻す
  const focusInsideRef = React.useRef(false);
  const listId = React.useId();
  const errorId = React.useId();

  // 行の同一性管理。セル更新で行オブジェクトを作り直しても React key と
  // ベースライン（下記）が引き継がれるよう、WeakMap で id を採番する
  const rowKeyMap = React.useRef(new WeakMap<object, number>());
  const rowKeyCounter = React.useRef(0);

  const getRowKey = (row: Row): number => {
    let key = rowKeyMap.current.get(row);
    if (key === undefined) {
      key = rowKeyCounter.current++;
      rowKeyMap.current.set(row, key);
    }
    return key;
  };
  const idOf = (row: Row): string => (getRowId ? getRowId(row) : `#${getRowKey(row)}`);

  const transferRowIdentity = (oldRow: Row, newRow: Row) => {
    const key = rowKeyMap.current.get(oldRow);
    if (key !== undefined) rowKeyMap.current.set(newRow, key);
  };

  const ids = React.useMemo(() => rows.map(idOf), [rows, getRowId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- 階層と、表に出ている行 ----- */

  const treeMode = !!getRowDepth;
  const tree = React.useMemo(
    () => (getRowDepth ? buildTree(rows.map((row, i) => getRowDepth(row, i))) : null),
    [rows, getRowDepth],
  );
  const [collapsedInternal, setCollapsedInternal] = React.useState<Set<string>>(
    () => new Set(),
  );
  const collapsed = collapsedRowIds ?? collapsedInternal;
  const setCollapsed = (next: Set<string>) => {
    if (!collapsedRowIds) setCollapsedInternal(next);
    onCollapsedRowIdsChange?.(next);
  };
  const hasChildren = (r: number) => !!tree && tree.end[r] > r + 1;

  const visible = React.useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < rows.length;) {
      list.push(i);
      if (tree && tree.end[i] > i + 1 && collapsed.has(ids[i])) i = tree.end[i];
      else i++;
    }
    return list;
  }, [rows.length, tree, collapsed, ids]);

  const vpos = React.useMemo(() => {
    const a = new Int32Array(rows.length).fill(-1);
    visible.forEach((r, v) => {
      a[r] = v;
    });
    return a;
  }, [visible, rows.length]);
  const vOf = (r: number) => (r >= 0 && r < vpos.length ? vpos[r] : -1);

  const treeCol = treeMode
    ? Math.max(0, treeColumnKey ? columns.findIndex((c) => c.key === treeColumnKey) : 0)
    : -1;

  /* ----- 未保存マーカー（ベースライン比較） -----

     「一度でも編集したか」ではなく「最後に保存した時点（ベースライン）の
     値と現在値が違うか」で判定する。値を元に戻したセルや Undo したセルの
     マーカーは自然に消える。ベースラインは行 id → 行オブジェクトのマップで、
     マウント時・clearDirty 時・外部からの rows 差し替え時に取り直す
     （history={false} では外部からの差し替えでは取り直さない） */

  const baselineRef = React.useRef<Map<string, Row> | null>(null);
  if (baselineRef.current === null) {
    baselineRef.current = new Map(rows.map((row) => [idOf(row), row]));
  }

  const rebuildBaseline = (fromRows: Row[]) => {
    baselineRef.current = new Map(fromRows.map((row) => [idOf(row), row]));
  };

  const isCellDirty = (row: Row, columnKey: string): boolean => {
    const base = baselineRef.current!.get(idOf(row));
    // ベースラインに無い行 = 保存後に追加された行
    if (!base) return true;
    return !Object.is(
      normalizeForCompare(cellOf(base, columnKey)),
      normalizeForCompare(cellOf(row, columnKey)),
    );
  };

  /* ----- 選択範囲（表に出ている行の位置で持つ） ----- */

  const selectionRect = React.useMemo(() => {
    if (!active) return null;
    const a = anchor ?? active;
    const va = vOf(a.r);
    const vb = vOf(active.r);
    if (va < 0 || vb < 0) return null;
    return {
      top: Math.min(va, vb),
      bottom: Math.max(va, vb),
      left: Math.min(a.c, active.c),
      right: Math.max(a.c, active.c),
    };
  }, [active, anchor, vpos]); // eslint-disable-line react-hooks/exhaustive-deps

  const isMultiCell =
    !!selectionRect &&
    (selectionRect.top !== selectionRect.bottom ||
      selectionRect.left !== selectionRect.right);

  const isRowSelected = (r: number) => {
    const v = vOf(r);
    return (
      !!selectionRect &&
      v >= selectionRect.top &&
      v <= selectionRect.bottom &&
      selectionRect.left === 0 &&
      selectionRect.right === columns.length - 1
    );
  };

  const selection = React.useMemo<SpreadsheetSelection | null>(() => {
    if (!active || !selectionRect || !columns[active.c]) return null;
    return {
      active: { rowIndex: active.r, columnKey: columns[active.c].key },
      rowIndexes: visible.slice(selectionRect.top, selectionRect.bottom + 1),
      columnKeys: columns
        .slice(selectionRect.left, selectionRect.right + 1)
        .map((c) => c.key),
    };
  }, [active, selectionRect, visible, columns]);

  const lastSelectionKey = React.useRef('');
  React.useEffect(() => {
    const key = selection ? JSON.stringify(selection) : '';
    if (key === lastSelectionKey.current) return;
    lastSelectionKey.current = key;
    onSelectionChange?.(selection);
  }, [selection]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- Undo / Redo -----

     内部からの変更はすべて applyChange を通るため、変更前の rows を
     スナップショットとして積むだけで履歴になる（immutable 更新なので
     参照コピーのみ、〜300行規模ではコストは無視できる）。
     rows は完全制御型のため、アプリ側が外から rows を差し替えた場合
     （保存後のサーバー再取得など）は履歴とズレる。その場合は検知して
     履歴をリセットし、安全側に倒す */

  const HISTORY_LIMIT = 100;
  const historyRef = React.useRef<{ past: Row[][]; future: Row[][] }>({
    past: [],
    future: [],
  });
  const lastInternalRowsRef = React.useRef<Row[]>(rows);
  const prevRowsRef = React.useRef<Row[]>(rows);

  React.useLayoutEffect(() => {
    const prev = prevRowsRef.current;
    prevRowsRef.current = rows;
    if (rows === lastInternalRowsRef.current) return;
    lastInternalRowsRef.current = rows;
    if (history) {
      historyRef.current = { past: [], future: [] };
      // 外部からのデータ差し替えは「保存済みの新しい状態」とみなす
      rebuildBaseline(rows);
      bumpDirtyVersion();
    }
    // 外から行が増減・並べ替えされたら、選んでいた行を ID で追いかける
    if (prev !== rows) {
      const index = new Map(ids.map((id, i) => [id, i]));
      const remap = (pos: CellPos | null): CellPos | null => {
        if (!pos) return pos;
        const prevRow = prev[pos.r];
        const ni = prevRow ? index.get(idOf(prevRow)) : undefined;
        if (ni === undefined) {
          return rows.length === 0
            ? null
            : { r: Math.min(pos.r, rows.length - 1), c: pos.c };
        }
        return ni === pos.r ? pos : { r: ni, c: pos.c };
      };
      setActive((a) => remap(a));
      setAnchor((a) => remap(a));
      const ed = editingRef.current;
      if (ed) {
        const prevRow = prev[ed.r];
        const ni = prevRow ? index.get(idOf(prevRow)) : undefined;
        if (ni === undefined) setEditing(null);
        else if (ni !== ed.r) setEditing({ ...ed, r: ni });
      }
    }
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  // 選んでいる行が畳まれて見えなくなったら、見えている親へ移す
  React.useEffect(() => {
    if (!active) return;
    if (active.r < rows.length && vOf(active.r) >= 0) return;
    let r = Math.min(active.r, rows.length - 1);
    while (tree && r >= 0 && vOf(r) < 0) r = tree.parent[r];
    if (r < 0) {
      setActive(null);
      setAnchor(null);
      return;
    }
    setActive({ r, c: active.c });
    setAnchor({ r, c: active.c });
  }, [active, vpos, rows.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyChange = (next: Row[]) => {
    if (history) {
      historyRef.current.past.push(rows);
      if (historyRef.current.past.length > HISTORY_LIMIT) {
        historyRef.current.past.shift();
      }
      historyRef.current.future = [];
    }
    lastInternalRowsRef.current = next;
    onRowsChange(next);
  };

  const restoreRows = (next: Row[]) => {
    lastInternalRowsRef.current = next;
    onRowsChange(next);
    // 行数が減っていた場合に備えて選択位置をクランプする
    if (next.length === 0) {
      setActive(null);
      setAnchor(null);
    } else {
      if (active) setActive({ r: Math.min(active.r, next.length - 1), c: active.c });
      if (anchor) setAnchor({ r: Math.min(anchor.r, next.length - 1), c: anchor.c });
    }
  };

  const undo = () => {
    const prev = historyRef.current.past.pop();
    if (!prev) return;
    historyRef.current.future.push(rows);
    restoreRows(prev);
  };

  const redo = () => {
    const next = historyRef.current.future.pop();
    if (!next) return;
    historyRef.current.past.push(rows);
    restoreRows(next);
  };

  /* ----- データ更新 ----- */

  const canEdit = (r: number, c: number, row: Row | undefined = rows[r]): boolean => {
    const column = columns[c];
    if (!column || !row || column.type === 'readonly') return false;
    return isCellEditable ? isCellEditable(row, column, r) : true;
  };

  /** セルに値を書く（setValue を通す）。何も変わらなければ false */
  const writeCells = (
    updates: { r: number; c: number; value: SpreadsheetCellValue }[],
    appendedRows: Row[] = [],
  ): boolean => {
    const next = [...rows, ...appendedRows];
    let changed = appendedRows.length > 0;
    for (const { r, c, value } of updates) {
      const base = next[r];
      const column = columns[c];
      if (!base || !column) continue;
      if (
        Object.is(
          normalizeForCompare(cellOf(base, column.key)),
          normalizeForCompare(value),
        )
      ) {
        continue;
      }
      const newRow = column.setValue
        ? column.setValue(base, value)
        : ({ ...base, [column.key]: value } as Row);
      if (newRow === base) continue;
      transferRowIdentity(base, newRow);
      next[r] = newRow;
      changed = true;
    }
    if (changed) applyChange(next);
    return changed;
  };

  /* ----- 候補（autocomplete） ----- */

  const itemsCache = React.useRef<{
    key: string;
    rows: Row[];
    columns: SpreadsheetColumn<Row>[];
    items: OptionItem[] | null;
  } | null>(null);

  const itemsOf = (ed: EditingState | null): OptionItem[] | null => {
    if (!ed) return null;
    const column = columns[ed.c];
    const row = rows[ed.r];
    if (!column || column.type !== 'autocomplete' || !row) return null;
    const key = `${ed.r}:${ed.c}:${ed.draft}`;
    const cache = itemsCache.current;
    if (cache && cache.key === key && cache.rows === rows && cache.columns === columns) {
      return cache.items;
    }
    const options = column.getOptions
      ? column.getOptions(ed.draft, row)
      : filterOptions(column.options ?? [], ed.draft);
    const items: OptionItem[] = options.map((option) => ({ kind: 'option', option }));
    const text = ed.draft.trim();
    if (
      column.freeTextOption &&
      column.allowFreeText !== false &&
      text &&
      !options.some((o) => normalizeText(o.label) === normalizeText(text))
    ) {
      items.push({ kind: 'free', text });
    }
    itemsCache.current = { key, rows, columns, items };
    return items;
  };

  /** 候補の選択位置。開いただけでは選ばない。決まった候補は先頭、
      getOptions の候補は「2 文字以上の前方一致」か「完全一致」のときだけ先頭を選ぶ */
  const withHighlight = (ed: EditingState): EditingState => {
    const items = itemsOf(ed);
    let highlight = -1;
    if (items && items.length && !(ed.mode === 'edit' && ed.draft === ed.original)) {
      const column = columns[ed.c];
      if (!column.getOptions) {
        highlight = items[0].kind === 'option' ? 0 : -1;
      } else {
        const q = normalizeText(ed.draft);
        const first = items[0];
        const label = first.kind === 'option' ? normalizeText(first.option.label) : '';
        const strong = !!q && (label === q || (q.length >= 2 && label.startsWith(q)));
        highlight = strong ? 0 : items.findIndex((it) => it.kind === 'free');
      }
    }
    return highlight === ed.highlight ? ed : { ...ed, highlight };
  };

  /* ----- 編集 ----- */

  const startEdit = (r: number, c: number, initialDraft?: string) => {
    const column = columns[c];
    const row = rows[r];
    if (!column || !row || !EDITABLE_TYPES.includes(column.type)) return;
    if (!canEdit(r, c)) {
      onEditBlocked?.({ row, rowIndex: r, column });
      return;
    }
    const value = cellOf(row, column.key);
    const original = value === null || value === undefined ? '' : String(value);
    setEditing(
      withHighlight({
        r,
        c,
        draft: initialDraft !== undefined ? initialDraft : original,
        mode: initialDraft !== undefined ? 'enter' : 'edit',
        original,
        highlight: -1,
      }),
    );
  };

  /* ----- ナビゲーション ----- */

  const moveActive = (v: number, c: number, extend = false) => {
    if (visible.length === 0) return;
    const pos = {
      r: visible[Math.max(0, Math.min(visible.length - 1, v))],
      c: Math.max(0, Math.min(columns.length - 1, c)),
    };
    pendingFocusRef.current = true;
    setActive(pos);
    if (!extend) setAnchor(pos);
  };

  const moveFrom = (
    r: number,
    c: number,
    dir: 'down' | 'up' | 'right' | 'left' | 'none',
  ) => {
    const v = vOf(r);
    if (dir === 'down') moveActive(v + 1, c);
    else if (dir === 'up') moveActive(v - 1, c);
    else if (dir === 'right') moveActive(v, Math.min(c + 1, columns.length - 1));
    else if (dir === 'left') moveActive(v, Math.max(c - 1, 0));
  };

  const commitEdit = (
    move: 'down' | 'up' | 'right' | 'left' | 'none',
    draftOverride?: string,
  ) => {
    const ed = editingRef.current;
    if (!ed || committingRef.current) return;
    const column = columns[ed.c];
    const draft = draftOverride ?? ed.draft;
    const { ok, value } = parseDraft(column.type, draft);
    // 数値として不正な入力: Enter/Tab では確定せず編集を継続させ、
    // その場で修正を促す（エラーはライブ表示済み）。blur 時のみ破棄して閉じる
    if (!ok && move !== 'none') return;
    committingRef.current = true;
    setEditing(null);
    if (ok) writeCells([{ r: ed.r, c: ed.c, value }]);
    // 最下行の Enter でも行は自動追加しない。既存行を修正して確定する
    // たびに空行が増えてしまうため（行追加はボタン / 右クリック /
    // ペースト時の自動拡張で行う）。move は clamp されるので最下行では留まる
    moveFrom(ed.r, ed.c, move);
    committingRef.current = false;
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const pickItem = (index: number, move: 'down' | 'up' | 'right' | 'left') => {
    const ed = editingRef.current;
    if (!ed) return;
    const item = itemsOf(ed)?.[index];
    if (!item) return;
    if (item.kind === 'free') {
      commitEdit(move, item.text);
      return;
    }
    const column = columns[ed.c];
    const row = rows[ed.r];
    setEditing(null);
    if (!row) return;
    const newRow = column.onSelectOption
      ? column.onSelectOption(row, item.option)
      : column.setValue
        ? column.setValue(row, item.option.value)
        : ({ ...row, [column.key]: item.option.value } as Row);
    if (newRow !== row) {
      const next = [...rows];
      transferRowIdentity(row, newRow);
      next[ed.r] = newRow;
      applyChange(next);
    }
    const to = column.focusAfterSelect?.(newRow, item.option);
    const toC = to ? columns.findIndex((col) => col.key === to) : -1;
    if (toC >= 0) {
      pendingFocusRef.current = true;
      setActive({ r: ed.r, c: toC });
      setAnchor({ r: ed.r, c: toC });
    } else {
      moveFrom(ed.r, ed.c, move);
    }
  };

  /* ----- コピー & ペースト & クリア ----- */

  const selectionText = () => {
    if (!selectionRect) return '';
    const table: string[][] = [];
    for (let v = selectionRect.top; v <= selectionRect.bottom; v++) {
      const row = rows[visible[v]];
      const cells: string[] = [];
      for (let c = selectionRect.left; c <= selectionRect.right; c++) {
        cells.push(formatCellForCopy(columns[c], row));
      }
      table.push(cells);
    }
    // 改行やタブを含むセルは "…" で囲む（Excel に貼っても 1 つのセルになる）
    return formatClipboardTable(table);
  };

  const copySelection = () => {
    if (!selectionRect) return;
    void navigator.clipboard?.writeText(selectionText()).catch(() => {});
  };

  /** 範囲の入力できるセルすべてに同じ値を入れる（読めない値のセルは変えない） */
  const fillSelection = (text: string) => {
    if (!selectionRect) return;
    const updates: { r: number; c: number; value: SpreadsheetCellValue }[] = [];
    for (let v = selectionRect.top; v <= selectionRect.bottom; v++) {
      const r = visible[v];
      for (let c = selectionRect.left; c <= selectionRect.right; c++) {
        if (!canEdit(r, c)) continue;
        const value = parsePastedValue(columns[c], text);
        if (value === KEEP) continue;
        updates.push({ r, c, value });
      }
    }
    writeCells(updates);
  };

  const clearSelection = () => {
    if (!selectionRect) return;
    const updates: { r: number; c: number; value: SpreadsheetCellValue }[] = [];
    for (let v = selectionRect.top; v <= selectionRect.bottom; v++) {
      const r = visible[v];
      for (let c = selectionRect.left; c <= selectionRect.right; c++) {
        const column = columns[c];
        if (!canEdit(r, c)) continue;
        updates.push({
          r,
          c,
          value:
            column.type === 'checkbox'
              ? false
              : column.type === 'text' || column.type === 'autocomplete'
                ? ''
                : null,
        });
      }
    }
    writeCells(updates);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (editingRef.current || !active) return;
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;
    e.preventDefault();
    // Excel の改行（CRLF・CR）と、改行やタブを含むセル（"…" で囲まれる）も読む
    const matrix = parseClipboardTable(text);

    if (onPasteProp && selection) {
      const result = onPasteProp({ text, matrix, selection });
      if (result) {
        applyChange(result);
        return;
      }
    }

    // 1 つの値を範囲に貼ると、範囲すべてに入る（Excel と同じ）
    if (matrix.length === 1 && matrix[0].length === 1 && isMultiCell) {
      fillSelection(matrix[0][0]);
      return;
    }

    const startV = selectionRect ? selectionRect.top : vOf(active.r);
    const startC = selectionRect ? selectionRect.left : active.c;
    const updates: { r: number; c: number; value: SpreadsheetCellValue }[] = [];
    const appended: Row[] = [];
    const rowAt = (v: number): number => {
      if (v < visible.length) return visible[v];
      const r = rows.length + appended.length;
      appended.push(createRow(tree ? { depth: 0 } : undefined));
      return r;
    };
    let lastR = active.r;
    matrix.forEach((cells, dr) => {
      const r = rowAt(startV + dr);
      lastR = r;
      const row = r < rows.length ? rows[r] : appended[r - rows.length];
      cells.forEach((cellText, dc) => {
        const c = startC + dc;
        if (c >= columns.length) return;
        if (!canEdit(r, c, row)) return;
        const value = parsePastedValue(columns[c], cellText);
        if (value === KEEP) return;
        updates.push({ r, c, value });
      });
    });
    writeCells(updates, appended);
    // ペースト範囲を選択状態にする
    const width = Math.max(...matrix.map((m) => m.length));
    setAnchor({ r: visible[startV] ?? active.r, c: startC });
    setActive({ r: lastR, c: Math.min(columns.length - 1, startC + width - 1) });
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    if (editingRef.current || !selectionRect) return;
    e.preventDefault();
    e.clipboardData.setData('text/plain', selectionText());
  };

  /* ----- 行選択 -----

     行番号セルのクリックで行全体を選択する。Shift+クリック / ドラッグで
     複数行に拡張。anchor を (開始行, 最終列)・active を (対象行, 先頭列) に
     置くことで、選択矩形が常に全列をカバーする */

  const rowDraggingRef = React.useRef(false);

  /* ----- 行の Drag & Drop -----

     選択済みの行番号セルをドラッグすると行ブロックを移動する
     （未選択の行番号のドラッグは行選択の拡張）。Sheets と同じ使い分け。
     over は「この行の直前に挿入する」挿入位置（0〜rows.length）。
     階層つきでは配下ごと動かし、同じ親の兄弟の間にしか落とせない */

  const [rowDrag, setRowDrag] = React.useState<{
    start: number;
    end: number;
    pressed: number;
    over: number | null;
    edge: { r: number; side: 'top' | 'bottom' } | null;
  } | null>(null);

  const selectRow = (r: number, extend: boolean) => {
    pendingFocusRef.current = true;
    if (extend && anchor) {
      setAnchor({ r: anchor.r, c: columns.length - 1 });
    } else {
      setAnchor({ r, c: columns.length - 1 });
    }
    setActive({ r, c: 0 });
  };

  const completeRowDrag = () => {
    if (!rowDrag) return;
    const { start, end, over, pressed } = rowDrag;
    setRowDrag(null);
    if (over === null) {
      // 動かさずに離した → その行だけの選択に戻す（Sheets と同じ）
      selectRow(pressed, false);
      return;
    }
    const len = end - start + 1;
    const next = moveBlock(rows, start, end + 1, over);
    applyChange(next);
    const insertAt = over > end ? over - len : over;
    if (tree) {
      selectRow(insertAt, false);
    } else {
      setAnchor({ r: insertAt, c: columns.length - 1 });
      setActive({ r: insertAt + len - 1, c: 0 });
    }
  };

  /** 階層つきの落とし先。動かす行と同じ親の兄弟の前か、兄弟の配下の後ろ */
  const treeDropTarget = (
    from: number,
    hover: number,
    clientY: number,
    rect: DOMRect,
  ): { at: number; edge: { r: number; side: 'top' | 'bottom' } } | null => {
    if (!tree) return null;
    const d = tree.depth[from];
    let s = hover;
    while (s >= 0 && tree.depth[s] > d) s = tree.parent[s];
    if (
      s < 0 ||
      s === from ||
      tree.depth[s] !== d ||
      tree.parent[s] !== tree.parent[from]
    ) {
      return null;
    }
    const before = hover === s && clientY < rect.top + rect.height / 2;
    const at = before ? s : tree.end[s];
    if (at === from || at === tree.end[from]) return null;
    let edgeRow = s;
    if (!before) {
      for (let k = tree.end[s] - 1; k >= s; k--) {
        if (vOf(k) >= 0) {
          edgeRow = k;
          break;
        }
      }
    }
    return { at, edge: { r: edgeRow, side: before ? 'top' : 'bottom' } };
  };

  /* ----- 行操作 -----

     コンテキストメニューは、右クリックした行が選択範囲の行スパンに
     含まれていれば選択中の複数行を、そうでなければその行だけを対象にする。
     挿入系は rows がまだ古い配列のため clamp（moveActive）を通さず直接移動する */

  const targetRowsOf = (r: number): number[] => {
    const v = vOf(r);
    if (selectionRect && v >= selectionRect.top && v <= selectionRect.bottom) {
      return visible.slice(selectionRect.top, selectionRect.bottom + 1);
    }
    return [r];
  };

  const copyRow = (row: Row): Row =>
    duplicateRow ? duplicateRow(row) : ({ ...row } as Row);

  const insertRows = (index: number, count = 1, depth = 0) => {
    const newRows = Array.from({ length: count }, () =>
      createRow(tree ? { depth } : undefined),
    );
    const next = [...rows];
    next.splice(index, 0, ...newRows);
    applyChange(next);
    const pos = { r: index, c: active?.c ?? 0 };
    pendingFocusRef.current = true;
    setActive(pos);
    setAnchor(pos);
  };

  const duplicateRows = (start: number, end: number) => {
    const copies = rows.slice(start, end + 1).map(copyRow);
    const next = [...rows];
    next.splice(end + 1, 0, ...copies);
    applyChange(next);
    setAnchor({ r: end + 1, c: columns.length - 1 });
    setActive({ r: end + copies.length, c: 0 });
  };

  const deleteRowSet = (drop: Set<number>) => {
    const next = rows.filter((_, i) => !drop.has(i));
    const first = Math.min(...drop);
    applyChange(next);
    if (next.length === 0) {
      setActive(null);
      setAnchor(null);
    } else {
      const pos = { r: Math.min(first, next.length - 1), c: active?.c ?? 0 };
      setActive(pos);
      setAnchor(pos);
    }
  };

  const moveRows = (start: number, end: number, dir: -1 | 1) => {
    if (start + dir < 0 || end + dir >= rows.length) return;
    const next = [...rows];
    const block = next.splice(start, end - start + 1);
    next.splice(start + dir, 0, ...block);
    applyChange(next);
    setAnchor({ r: start + dir, c: columns.length - 1 });
    setActive({ r: end + dir, c: 0 });
  };

  /** 階層つき: 前／次の兄弟と配下ごと入れ替える */
  const moveTreeRow = (r: number, dir: -1 | 1) => {
    if (!tree) return;
    const p = tree.parent[r];
    const d = tree.depth[r];
    if (dir === -1) {
      let s = r - 1;
      while (s >= 0 && tree.depth[s] > d) s = tree.parent[s];
      if (s < 0 || tree.parent[s] !== p || tree.depth[s] !== d) return;
      applyChange(moveBlock(rows, r, tree.end[r], s));
      selectRow(s, false);
    } else {
      const ns = tree.end[r];
      if (ns >= rows.length || tree.parent[ns] !== p || tree.depth[ns] !== d) return;
      const at = tree.end[ns];
      applyChange(moveBlock(rows, r, tree.end[r], at));
      selectRow(r + (tree.end[ns] - ns), false);
    }
  };

  const canMoveTreeRow = (r: number, dir: -1 | 1): boolean => {
    if (!tree) return false;
    const p = tree.parent[r];
    const d = tree.depth[r];
    if (dir === -1) {
      let s = r - 1;
      while (s >= 0 && tree.depth[s] > d) s = tree.parent[s];
      return s >= 0 && tree.parent[s] === p && tree.depth[s] === d;
    }
    const ns = tree.end[r];
    return ns < rows.length && tree.parent[ns] === p && tree.depth[ns] === d;
  };

  /* ----- キーボード ----- */

  const toggleCheckbox = (r: number, c: number) => {
    const column = columns[c];
    if (!canEdit(r, c)) {
      onEditBlocked?.({ row: rows[r], rowIndex: r, column });
      return;
    }
    writeCells([{ r, c, value: cellOf(rows[r], column.key) !== true }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 日本語の変換中は触らない
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (editingRef.current) return;
    onKeyDownProp?.(e, { selection, editing: false });
    if (e.defaultPrevented || !active) return;
    const { r, c } = active;
    const v = vOf(r);
    const column = columns[c];
    if (!column) return;
    const mod = e.ctrlKey || e.metaKey;

    const nav = (nv: number, nc: number) => {
      e.preventDefault();
      moveActive(nv, nc, e.shiftKey);
    };

    switch (e.key) {
      case 'ArrowUp':
        nav(v - 1, c);
        return;
      case 'ArrowDown':
        nav(v + 1, c);
        return;
      case 'ArrowLeft':
        nav(v, c - 1);
        return;
      case 'ArrowRight':
        nav(v, c + 1);
        return;
      case 'Home':
        nav(v, 0);
        return;
      case 'End':
        nav(v, columns.length - 1);
        return;
      case 'Tab': {
        // 端のセルでは preventDefault せず、グリッドの外へフォーカスを逃がす
        // （フォーカストラップにしない）
        if (e.shiftKey) {
          if (c > 0) {
            e.preventDefault();
            moveActive(v, c - 1);
          } else if (v > 0) {
            e.preventDefault();
            moveActive(v - 1, columns.length - 1);
          }
        } else {
          if (c < columns.length - 1) {
            e.preventDefault();
            moveActive(v, c + 1);
          } else if (v < visible.length - 1) {
            e.preventDefault();
            moveActive(v + 1, 0);
          }
        }
        return;
      }
      case 'Enter':
        if (mod) return;
        e.preventDefault();
        if (column.type === 'checkbox') {
          toggleCheckbox(r, c);
        } else if (EDITABLE_TYPES.includes(column.type) && canEdit(r, c)) {
          startEdit(r, c);
        } else {
          moveActive(v + (e.shiftKey ? -1 : 1), c);
        }
        return;
      case 'F2':
        e.preventDefault();
        startEdit(r, c);
        return;
      case ' ':
        // Shift+Space: 選択範囲の行スパンを行選択に広げる（Sheets と同じ）
        if (e.shiftKey && selectionRect) {
          e.preventDefault();
          setAnchor({ r: visible[selectionRect.top], c: columns.length - 1 });
          setActive({ r: visible[selectionRect.bottom], c: 0 });
          return;
        }
        if (column.type === 'checkbox') {
          e.preventDefault();
          toggleCheckbox(r, c);
        }
        return;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        clearSelection();
        return;
      case 'Escape':
        setAnchor(active);
        return;
    }

    if (mod && (e.key === 'c' || e.key === 'C')) {
      copySelection();
      return;
    }
    if (mod && (e.key === 'x' || e.key === 'X')) {
      e.preventDefault();
      copySelection();
      clearSelection();
      return;
    }
    if (mod && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      setAnchor({ r: visible[0], c: 0 });
      setActive({ r: visible[visible.length - 1], c: columns.length - 1 });
      return;
    }
    // Undo / Redo（Cmd/Ctrl+Z、Shift で Redo。Ctrl+Y も Redo）
    if (history && mod && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (history && mod && (e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      redo();
      return;
    }
    // 印字可能文字で編集開始（Excel/Sheets と同じ）
    if (!mod && !e.altKey && e.key.length === 1) {
      if (TEXT_INPUT_TYPES.includes(column.type)) {
        if (!canEdit(r, c)) {
          e.preventDefault();
          onEditBlocked?.({ row: rows[r], rowIndex: r, column });
          return;
        }
        // 入力欄にフォーカスがあれば、入力欄が文字を受け取って編集に入る（onChange）。
        // ないとき（フォーカスがセルに残っているとき）だけ、ここで編集に入る
        if (e.target !== activeInputRef.current) {
          e.preventDefault();
          startEdit(r, c, e.key);
        }
      } else if (column.type === 'select' || column.type === 'date') {
        e.preventDefault();
        startEdit(r, c);
      }
    }
  };

  /** 編集中の入力欄のキー操作 */
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ed = editingRef.current;
    if (!ed) return; // 編集中でなければ表のキー操作へ
    // IME（日本語入力など）の変換確定の Enter / Tab はセル確定として
    // 扱わない。isComposing はブラウザにより確定の瞬間 false になる
    // ことがあるため、レガシーな keyCode 229 も併せて見る
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      e.stopPropagation();
      return;
    }
    const items = itemsOf(ed);
    const popup = !!items && items.length > 0;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key === 'Enter' && isMultiCell) {
      // 範囲の入力できるセルすべてに同じ値を入れる
      e.preventDefault();
      e.stopPropagation();
      const draft = ed.draft;
      setEditing(null);
      fillSelection(draft);
      return;
    }
    switch (e.key) {
      case 'Enter':
      case 'Tab': {
        e.preventDefault();
        const move =
          e.key === 'Enter'
            ? e.shiftKey
              ? 'up'
              : 'down'
            : e.shiftKey
              ? 'left'
              : 'right';
        if (popup && ed.highlight >= 0 && items![ed.highlight])
          pickItem(ed.highlight, move);
        else commitEdit(move);
        break;
      }
      case 'Escape':
        e.preventDefault();
        cancelEdit();
        break;
      case 'ArrowDown':
      case 'ArrowUp': {
        const d = e.key === 'ArrowDown' ? 1 : -1;
        if (popup) {
          e.preventDefault();
          setEditing({
            ...ed,
            highlight: Math.max(-1, Math.min(items!.length - 1, ed.highlight + d)),
          });
        } else if (ed.mode === 'enter') {
          // 打ち始めで入った編集中は ↑↓ で確定して移動（Excel と同じ）
          e.preventDefault();
          commitEdit(d > 0 ? 'down' : 'up');
        }
        break;
      }
    }
    e.stopPropagation();
  };

  /* ----- フォーカスとスクロール ----- */

  const [stickyLefts, setStickyLefts] = React.useState<(number | undefined)[]>(() =>
    columns.map(() => undefined),
  );

  // 固定する列の左位置。見出しセルの幅を左から足していく（位置そのものを測ると、
  // 横スクロールで固定された分のずれまで拾ってしまうため幅で数える）。
  // 描画のたびと、見出しセルの大きさが変わったとき（画面幅の変化など）に測り直す
  const measureSticky = () => {
    const next: (number | undefined)[] = columns.map(() => undefined);
    if (stickyColumns > 0) {
      let x = headerCellRefs.current[0]?.getBoundingClientRect().width ?? rowHeaderWidth;
      for (let c = 0; c < Math.min(stickyColumns, columns.length); c++) {
        next[c] = x;
        x +=
          headerCellRefs.current[c + 1]?.getBoundingClientRect().width ??
          columns[c].width ??
          160;
      }
    }
    setStickyLefts((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next,
    );
  };
  const measureStickyRef = React.useRef(measureSticky);
  measureStickyRef.current = measureSticky;

  React.useLayoutEffect(() => {
    measureSticky();
  });

  React.useEffect(() => {
    if (stickyColumns <= 0 || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measureStickyRef.current());
    headerCellRefs.current
      .slice(0, stickyColumns + 1)
      .forEach((th) => th && observer.observe(th));
    return () => observer.disconnect();
  }, [stickyColumns, columns]);

  const ensureVisible = (td: HTMLElement, c: number) => {
    const box = containerRef.current;
    if (!box) return;
    if (box.scrollHeight <= box.clientHeight && box.scrollWidth <= box.clientWidth) {
      td.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      return;
    }
    const b = box.getBoundingClientRect();
    const rect = td.getBoundingClientRect();
    const headH = theadRef.current?.getBoundingClientRect().height ?? 0;
    const footH = tfootRef.current?.getBoundingClientRect().height ?? 0;
    const top = b.top + headH;
    const bottom = b.top + box.clientHeight - footH;
    if (rect.top < top) box.scrollTop -= top - rect.top;
    else if (rect.bottom > bottom) box.scrollTop += rect.bottom - bottom;
    if (stickyLefts[c] === undefined) {
      let stickyRight = 0;
      for (let k = 0; k < stickyLefts.length; k++) {
        const left = stickyLefts[k];
        const th = headerCellRefs.current[k + 1];
        if (left !== undefined && th)
          stickyRight = Math.max(stickyRight, left + th.offsetWidth);
      }
      if (stickyColumns > 0 && stickyRight === 0) {
        stickyRight = headerCellRefs.current[0]?.offsetWidth ?? 0;
      }
      const leftEdge = b.left + stickyRight;
      if (rect.left < leftEdge) box.scrollLeft -= leftEdge - rect.left;
      else if (rect.right > b.left + box.clientWidth) {
        box.scrollLeft += rect.right - (b.left + box.clientWidth);
      }
    }
  };

  const focusActive = () => {
    if (!active) return;
    const target =
      activeInputRef.current ?? cellRefs.current.get(`${active.r}:${active.c}`);
    if (target && document.activeElement !== target)
      target.focus({ preventScroll: true });
  };

  React.useLayoutEffect(() => {
    if (!active) return;
    const td = cellRefs.current.get(`${active.r}:${active.c}`);
    if (!td) return;
    ensureVisible(td, active.c);
    const ed = editingRef.current;
    const column = columns[active.c];
    // select / date は自前のエディタがフォーカスを持つ
    if (ed && (column?.type === 'select' || column?.type === 'date')) return;
    const inside =
      (containerRef.current?.contains(document.activeElement) ?? false) ||
      (focusInsideRef.current &&
        (document.activeElement === document.body || document.activeElement === null));
    if (pendingFocusRef.current || inside) {
      pendingFocusRef.current = false;
      focusActive();
    }
  }, [active, editing === null]); // eslint-disable-line react-hooks/exhaustive-deps

  // 編集に入ったら、カーソルを末尾へ（Excel・Google スプレッドシートと同じ）。
  // 打ち始め（日本語の変換中を含む）は入力欄が自分で位置を持つので触らない
  React.useEffect(() => {
    const input = activeInputRef.current;
    if (!editing || editing.mode !== 'edit' || !input) return;
    input.focus();
    const n = input.value.length;
    input.setSelectionRange(n, n);
  }, [editing?.r, editing?.c, editing?.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useImperativeHandle(ref, () => ({
    clearDirty: () => {
      rebuildBaseline(rows);
      bumpDirtyVersion();
    },
    select: (cell, extendTo) => {
      const c = columns.findIndex((col) => col.key === cell.columnKey);
      if (c < 0 || cell.rowIndex < 0 || cell.rowIndex >= rows.length) return;
      // 畳まれた配下なら、上位を開く
      if (tree) {
        const open = new Set(collapsed);
        let changed = false;
        for (const target of [cell.rowIndex, extendTo?.rowIndex]) {
          if (target === undefined) continue;
          for (let p = tree.parent[target]; p >= 0; p = tree.parent[p]) {
            if (open.delete(ids[p])) changed = true;
          }
        }
        if (changed) setCollapsed(open);
      }
      if (editingRef.current) commitEdit('none');
      pendingFocusRef.current = true;
      setActive({ r: cell.rowIndex, c });
      const ec = extendTo
        ? columns.findIndex((col) => col.key === extendTo.columnKey)
        : -1;
      setAnchor(
        extendTo && ec >= 0 && extendTo.rowIndex >= 0 && extendTo.rowIndex < rows.length
          ? { r: extendTo.rowIndex, c: ec }
          : { r: cell.rowIndex, c },
      );
    },
    focus: () => {
      pendingFocusRef.current = true;
      if (!active && visible.length) {
        setActive({ r: visible[0], c: 0 });
        setAnchor({ r: visible[0], c: 0 });
        return;
      }
      focusActive();
    },
  }));

  /* ----- 行に渡す操作（参照は変えず、最新の状態を読む） ----- */

  const latest = React.useRef({
    isCellDirty,
    handleCellMouseDown: (_r: number, _c: number, _e: React.MouseEvent) => {},
    handleCellMouseEnter: (_r: number, _c: number) => {},
    handleCellDoubleClick: (_r: number, _c: number) => {},
    handleCellContextMenu: (_r: number, _c: number) => {},
    handleHeaderMouseDown: (_r: number, _e: React.MouseEvent) => {},
    handleHeaderMouseEnter: (_r: number) => {},
    handleRowMouseEnter: (_r: number) => {},
    handleRowMouseMove: (_r: number, _e: React.MouseEvent<HTMLTableRowElement>) => {},
    toggleCollapse: (_r: number) => {},
    handleInputChange: (_value: string) => {},
    handleCompositionStart: () => {},
    handleInputBlur: () => {},
    handleInputKeyDown,
    commitPicker: (_value: SpreadsheetCellValue) => {},
    cancelEdit,
    handleCheckbox: (_r: number, _c: number, _checked: boolean) => {},
    optionHover: (_i: number) => {},
    optionPick: (_i: number) => {},
  });

  latest.current = {
    isCellDirty,
    handleCellMouseDown: (r, c, e) => {
      if (e.button !== 0) return;
      const ed = editingRef.current;
      // select / date エディタは Portal を使うため blur で閉じない。
      // 別セルのクリックでここから取り消す
      // （input エディタは mousedown 後の blur が確定を担う）
      if (
        ed &&
        (ed.r !== r || ed.c !== c) &&
        (columns[ed.c].type === 'select' || columns[ed.c].type === 'date')
      ) {
        setEditing(null);
      }
      // 入力欄の外（セルの余白など）を押しても、入力欄からフォーカスを外さない
      const target = e.target as HTMLElement;
      const willHostInput = canEdit(r, c) && TEXT_INPUT_TYPES.includes(columns[c].type);
      if (willHostInput && target.tagName !== 'INPUT') {
        e.preventDefault();
        if (ed && (ed.r !== r || ed.c !== c)) commitEdit('none');
        requestAnimationFrame(() => {
          pendingFocusRef.current = true;
          activeInputRef.current?.focus({ preventScroll: true });
        });
      }
      draggingRef.current = true;
      pendingFocusRef.current = true;
      if (e.shiftKey && active) {
        setActive({ r, c });
      } else {
        const pos = { r, c };
        setActive(pos);
        setAnchor(pos);
      }
    },
    handleCellMouseEnter: (r, c) => {
      if (draggingRef.current) setActive({ r, c });
    },
    handleCellDoubleClick: (r, c) => {
      const column = columns[c];
      if (column.type === 'checkbox' || column.type === 'readonly') return;
      startEdit(r, c);
    },
    handleCellContextMenu: (r, c) => {
      // 範囲の外を右クリックしたら、そのセルを選び直す（Excel と同じ）。
      // 範囲の中なら範囲はそのまま（まとめて操作する）
      const v = vOf(r);
      const inside =
        !!selectionRect &&
        v >= selectionRect.top &&
        v <= selectionRect.bottom &&
        c >= selectionRect.left &&
        c <= selectionRect.right;
      const insideRows =
        !!selectionRect && v >= selectionRect.top && v <= selectionRect.bottom;
      if (!inside && !insideRows) {
        if (editingRef.current) commitEdit('none');
        pendingFocusRef.current = true;
        setActive({ r, c });
        setAnchor({ r, c });
      }
      setMenuTarget({
        kind: 'cells',
        rowIndex: r,
        rowIndexes: targetRowsOf(r),
        columnKey: columns[c]?.key ?? '',
      });
    },
    handleHeaderMouseDown: (r, e) => {
      if (e.button !== 0) return;
      if (editingRef.current) commitEdit('none');
      if (tree) {
        if (e.shiftKey) {
          rowDraggingRef.current = true;
          selectRow(r, true);
        } else {
          // 階層つきは、押した行を配下ごと掴む
          selectRow(r, false);
          setRowDrag({
            start: r,
            end: tree.end[r] - 1,
            pressed: r,
            over: null,
            edge: null,
          });
        }
        return;
      }
      if (isRowSelected(r) && selectionRect) {
        // 選択済みの行番号をドラッグ → 行ブロックの移動
        setRowDrag({
          start: visible[selectionRect.top],
          end: visible[selectionRect.bottom],
          pressed: r,
          over: null,
          edge: null,
        });
      } else if (e.shiftKey) {
        // Shift+押下は選択の拡張（そのままヘッダーを
        // ドラッグすると行選択が広がる）
        rowDraggingRef.current = true;
        selectRow(r, true);
      } else {
        // 未選択の行は、押した瞬間に選択しつつそのまま
        // ドラッグで移動できるようにする（1クリックで掴める）
        selectRow(r, false);
        setRowDrag({ start: r, end: r, pressed: r, over: null, edge: null });
      }
    },
    handleHeaderMouseEnter: (r) => {
      if (rowDraggingRef.current) setActive({ r, c: 0 });
    },
    handleRowMouseEnter: (r) => {
      if (!rowDrag || tree) return;
      setRowDrag((prev) => {
        if (!prev) return prev;
        const over = r < prev.start ? r : r > prev.end ? r + 1 : null;
        return { ...prev, over };
      });
    },
    handleRowMouseMove: (r, e) => {
      if (!rowDrag || !tree) return;
      const target = treeDropTarget(
        rowDrag.start,
        r,
        e.clientY,
        e.currentTarget.getBoundingClientRect(),
      );
      const over = target?.at ?? null;
      const edge = target?.edge ?? null;
      if (
        over !== rowDrag.over ||
        edge?.r !== rowDrag.edge?.r ||
        edge?.side !== rowDrag.edge?.side
      ) {
        setRowDrag({ ...rowDrag, over, edge });
      }
    },
    toggleCollapse: (r) => {
      const id = ids[r];
      const next = new Set(collapsed);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setCollapsed(next);
    },
    handleInputChange: (value) => {
      const ed = editingRef.current;
      if (ed) setEditing(withHighlight({ ...ed, draft: value }));
      else if (active) startEdit(active.r, active.c, value);
    },
    handleCompositionStart: () => {
      // 日本語入力の変換開始で編集に入る（入力欄はそのまま。値は空のまま変えない）
      if (!editingRef.current && active) startEdit(active.r, active.c, '');
    },
    handleInputBlur: () => {
      if (editingRef.current) commitEdit('none');
    },
    handleInputKeyDown,
    commitPicker: (value) => {
      const ed = editingRef.current;
      if (!ed) return;
      setEditing(null);
      writeCells([{ r: ed.r, c: ed.c, value }]);
    },
    cancelEdit,
    handleCheckbox: (r, c, checked) => {
      if (!canEdit(r, c)) return;
      writeCells([{ r, c, value: checked }]);
    },
    optionHover: (i) => {
      const ed = editingRef.current;
      if (ed && ed.highlight !== i) setEditing({ ...ed, highlight: i });
    },
    optionPick: (i) => pickItem(i, 'down'),
  };

  const api = React.useMemo<GridApi<Row>>(
    () => ({
      isDirty: (row, key) => latest.current.isCellDirty(row, key),
      setCellRef: (r, c, node) => {
        if (node) cellRefs.current.set(`${r}:${c}`, node);
        else if (cellRefs.current.get(`${r}:${c}`) === node)
          cellRefs.current.delete(`${r}:${c}`);
      },
      getCell: (r, c) => cellRefs.current.get(`${r}:${c}`),
      setInputRef: (node) => {
        activeInputRef.current = node;
      },
      cellMouseDown: (r, c, e) => latest.current.handleCellMouseDown(r, c, e),
      cellMouseEnter: (r, c) => latest.current.handleCellMouseEnter(r, c),
      cellDoubleClick: (r, c) => latest.current.handleCellDoubleClick(r, c),
      cellContextMenu: (r, c) => latest.current.handleCellContextMenu(r, c),
      headerMouseDown: (r, e) => latest.current.handleHeaderMouseDown(r, e),
      headerMouseEnter: (r) => latest.current.handleHeaderMouseEnter(r),
      rowMouseEnter: (r) => latest.current.handleRowMouseEnter(r),
      rowMouseMove: (r, e) => latest.current.handleRowMouseMove(r, e),
      toggleCollapse: (r) => latest.current.toggleCollapse(r),
      inputChange: (value) => latest.current.handleInputChange(value),
      inputCompositionStart: () => latest.current.handleCompositionStart(),
      inputBlur: () => latest.current.handleInputBlur(),
      inputKeyDown: (e) => latest.current.handleInputKeyDown(e),
      pickerCommit: (value) => latest.current.commitPicker(value),
      pickerCancel: () => latest.current.cancelEdit(),
      checkboxChange: (r, c, checked) => latest.current.handleCheckbox(r, c, checked),
      optionHover: (i) => latest.current.optionHover(i),
      optionPick: (i) => latest.current.optionPick(i),
    }),
    [],
  );

  /* ----- 描画 ----- */

  const editingView = React.useMemo<EditingView | null>(() => {
    if (!editing) return null;
    const column = columns[editing.c];
    const row = rows[editing.r];
    if (!column || !row) return null;
    let liveError: string | null = null;
    if (column.type !== 'select' && column.type !== 'date') {
      const { ok, value } = parseDraft(column.type, editing.draft);
      // 入力中のリアルタイム検証。パース不能な数値はパースエラーを優先
      liveError = !ok ? '数値で入力してください' : validateCell(column, value, row);
    }
    return {
      c: editing.c,
      draft: editing.draft,
      liveError,
      items: itemsOf(editing),
      highlight: editing.highlight,
      header: column.optionsHeader ? column.optionsHeader(row) : null,
    };
  }, [editing, rows, columns]); // eslint-disable-line react-hooks/exhaustive-deps

  const colCount = columns.length;
  const tableMinWidth =
    rowHeaderWidth + columns.reduce((sum, column) => sum + (column.width ?? 160), 0);
  const hasFooter = columns.some((column) => column.footer !== undefined);
  const headerSticky = stickyColumns > 0;

  const menuContent = (() => {
    if (!menuTarget) return null;
    const custom = contextMenu?.(menuTarget) ?? null;
    if (menuTarget.kind !== 'cells' || !rowActions) return custom;
    const targets = menuTarget.rowIndexes;
    const start = Math.min(...targets);
    const end = Math.max(...targets);
    const count = targets.length;
    const unit = count > 1 ? `${count}行` : '行';
    const builtins = tree ? (
      <>
        <ContextMenuItem onSelect={() => insertRows(start, count, tree.depth[start])}>
          <Plus className="mr-2 h-4 w-4" />
          上に{unit}を挿入
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => insertRows(tree.end[end], count, tree.depth[end])}
        >
          <Plus className="mr-2 h-4 w-4" />
          下に{unit}を挿入
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => duplicateRows(start, tree.end[end] - 1)}>
          <Copy className="mr-2 h-4 w-4" />
          {unit}を複製
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          disabled={count > 1 || !canMoveTreeRow(start, -1)}
          onSelect={() => moveTreeRow(start, -1)}
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          上へ移動
        </ContextMenuItem>
        <ContextMenuItem
          disabled={count > 1 || !canMoveTreeRow(start, 1)}
          onSelect={() => moveTreeRow(start, 1)}
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          下へ移動
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => {
            const drop = new Set<number>();
            for (const t of targets) for (let k = t; k < tree.end[t]; k++) drop.add(k);
            deleteRowSet(drop);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4 text-[var(--color-error-500)]" />
          {unit}を削除
        </ContextMenuItem>
      </>
    ) : (
      <>
        <ContextMenuItem onSelect={() => insertRows(start, count)}>
          <Plus className="mr-2 h-4 w-4" />
          上に{unit}を挿入
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => insertRows(end + 1, count)}>
          <Plus className="mr-2 h-4 w-4" />
          下に{unit}を挿入
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => duplicateRows(start, end)}>
          <Copy className="mr-2 h-4 w-4" />
          {unit}を複製
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled={start === 0} onSelect={() => moveRows(start, end, -1)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          上へ移動
        </ContextMenuItem>
        <ContextMenuItem
          disabled={end === rows.length - 1}
          onSelect={() => moveRows(start, end, 1)}
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          下へ移動
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() =>
            deleteRowSet(
              new Set(Array.from({ length: end - start + 1 }, (_, i) => start + i)),
            )
          }
        >
          <Trash2 className="mr-2 h-4 w-4 text-[var(--color-error-500)]" />
          {unit}を削除
        </ContextMenuItem>
      </>
    );
    return (
      <>
        {builtins}
        {custom && <ContextMenuSeparator />}
        {custom}
      </>
    );
  })();

  const closeMenu = (e: Event) => {
    // Radix の既定はトリガー(tbody)へのフォーカス復帰だが、tbody は
    // フォーカス不能なので body に落ちてキー操作が効かなくなる。
    // 閉じたらアクティブセルへ戻す
    e.preventDefault();
    pendingFocusRef.current = true;
    focusActive();
  };

  const tbody = (
    <tbody
      className={cn(rowDrag && 'cursor-grabbing')}
      onMouseUp={() => {
        draggingRef.current = false;
        rowDraggingRef.current = false;
        completeRowDrag();
      }}
      onMouseLeave={() => {
        draggingRef.current = false;
        rowDraggingRef.current = false;
        setRowDrag(null);
      }}
    >
      {visible.map((r) => {
        const row = rows[r];
        const v = vpos[r];
        const inSel =
          !!selectionRect && v >= selectionRect.top && v <= selectionRect.bottom;
        const dropEdge: 'top' | 'bottom' | null = !rowDrag
          ? null
          : tree
            ? rowDrag.edge?.r === r
              ? rowDrag.edge.side
              : null
            : rowDrag.over === r
              ? 'top'
              : rowDrag.over === rows.length && r === rows.length - 1
                ? 'bottom'
                : null;
        return (
          <RowView
            key={getRowId ? ids[r] : getRowKey(row)}
            row={row}
            r={r}
            columns={columns}
            activeC={active?.r === r ? active.c : -1}
            selLeft={inSel ? selectionRect!.left : -1}
            selRight={inSel ? selectionRect!.right : -1}
            rowSelected={isRowSelected(r)}
            editing={editing?.r === r ? editingView : null}
            dropEdge={dropEdge}
            dragging={!!rowDrag}
            dirtyVersion={dirtyVersion}
            depth={tree ? tree.depth[r] : 0}
            treeCol={treeCol}
            hasChildren={hasChildren(r)}
            collapsed={tree ? collapsed.has(ids[r]) : false}
            treeMode={treeMode}
            stickyLefts={stickyLefts}
            headerSticky={headerSticky}
            isCellEditable={isCellEditable}
            className={rowClassName?.(row, r)}
            renderRowHeader={renderRowHeader}
            listId={listId}
            errorId={errorId}
            api={api}
          />
        );
      })}
    </tbody>
  );

  const tfoot = hasFooter ? (
    <tfoot ref={tfootRef}>
      <tr>
        <th
          scope="row"
          style={headerSticky ? { left: 0 } : undefined}
          className={cn(
            'sticky bottom-0 z-30 border-r border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1.5 text-xs font-medium text-[var(--color-on-surface-muted)]',
            headerSticky && 'z-40',
          )}
        >
          <span className="sr-only">合計</span>
        </th>
        {columns.map((column) => {
          const left = stickyLefts[columns.indexOf(column)];
          const content =
            typeof column.footer === 'function' ? column.footer(rows) : column.footer;
          const align = column.align ?? (column.type === 'number' ? 'right' : 'left');
          return (
            <td
              key={column.key}
              onContextMenu={() =>
                setMenuTarget({ kind: 'footer', columnKey: column.key })
              }
              style={left !== undefined ? { left } : undefined}
              className={cn(
                'sticky bottom-0 z-30 h-9 border-r border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 text-sm font-medium last:border-r-0',
                left !== undefined && 'z-40',
                align === 'right' && 'text-right tabular-nums',
                align === 'center' && 'text-center',
              )}
            >
              {content}
            </td>
          );
        })}
      </tr>
    </tfoot>
  ) : null;

  return (
    <div
      ref={containerRef}
      onFocus={() => {
        focusInsideRef.current = true;
      }}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        // ポータルに出した候補・メニューへ移るときも「中」とみなす
        if (next && !e.currentTarget.contains(next)) focusInsideRef.current = false;
      }}
      className={cn(
        'isolate overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
        className,
      )}
    >
      <table
        role={treeMode ? 'treegrid' : 'grid'}
        aria-label={ariaLabel}
        aria-rowcount={rows.length}
        aria-colcount={colCount + 1}
        // 罫線は各セルが右と下だけ描く（separate）。collapse だと固定した列の
        // 罫線部分から下を流れるセルが透けるため
        className="w-full select-none border-separate border-spacing-0 text-sm"
        // 列幅（width）より細くならないよう、表の最小幅を列幅の合計にする
        // （狭いときは横にスクロールし、固定した列が効く）
        style={{ minWidth: tableMinWidth }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCopy={handleCopy}
      >
        <colgroup>
          <col style={{ width: rowHeaderWidth }} />
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width ?? 160 }} />
          ))}
        </colgroup>
        <thead ref={theadRef}>
          <tr>
            <th
              ref={(node) => {
                headerCellRefs.current[0] = node;
              }}
              scope="col"
              style={headerSticky ? { left: 0 } : undefined}
              className={cn(
                'sticky top-0 z-30 border-b border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1.5 text-center text-xs font-medium text-[var(--color-on-surface-muted)]',
                headerSticky && 'z-40',
              )}
            >
              <span className="sr-only">行番号</span>
            </th>
            {columns.map((column, c) => {
              const left = stickyLefts[c];
              const inSel =
                !!selectionRect && c >= selectionRect.left && c <= selectionRect.right;
              const align = column.align ?? 'left';
              return (
                <th
                  key={column.key}
                  ref={(node) => {
                    headerCellRefs.current[c + 1] = node;
                  }}
                  scope="col"
                  style={left !== undefined ? { left } : undefined}
                  onMouseDown={(e) => {
                    // 列見出しのクリックで列を選ぶ（Shift で広げる）
                    if (e.button !== 0 || visible.length === 0) return;
                    e.preventDefault();
                    if (editingRef.current) commitEdit('none');
                    pendingFocusRef.current = true;
                    if (e.shiftKey && anchor) {
                      setAnchor({ r: visible[visible.length - 1], c: anchor.c });
                      setActive({ r: visible[0], c });
                      return;
                    }
                    setAnchor({ r: visible[visible.length - 1], c });
                    setActive({ r: visible[0], c });
                  }}
                  className={cn(
                    'sticky top-0 z-30 cursor-pointer border-b border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1.5 text-xs font-medium text-[var(--color-on-surface-secondary)] last:border-r-0',
                    left !== undefined && 'z-40',
                    align === 'right' && 'text-right',
                    align === 'center' && 'text-center',
                    align === 'left' && 'text-left',
                    inSel && isMultiCell && 'text-[var(--color-on-surface-accent)]',
                  )}
                >
                  {column.header}
                  {column.required && (
                    <span aria-hidden className="ml-0.5 text-[var(--color-error-400)]">
                      *
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        {rowActions || contextMenu ? (
          <ContextMenu onOpenChange={(open) => !open && setMenuTarget(null)}>
            <ContextMenuTrigger asChild>{tbody}</ContextMenuTrigger>
            <ContextMenuContent onCloseAutoFocus={closeMenu}>
              {menuContent}
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          tbody
        )}
        {tfoot &&
          (contextMenu ? (
            <ContextMenu onOpenChange={(open) => !open && setMenuTarget(null)}>
              <ContextMenuTrigger asChild>{tfoot}</ContextMenuTrigger>
              <ContextMenuContent onCloseAutoFocus={closeMenu}>
                {menuContent}
              </ContextMenuContent>
            </ContextMenu>
          ) : (
            tfoot
          ))}
      </table>
      {/* 横にスクロールしても、行追加ボタンは左に残す */}
      {!hideAddRow && (
        <button
          type="button"
          onClick={() => {
            insertRows(rows.length);
          }}
          className="sticky left-0 flex w-full items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-on-surface-secondary)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]"
        >
          <Plus className="h-4 w-4" />
          {addRowLabel}
        </button>
      )}
    </div>
  );
}

const SpreadsheetGridImpl = React.forwardRef(SpreadsheetGridInner);
SpreadsheetGridImpl.displayName = 'SpreadsheetGrid';

export const SpreadsheetGrid = SpreadsheetGridImpl as <
  Row extends object = SpreadsheetRow,
>(
  props: SpreadsheetGridProps<Row> & { ref?: React.Ref<SpreadsheetGridHandle> },
) => React.ReactElement;
