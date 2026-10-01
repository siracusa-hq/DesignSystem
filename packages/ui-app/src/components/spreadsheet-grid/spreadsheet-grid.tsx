import * as React from 'react';
import {
  Plus,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/cn';
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
   スプレッドシート風グリッド。〜100行程度を想定（仮想化なし）。

   - データは完全制御型（rows / onRowsChange）。保存はアプリ側が
     rows を一括送信する前提で、本コンポーネントは通信を行わない
   - 数式・セル参照はサポートしない。計算列は type: 'readonly' +
     getValue でアプリ側から定義する
   - バリデーションはセル編集中にもリアルタイムに表示する
   - Cmd/Ctrl+Z で Undo、Cmd/Ctrl+Shift+Z / Ctrl+Y で Redo。
     グリッド内部からの変更のみが履歴対象（外部からの rows 差し替えで
     履歴はリセットされる）
   -------------------------------------------------------- */

export type SpreadsheetCellValue = string | number | boolean | null | undefined;
export type SpreadsheetRow = Record<string, SpreadsheetCellValue>;

export type SpreadsheetColumnType =
  | 'text'
  | 'number'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'readonly';

export interface SpreadsheetSelectOption {
  value: string;
  label: string;
}

export interface SpreadsheetColumn<Row extends SpreadsheetRow = SpreadsheetRow> {
  key: string;
  header: string;
  type: SpreadsheetColumnType;
  /** 列幅(px)。既定 160 */
  width?: number;
  /** type: 'select' の選択肢 */
  options?: SpreadsheetSelectOption[];
  required?: boolean;
  /** type: 'number' の下限/上限 */
  min?: number;
  max?: number;
  /** カスタム検証。エラーメッセージを返すとエラー表示（null/undefined で合格） */
  validate?: (value: SpreadsheetCellValue, row: Row) => string | null | undefined;
  /** type: 'readonly' の表示値（計算列）。例: (r) => r.qty * r.price */
  getValue?: (row: Row) => React.ReactNode;
}

export interface SpreadsheetError {
  rowIndex: number;
  columnKey: string;
  message: string;
}

export interface SpreadsheetGridHandle {
  /** 変更済みセルのマーカーをすべて消す（保存完了後に呼ぶ） */
  clearDirty: () => void;
}

export interface SpreadsheetGridProps<Row extends SpreadsheetRow = SpreadsheetRow> {
  columns: SpreadsheetColumn<Row>[];
  rows: Row[];
  /** 編集・行操作・ペーストなど、すべての変更がここに集約される */
  onRowsChange: (rows: Row[]) => void;
  /** 行追加時の初期値。既定は空オブジェクト */
  createRow?: () => Row;
  /** 下部の行追加ボタンを隠す */
  hideAddRow?: boolean;
  /** 行追加ボタンのラベル。既定「行を追加」 */
  addRowLabel?: string;
  'aria-label': string;
  className?: string;
}

/* ----- バリデーション ----- */

function validateCell<Row extends SpreadsheetRow>(
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
    const num = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(num)) return '数値で入力してください';
    if (column.min !== undefined && num < column.min)
      return `${column.min} 以上を入力してください`;
    if (column.max !== undefined && num > column.max)
      return `${column.max} 以下を入力してください`;
  }
  return column.validate?.(value, row) ?? null;
}

