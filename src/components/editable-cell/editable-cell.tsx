import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * EditableCell — DataTable のセルレンダラーとして使用する。
 *
 * TanStack Table の ColumnDef.cell 内で使う:
 * ```
 * cell: ({ getValue, row, column, table }) => (
 *   <EditableCell
 *     value={getValue() as string}
 *     onValueChange={(v) => handleUpdate(row.index, column.id, v)}
 *   />
 * )
 * ```
 */

export interface EditableCellProps {
  /** 現在の値 */
  value: string;
  /** 値確定時のコールバック（Promiseを返すと保存中UIを表示） */
  onValueChange?: (value: string) => void | Promise<void>;
  /** 入力タイプ */
  type?: 'text' | 'number';
  /** 無効化 */
  disabled?: boolean;
  className?: string;
}

export const EditableCell = React.forwardRef<HTMLDivElement, EditableCellProps>(
  ({ value, onValueChange, type = 'text', disabled = false, className }, ref) => {
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
    const [saving, setSaving] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 外部から value が変わったら draft を同期
    React.useEffect(() => {
      if (!editing) setDraft(value);
    }, [value, editing]);

    React.useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const handleConfirm = async () => {
      setEditing(false);
      if (draft !== value && onValueChange) {
        setSaving(true);
        try {
          await onValueChange(draft);
        } catch {
          setDraft(value);
        } finally {
          setSaving(false);
        }
      }
    };

    const handleCancel = () => {
      setDraft(value);
      setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };

    // 編集モード
    if (editing) {
      return (
        <div ref={ref} className={cn('-m-1', className)}>
          <input
            ref={inputRef}
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleConfirm}
            disabled={saving}
            className={cn(
              'h-8 w-full rounded border border-primary-500 bg-[var(--color-surface-raised)] px-2 text-sm outline-none',
              'ring-2 ring-primary-500/20',
              saving && 'opacity-50',
            )}
          />
        </div>
      );
    }

    // 表示モード（クリックで編集開始）
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          if (!disabled) {
            e.stopPropagation(); // DataTable の行選択クリックを防ぐ
            setEditing(true);
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === 'F2')) {
            e.preventDefault();
            setEditing(true);
          }
        }}
        className={cn(
          '-m-1 h-8 cursor-pointer rounded px-2 text-sm leading-8 transition-colors',
          'hover:bg-[var(--color-surface-muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30',
          disabled && 'cursor-default opacity-50',
          className,
        )}
      >
        {value || <span className="text-[var(--color-on-surface-muted)]">—</span>}
      </div>
    );
  },
);
EditableCell.displayName = 'EditableCell';
