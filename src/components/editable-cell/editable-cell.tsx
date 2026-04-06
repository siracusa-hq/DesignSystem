import * as React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface EditableCellProps {
  value: string;
  onValueChange?: (value: string) => void | Promise<void>;
  type?: 'text' | 'number';
  disabled?: boolean;
  className?: string;
}

export const EditableCell = React.forwardRef<HTMLDivElement, EditableCellProps>(
  ({ value, onValueChange, type = 'text', disabled = false, className }, ref) => {
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
    const [saving, setSaving] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      setDraft(value);
    }, [value]);

    React.useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const handleConfirm = async () => {
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
      setEditing(false);
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
      } else if (e.key === 'Tab') {
        handleConfirm();
      }
    };

    if (editing) {
      return (
        <div ref={ref} className={cn('flex items-center gap-1', className)}>
          <input
            ref={inputRef}
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleConfirm}
            disabled={saving}
            className={cn(
              'h-7 w-full rounded border border-primary-500 bg-[var(--color-surface-raised)] px-2 text-sm outline-none',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
              saving && 'opacity-50',
            )}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setEditing(true)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === 'F2')) {
            e.preventDefault();
            setEditing(true);
          }
        }}
        className={cn(
          'group h-7 cursor-pointer rounded px-2 text-sm leading-7 transition-colors',
          'hover:bg-[var(--color-surface-muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
          disabled && 'cursor-default opacity-50',
          draft !== value && 'border-l-2 border-l-warning-500',
          className,
        )}
      >
        {value || <span className="text-[var(--color-on-surface-muted)]">—</span>}
      </div>
    );
  },
);
EditableCell.displayName = 'EditableCell';