/** 全セルを検証してエラー一覧を返す。アプリ側の「保存ボタン無効化」などに使う */
export function getSpreadsheetErrors<Row extends SpreadsheetRow>(
  rows: Row[],
  columns: SpreadsheetColumn<Row>[],
): SpreadsheetError[] {
  const errors: SpreadsheetError[] = [];
  rows.forEach((row, rowIndex) => {
    for (const column of columns) {
      if (column.type === 'readonly') continue;
      const message = validateCell(column, row[column.key], row);
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
    const trimmed = draft.trim().replace(/,/g, '');
    if (trimmed === '') return { ok: true, value: null };
    const num = Number(trimmed);
    return Number.isNaN(num) ? { ok: false, value: null } : { ok: true, value: num };
  }
  if (type === 'select' || type === 'date') {
    return { ok: true, value: draft === '' ? null : draft };
  }
  return { ok: true, value: draft };
}

function parsePastedValue<Row extends SpreadsheetRow>(
  column: SpreadsheetColumn<Row>,
  text: string,
): SpreadsheetCellValue {
  const trimmed = text.trim();
  switch (column.type) {
    case 'number': {
      if (trimmed === '') return null;
      const num = Number(trimmed.replace(/,/g, ''));
      return Number.isNaN(num) ? null : num;
    }
    case 'checkbox':
      return /^(true|1|yes|✓|○)$/i.test(trimmed);
    case 'date': {
      if (trimmed === '') return null;
      const normalized = trimmed.replace(/\//g, '-');
      return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
    }
    case 'select': {
      if (trimmed === '') return null;
      // value か label のどちらでも受け付ける（Excel からはラベルが貼られがち）
      const byValue = column.options?.find((o) => o.value === trimmed);
      if (byValue) return byValue.value;
      const byLabel = column.options?.find((o) => o.label === trimmed);
      return byLabel ? byLabel.value : null;
    }
    default:
      return text;
  }
}

function formatCellForCopy<Row extends SpreadsheetRow>(
  column: SpreadsheetColumn<Row>,
  row: Row,
): string {
  const value = row[column.key];
  if (column.type === 'checkbox') return value === true ? 'TRUE' : 'FALSE';
  if (column.type === 'readonly' && column.getValue) {
    const computed = column.getValue(row);
    if (typeof computed === 'string' || typeof computed === 'number') {
      return String(computed);
    }
  }
  if (column.type === 'select') {
    const option = column.options?.find((o) => o.value === value);
    if (option) return option.label;
  }
  return value === null || value === undefined ? '' : String(value);
}

function formatCellForDisplay<Row extends SpreadsheetRow>(
  column: SpreadsheetColumn<Row>,
  row: Row,
): React.ReactNode {
  if (column.type === 'readonly' && column.getValue) return column.getValue(row);
  const value = row[column.key];
  if (value === null || value === undefined || value === '') return null;
  if (column.type === 'select') {
    return column.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  if (column.type === 'number' && typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}

/* ----- 本体 ----- */

/* ----- select / date のセルエディタ -----

   既存の Select / DatePicker（Radix Popover ベース）をセルエディタとして使う。
   どちらも Portal を使うため blur ベースの確定は成立しない（フォーカスが
   Portal に移った瞬間に blur が発火する）。そのため確定・取消は
   「値の選択 = 確定」「Escape / 選択せず閉じる = 取消」で扱い、
   別セルクリック時の取消はグリッド側の onMouseDown で面倒を見る。 */

const SELECT_CLEAR_VALUE = '__spreadsheet_grid_clear__';

function SelectCellEditor<Row extends SpreadsheetRow>({
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

function DateCellEditor<Row extends SpreadsheetRow>({
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

interface CellPos {
  r: number;
  c: number;
}

interface EditingState {
  r: number;
  c: number;
  draft: string;
}

const EDITABLE_TYPES: SpreadsheetColumnType[] = ['text', 'number', 'select', 'date'];

function SpreadsheetGridInner<Row extends SpreadsheetRow>(
  {
    columns,
    rows,
    onRowsChange,
    createRow = () => ({}) as Row,
    hideAddRow = false,
    addRowLabel = '行を追加',
    className,
    'aria-label': ariaLabel,
  }: SpreadsheetGridProps<Row>,
  ref: React.ForwardedRef<SpreadsheetGridHandle>,
) {
  const [active, setActive] = React.useState<CellPos | null>(null);
  const [anchor, setAnchor] = React.useState<CellPos | null>(null);
  const [editing, setEditing] = React.useState<EditingState | null>(null);
  const [menuRow, setMenuRow] = React.useState<number | null>(null);
  const [, bumpDirtyVersion] = React.useReducer((v: number) => v + 1, 0);

  const cellRefs = React.useRef(new Map<string, HTMLTableCellElement>());
  const editorRef = React.useRef<HTMLInputElement | HTMLSelectElement | null>(null);
  const draggingRef = React.useRef(false);
  const committingRef = React.useRef(false);

  // 行の同一性管理。セル更新で行オブジェクトを作り直しても React key と
  // dirty マーカーが引き継がれるよう、WeakMap で id を採番する
  const rowKeyMap = React.useRef(new WeakMap<object, number>());
  const rowKeyCounter = React.useRef(0);
  const dirtyMap = React.useRef(new WeakMap<object, Set<string>>());

  const getRowKey = (row: Row): number => {
    let key = rowKeyMap.current.get(row);
    if (key === undefined) {
      key = rowKeyCounter.current++;
      rowKeyMap.current.set(row, key);
    }
    return key;
  };

  const transferRowIdentity = (oldRow: Row, newRow: Row) => {
    const key = rowKeyMap.current.get(oldRow);
    if (key !== undefined) rowKeyMap.current.set(newRow, key);
    const dirty = dirtyMap.current.get(oldRow);
    if (dirty) dirtyMap.current.set(newRow, new Set(dirty));
  };

  const markDirty = (row: Row, columnKeys: string[]) => {
    const set = dirtyMap.current.get(row) ?? new Set<string>();
    for (const key of columnKeys) set.add(key);
    dirtyMap.current.set(row, set);
    bumpDirtyVersion();
  };

  React.useImperativeHandle(ref, () => ({
    clearDirty: () => {
      dirtyMap.current = new WeakMap();
      bumpDirtyVersion();
    },
  }));

  /* ----- フォーカス管理 ----- */

  React.useEffect(() => {
    if (active && !editing) {
      cellRefs.current.get(`${active.r}:${active.c}`)?.focus({ preventScroll: false });
    }
  }, [active, editing]);

  React.useEffect(() => {
    if (editing) {
      editorRef.current?.focus();
      if (editorRef.current instanceof HTMLInputElement) {
        editorRef.current.select();
      }
    }
  }, [editing?.r, editing?.c]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- 選択範囲 ----- */

  const selectionRect = React.useMemo(() => {
    if (!active) return null;
    const a = anchor ?? active;
    return {
      top: Math.min(a.r, active.r),
      bottom: Math.max(a.r, active.r),
      left: Math.min(a.c, active.c),
      right: Math.max(a.c, active.c),
    };
  }, [active, anchor]);

  const isSelected = (r: number, c: number) =>
    !!selectionRect &&
    r >= selectionRect.top &&
    r <= selectionRect.bottom &&
    c >= selectionRect.left &&
    c <= selectionRect.right;

  /* ----- Undo / Redo -----

     内部からの変更はすべて applyChange を通るため、変更前の rows を
     スナップショットとして積むだけで履歴になる（immutable 更新なので
     参照コピーのみ、〜100行規模ではコストは無視できる）。
     rows は完全制御型のため、アプリ側が外から rows を差し替えた場合
     （保存後のサーバー再取得など）は履歴とズレる。その場合は検知して
     履歴をリセットし、安全側に倒す */

  const HISTORY_LIMIT = 100;
  const historyRef = React.useRef<{ past: Row[][]; future: Row[][] }>({
    past: [],
    future: [],
  });
  const lastInternalRowsRef = React.useRef<Row[]>(rows);

  React.useEffect(() => {
    if (rows !== lastInternalRowsRef.current) {
      historyRef.current = { past: [], future: [] };
      lastInternalRowsRef.current = rows;
    }
  }, [rows]);

  const applyChange = (next: Row[]) => {
    historyRef.current.past.push(rows);
    if (historyRef.current.past.length > HISTORY_LIMIT) {
      historyRef.current.past.shift();
    }
    historyRef.current.future = [];
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

  const updateCells = (
    updates: { r: number; key: string; value: SpreadsheetCellValue }[],
    appendedRows: Row[] = [],
  ) => {
    if (updates.length === 0 && appendedRows.length === 0) return;
    const next = [...rows, ...appendedRows];
    const replaced = new Map<number, Row>();
    for (const { r, key, value } of updates) {
      const base = replaced.get(r) ?? next[r];
      if (!base) continue;
      const newRow = { ...base, [key]: value } as Row;
      if (!replaced.has(r)) transferRowIdentity(next[r], newRow);
      else {
        const prev = replaced.get(r)!;
        transferRowIdentity(prev, newRow);
      }
      replaced.set(r, newRow);
      next[r] = newRow;
      markDirty(newRow, [key]);
    }
    for (const row of appendedRows) {
      markDirty(row, columns.filter((c) => c.type !== 'readonly').map((c) => c.key));
    }
    applyChange(next);
  };

  /* ----- 編集 ----- */

  const startEdit = (r: number, c: number, initialDraft?: string) => {
    const column = columns[c];
    if (!EDITABLE_TYPES.includes(column.type)) return;
    const value = rows[r]?.[column.key];
    const draft =
      initialDraft !== undefined
        ? initialDraft
        : value === null || value === undefined
          ? ''
          : String(value);
    setEditing({ r, c, draft });
  };

  const commitEdit = (move: 'down' | 'right' | 'none') => {
    if (!editing || committingRef.current) return;
    const column = columns[editing.c];
    const { ok, value } = parseDraft(column.type, editing.draft);
    // 数値として不正な入力: Enter/Tab では確定せず編集を継続させ、
    // その場で修正を促す（エラーはライブ表示済み）。blur 時のみ破棄して閉じる
    if (!ok && move !== 'none') return;
    committingRef.current = true;
    const current = rows[editing.r]?.[column.key] ?? null;
    if (ok && value !== current) {
      updateCells([{ r: editing.r, key: column.key, value }]);
    }
    const { r, c } = editing;
    setEditing(null);
    if (move === 'down') {
      if (r === rows.length - 1) {
        // 最下行で Enter → 新規行を追加して移動
        // （rows はまだ古い配列なので clamp を通さず直接移動する）
        const newRow = createRow();
        markDirty(newRow, columns.filter((col) => col.type !== 'readonly').map((col) => col.key));
        applyChange([...rows, newRow]);
        setActive({ r: r + 1, c });
        setAnchor({ r: r + 1, c });
      } else {
        moveActive(r + 1, c);
      }
    } else if (move === 'right') {
      moveActive(r, Math.min(c + 1, columns.length - 1));
    }
    committingRef.current = false;
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  /* ----- ナビゲーション ----- */

  const clamp = (r: number, c: number): CellPos => ({
    r: Math.max(0, Math.min(rows.length - 1, r)),
    c: Math.max(0, Math.min(columns.length - 1, c)),
  });

  const moveActive = (r: number, c: number, extend = false) => {
    if (rows.length === 0) return;
    const pos = clamp(r, c);
    setActive(pos);
    if (!extend) setAnchor(pos);
  };

  /* ----- コピー & ペースト & クリア ----- */

  const copySelection = () => {
    if (!selectionRect) return;
    const lines: string[] = [];
    for (let r = selectionRect.top; r <= selectionRect.bottom; r++) {
      const cells: string[] = [];
      for (let c = selectionRect.left; c <= selectionRect.right; c++) {
        cells.push(formatCellForCopy(columns[c], rows[r]));
      }
      lines.push(cells.join('\t'));
    }
    void navigator.clipboard?.writeText(lines.join('\n')).catch(() => {});
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (editing || !active) return;
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;
    e.preventDefault();
    const lines = text.replace(/\r/g, '').replace(/\n$/, '').split('\n');
    const matrix = lines.map((line) => line.split('\t'));
    const start = selectionRect
      ? { r: selectionRect.top, c: selectionRect.left }
      : active;

    const updates: { r: number; key: string; value: SpreadsheetCellValue }[] = [];
    const appended: Row[] = [];
    matrix.forEach((cells, dr) => {
      const r = start.r + dr;
      if (r >= rows.length + appended.length) {
        appended.push(createRow());
      }
      cells.forEach((cellText, dc) => {
        const c = start.c + dc;
        if (c >= columns.length) return;
        const column = columns[c];
        if (column.type === 'readonly') return;
        updates.push({ r, key: column.key, value: parsePastedValue(column, cellText) });
      });
    });
    updateCells(updates, appended);
    // ペースト範囲を選択状態にする
    setAnchor(start);
    setActive(
      clampTo(
        start.r + matrix.length - 1,
        start.c + Math.max(...matrix.map((m) => m.length)) - 1,
        rows.length + appended.length,
        columns.length,
      ),
    );
  };

  const clampTo = (r: number, c: number, rowCount: number, colCount: number): CellPos => ({
    r: Math.max(0, Math.min(rowCount - 1, r)),
    c: Math.max(0, Math.min(colCount - 1, c)),
  });

  const clearSelection = () => {
    if (!selectionRect) return;
    const updates: { r: number; key: string; value: SpreadsheetCellValue }[] = [];
    for (let r = selectionRect.top; r <= selectionRect.bottom; r++) {
      for (let c = selectionRect.left; c <= selectionRect.right; c++) {
        const column = columns[c];
        if (column.type === 'readonly') continue;
        updates.push({
          r,
          key: column.key,
          value: column.type === 'checkbox' ? false : column.type === 'text' ? '' : null,
        });
      }
    }
    updateCells(updates);
  };

  /* ----- 行選択 -----

     行番号セルのクリックで行全体を選択する。Shift+クリック / ドラッグで
     複数行に拡張。anchor を (開始行, 最終列)・active を (対象行, 先頭列) に
     置くことで、選択矩形が常に全列をカバーする */

  const rowDraggingRef = React.useRef(false);

  /* ----- 行の Drag & Drop -----

     選択済みの行番号セルをドラッグすると行ブロックを移動する
     （未選択の行番号のドラッグは行選択の拡張）。Sheets と同じ使い分け。
     over は「この行の直前に挿入する」挿入位置（0〜rows.length） */

  const [rowDrag, setRowDrag] = React.useState<{
    start: number;
    end: number;
    pressed: number;
    over: number | null;
  } | null>(null);

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
    const next = [...rows];
    const block = next.splice(start, len);
    const insertAt = over > end ? over - len : over;
    next.splice(insertAt, 0, ...block);
    applyChange(next);
    setAnchor({ r: insertAt, c: columns.length - 1 });
    setActive({ r: insertAt + len - 1, c: 0 });
  };

  const selectRow = (r: number, extend: boolean) => {
    if (extend && anchor) {
      setAnchor({ r: anchor.r, c: columns.length - 1 });
    } else {
      setAnchor({ r, c: columns.length - 1 });
    }
    setActive({ r, c: 0 });
  };

  const isRowSelected = (r: number) =>
    !!selectionRect &&
    r >= selectionRect.top &&
    r <= selectionRect.bottom &&
    selectionRect.left === 0 &&
    selectionRect.right === columns.length - 1;

  /* ----- 行操作 -----

     コンテキストメニューは、右クリックした行が選択範囲の行スパンに
     含まれていれば選択中の複数行を、そうでなければその行だけを対象にする。
     挿入系は rows がまだ古い配列のため clamp（moveActive）を通さず直接移動する */

  const contextTargetRows = (): { start: number; end: number } | null => {
    if (menuRow === null) return null;
    if (
      selectionRect &&
      menuRow >= selectionRect.top &&
      menuRow <= selectionRect.bottom
    ) {
      return { start: selectionRect.top, end: selectionRect.bottom };
    }
    return { start: menuRow, end: menuRow };
  };

  const editableKeys = () =>
    columns.filter((c) => c.type !== 'readonly').map((c) => c.key);

  const insertRows = (index: number, count = 1) => {
    const newRows = Array.from({ length: count }, () => {
      const row = createRow();
      markDirty(row, editableKeys());
      return row;
    });
    const next = [...rows];
    next.splice(index, 0, ...newRows);
    applyChange(next);
    const pos = { r: index, c: active?.c ?? 0 };
    setActive(pos);
    setAnchor(pos);
  };

  const duplicateRows = (start: number, end: number) => {
    const copies = rows.slice(start, end + 1).map((row) => {
      const copy = { ...row } as Row;
      markDirty(copy, editableKeys());
      return copy;
    });
    const next = [...rows];
    next.splice(end + 1, 0, ...copies);
    applyChange(next);
    setAnchor({ r: end + 1, c: columns.length - 1 });
    setActive({ r: end + copies.length, c: 0 });
  };

  const deleteRows = (start: number, end: number) => {
    const next = [...rows.slice(0, start), ...rows.slice(end + 1)];
    applyChange(next);
    if (next.length === 0) {
      setActive(null);
      setAnchor(null);
    } else {
      const pos = { r: Math.min(start, next.length - 1), c: active?.c ?? 0 };
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

  /* ----- キーボード ----- */

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing || !active) return;
    const { r, c } = active;
    const column = columns[c];
    const mod = e.ctrlKey || e.metaKey;

    const nav = (nr: number, nc: number) => {
      e.preventDefault();
      moveActive(nr, nc, e.shiftKey);
    };

    switch (e.key) {
      case 'ArrowUp':
        nav(r - 1, c);
        return;
      case 'ArrowDown':
        nav(r + 1, c);
        return;
      case 'ArrowLeft':
        nav(r, c - 1);
        return;
      case 'ArrowRight':
        nav(r, c + 1);
        return;
      case 'Home':
        nav(r, 0);
        return;
      case 'End':
        nav(r, columns.length - 1);
        return;
      case 'Tab': {
        // 端のセルでは preventDefault せず、グリッドの外へフォーカスを逃がす
        // （フォーカストラップにしない）
        if (e.shiftKey) {
          if (c > 0) {
            e.preventDefault();
            moveActive(r, c - 1);
          } else if (r > 0) {
            e.preventDefault();
            moveActive(r - 1, columns.length - 1);
          }
        } else {
          if (c < columns.length - 1) {
            e.preventDefault();
            moveActive(r, c + 1);
          } else if (r < rows.length - 1) {
            e.preventDefault();
            moveActive(r + 1, 0);
          }
        }
        return;
      }
      case 'Enter':
        e.preventDefault();
        if (column.type === 'checkbox') {
          updateCells([{ r, key: column.key, value: rows[r][column.key] !== true }]);
        } else if (EDITABLE_TYPES.includes(column.type)) {
          startEdit(r, c);
        } else {
          moveActive(r + 1, c);
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
          setAnchor({ r: selectionRect.top, c: columns.length - 1 });
          setActive({ r: selectionRect.bottom, c: 0 });
          return;
        }
        if (column.type === 'checkbox') {
          e.preventDefault();
          updateCells([{ r, key: column.key, value: rows[r][column.key] !== true }]);
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
    if (mod && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      setAnchor({ r: 0, c: 0 });
      setActive({ r: rows.length - 1, c: columns.length - 1 });
      return;
    }
    // Undo / Redo（Cmd/Ctrl+Z、Shift で Redo。Ctrl+Y も Redo）
    if (mod && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && (e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      redo();
      return;
    }
    // 印字可能文字で編集開始（Excel/Sheets と同じ）
    if (!mod && !e.altKey && e.key.length === 1) {
      if (column.type === 'text' || column.type === 'number') {
        e.preventDefault();
        startEdit(r, c, e.key);
      } else if (column.type === 'select' || column.type === 'date') {
        e.preventDefault();
        startEdit(r, c);
      }
    }
  };

  /* ----- セルの描画 ----- */

  // select / date（ポップオーバー型エディタ）の確定。値の選択 = 確定
  const commitPickerValue = (value: SpreadsheetCellValue) => {
    if (!editing) return;
    const column = columns[editing.c];
    const current = rows[editing.r]?.[column.key] ?? null;
    if (value !== current) {
      updateCells([{ r: editing.r, key: column.key, value }]);
    }
    setEditing(null);
  };

  const renderEditor = (column: SpreadsheetColumn<Row>, state: EditingState) => {
    const row = rows[state.r];

    if (column.type === 'select' || column.type === 'date') {
      const currentValue = row?.[column.key] ?? null;
      const invalid = !!validateCell(column, currentValue, row);
      const Editor = column.type === 'select' ? SelectCellEditor : DateCellEditor;
      return (
        <Editor
          column={column}
          value={currentValue}
          invalid={invalid}
          onCommit={commitPickerValue}
          onCancel={cancelEdit}
        />
      );
    }

    const { ok, value } = parseDraft(column.type, state.draft);
    // 入力中のリアルタイム検証。パース不能な数値はパースエラーを優先
    const liveError = !ok
      ? '数値で入力してください'
      : validateCell(column, value, row);

    const editorKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit('down');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commitEdit('right');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
      e.stopPropagation();
    };

    const editorClass = cn(
      'h-full w-full border-0 bg-[var(--color-surface-raised)] px-2 text-sm outline-none',
      'ring-2 ring-inset',
      liveError
        ? 'ring-[var(--color-error-400)]'
        : 'ring-[var(--color-primary-500)]',
    );

    return (
      <>
        <input
          ref={(node) => {
            editorRef.current = node;
          }}
          type="text"
          inputMode={column.type === 'number' ? 'decimal' : undefined}
          value={state.draft}
          onChange={(e) => setEditing({ ...state, draft: e.target.value })}
          onKeyDown={editorKeyDown}
          onBlur={() => commitEdit('none')}
          className={editorClass}
          aria-invalid={liveError ? true : undefined}
          aria-describedby={liveError ? 'spreadsheet-live-error' : undefined}
        />
        {liveError && (
          <div
            id="spreadsheet-live-error"
            role="alert"
            className="absolute left-0 top-full z-10 mt-0.5 flex items-center gap-1 whitespace-nowrap rounded border border-[var(--color-error-200)] bg-[var(--color-surface-raised)] px-2 py-1 text-xs text-[var(--color-error-600)] shadow-md"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {liveError}
          </div>
        )}
      </>
    );
  };

  const colCount = columns.length;

  return (
    <div
      className={cn(
        'overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
        className,
      )}
    >
      <table
        role="grid"
        aria-label={ariaLabel}
        aria-rowcount={rows.length}
        aria-colcount={colCount + 1}
        className="w-full select-none border-collapse text-sm"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      >
        <colgroup>
          <col style={{ width: 44 }} />
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width ?? 160 }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1.5 text-center text-xs font-medium text-[var(--color-on-surface-muted)]"
            >
              <span className="sr-only">行番号</span>
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="sticky top-0 z-10 border-b border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1.5 text-left text-xs font-medium text-[var(--color-on-surface-secondary)] last:border-r-0"
              >
                {column.header}
                {column.required && (
                  <span aria-hidden className="ml-0.5 text-[var(--color-error-400)]">
                    *
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <ContextMenu onOpenChange={(open) => !open && setMenuRow(null)}>
          <ContextMenuTrigger asChild>
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
              {rows.map((row, r) => (
                <tr
                  key={getRowKey(row)}
                  aria-rowindex={r + 1}
                  onContextMenu={() => setMenuRow(r)}
                  onMouseEnter={() => {
                    if (rowDrag) {
                      setRowDrag((prev) => {
                        if (!prev) return prev;
                        const over =
                          r < prev.start ? r : r > prev.end ? r + 1 : null;
                        return { ...prev, over };
                      });
                    }
                  }}
                >
                  <th
                    scope="row"
                    aria-selected={isRowSelected(r) || undefined}
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      if (isRowSelected(r) && selectionRect) {
                        // 選択済みの行番号をドラッグ → 行ブロックの移動
                        setRowDrag({
                          start: selectionRect.top,
                          end: selectionRect.bottom,
                          pressed: r,
                          over: null,
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
                        setRowDrag({ start: r, end: r, pressed: r, over: null });
                      }
                    }}
                    onMouseEnter={() => {
                      if (rowDraggingRef.current) setActive({ r, c: 0 });
                    }}
                    className={cn(
                      'group cursor-grab select-none border-b border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1 text-center text-xs font-normal text-[var(--color-on-surface-muted)]',
                      'hover:bg-[var(--color-surface-muted)]',
                      isRowSelected(r) &&
                        'bg-[var(--color-surface-accent)] text-[var(--color-on-surface-accent)] font-medium',
                      rowDrag?.over === r &&
                        'shadow-[inset_0_2px_0_var(--color-primary-500)]',
                      rowDrag &&
                        rowDrag.over === rows.length &&
                        r === rows.length - 1 &&
                        'shadow-[inset_0_-2px_0_var(--color-primary-500)]',
                      rowDrag && 'cursor-grabbing',
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
                          isRowSelected(r)
                            ? 'opacity-60'
                            : 'opacity-0 group-hover:opacity-40',
                        )}
                      />
                      {r + 1}
                    </span>
                  </th>
                  {columns.map((column, c) => {
                    const isEditing = editing?.r === r && editing?.c === c;
                    const isActive = active?.r === r && active?.c === c;
                    const error = isEditing
                      ? null
                      : column.type === 'readonly'
                        ? null
                        : validateCell(column, row[column.key], row);
                    const dirty =
                      dirtyMap.current.get(row)?.has(column.key) ?? false;
                    return (
                      <td
                        key={column.key}
                        ref={(node) => {
                          if (node) cellRefs.current.set(`${r}:${c}`, node);
                          else cellRefs.current.delete(`${r}:${c}`);
                        }}
                        role="gridcell"
                        tabIndex={isActive ? 0 : -1}
                        aria-colindex={c + 2}
                        aria-selected={isSelected(r, c) || undefined}
                        aria-readonly={column.type === 'readonly' || undefined}
                        aria-invalid={error ? true : undefined}
                        title={error ?? undefined}
                        data-dirty={dirty || undefined}
                        data-error={error ? true : undefined}
                        onMouseDown={(e) => {
                          if (e.button !== 0) return;
                          // select / date エディタは Portal を使うため blur で閉じない。
                          // 別セルのクリックでここから取り消す
                          // （input エディタは mousedown 後の blur が確定を担う）
                          if (
                            editing &&
                            (editing.r !== r || editing.c !== c) &&
                            (columns[editing.c].type === 'select' ||
                              columns[editing.c].type === 'date')
                          ) {
                            setEditing(null);
                          }
                          draggingRef.current = true;
                          if (e.shiftKey && active) {
                            setActive({ r, c });
                          } else {
                            moveActive(r, c);
                          }
                        }}
                        onMouseEnter={() => {
                          if (draggingRef.current) setActive({ r, c });
                        }}
                        onDoubleClick={() => startEdit(r, c)}
                        className={cn(
                          'relative h-9 border-b border-r border-[var(--color-border)] px-2 outline-none last:border-r-0',
                          column.type === 'number' && 'text-right tabular-nums',
                          column.type === 'readonly' &&
                            'bg-[var(--color-surface-sunken)] text-[var(--color-on-surface-secondary)]',
                          // エラーは淡い塗り + 細いリングに留める（赤を強くしすぎない）。
                          // 選択中は選択色を優先し、アクティブ枠は ring と別プロパティ
                          // （shadow）なので共存する
                          error &&
                            !isEditing &&
                            'bg-[color-mix(in_oklab,var(--color-error-500)_10%,transparent)] ring-1 ring-inset ring-[var(--color-error-400)]',
                          isSelected(r, c) &&
                            !isEditing &&
                            'bg-[var(--color-surface-accent)]',
                          isActive &&
                            !isEditing &&
                            'shadow-[inset_0_0_0_2px_var(--color-primary-500)]',
                          // 行 D&D のドロップ位置インジケータ（行全体に線を引く）
                          rowDrag?.over === r &&
                            'shadow-[inset_0_2px_0_var(--color-primary-500)]',
                          rowDrag &&
                            rowDrag.over === rows.length &&
                            r === rows.length - 1 &&
                            'shadow-[inset_0_-2px_0_var(--color-primary-500)]',
                          isEditing && 'p-0',
                        )}
                      >
                        {isEditing ? (
                          renderEditor(column, editing)
                        ) : column.type === 'checkbox' ? (
                          <span className="flex items-center justify-center">
                            <Checkbox
                              tabIndex={-1}
                              checked={row[column.key] === true}
                              onCheckedChange={(checked) =>
                                updateCells([
                                  { r, key: column.key, value: checked === true },
                                ])
                              }
                            />
                          </span>
                        ) : (
                          <span className="block truncate">
                            {formatCellForDisplay(column, row) ?? (
                              <span className="text-[var(--color-on-surface-muted)]">
                                {''}
                              </span>
                            )}
                          </span>
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
              ))}
            </tbody>
          </ContextMenuTrigger>
          <ContextMenuContent
            // Radix の既定はトリガー(tbody)へのフォーカス復帰だが、tbody は
            // フォーカス不能なので body に落ちてキー操作が効かなくなる。
            // 閉じたらアクティブセルへ戻す
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              if (active) {
                cellRefs.current.get(`${active.r}:${active.c}`)?.focus();
              }
            }}
          >
            {(() => {
              const target = contextTargetRows();
              if (!target) return null;
              const { start, end } = target;
              const count = end - start + 1;
              const unit = count > 1 ? `${count}行` : '行';
              return (
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
                  <ContextMenuItem
                    disabled={start === 0}
                    onSelect={() => moveRows(start, end, -1)}
                  >
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
                  <ContextMenuItem onSelect={() => deleteRows(start, end)}>
                    <Trash2 className="mr-2 h-4 w-4 text-[var(--color-error-500)]" />
                    {unit}を削除
                  </ContextMenuItem>
                </>
              );
            })()}
          </ContextMenuContent>
        </ContextMenu>
      </table>
      {!hideAddRow && (
        <button
          type="button"
          onClick={() => {
            insertRows(rows.length);
          }}
          className="flex w-full items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-on-surface-secondary)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]"
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
  Row extends SpreadsheetRow = SpreadsheetRow,
>(
  props: SpreadsheetGridProps<Row> & { ref?: React.Ref<SpreadsheetGridHandle> },
) => React.ReactElement;
