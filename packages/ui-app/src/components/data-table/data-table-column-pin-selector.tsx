import * as React from 'react';
import { Pin } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ColumnPinOption {
  id: string;
  label: string;
}

export interface ColumnPinSelectorProps {
  options: ColumnPinOption[];
  pinned: string[];
  onToggle: (id: string, checked: boolean) => void;
  label?: string;
  className?: string;
}

export function ColumnPinSelector({
  options,
  pinned,
  onToggle,
  label = 'Pin columns',
  className,
}: ColumnPinSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-surface-muted)]"
        onClick={() => setOpen(!open)}
        aria-label={label}
        aria-expanded={open}
      >
        <Pin className="h-3.5 w-3.5" />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-popover mt-1 min-w-[10rem] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-1 shadow-md">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-[var(--color-surface-sunken)] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={pinned.includes(opt.id)}
                onChange={(e) => onToggle(opt.id, e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
ColumnPinSelector.displayName = 'ColumnPinSelector';
