import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { Columns3 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  enableColumnVisibility?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  enableColumnVisibility = false,
  className,
  children,
}: DataTableToolbarProps<TData>) {
  const [showColumnMenu, setShowColumnMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
    }
    if (showColumnMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColumnMenu]);

  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 py-2',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <span className="text-sm text-[var(--color-on-surface-secondary)]">
            {selectedCount} selected
          </span>
        )}
        {children}
      </div>

      {enableColumnVisibility && (
        <div className="relative" ref={menuRef}>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-surface-sunken)]"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            aria-label="Toggle columns"
            aria-expanded={showColumnMenu}
          >
            <Columns3 className="h-3.5 w-3.5" />
            Columns
          </button>

          {showColumnMenu && (
            <div className="absolute right-0 top-full z-popover mt-1 min-w-[10rem] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-2 shadow-md">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[var(--color-surface-sunken)] cursor-pointer capitalize"
                  >
                    <input
                      type="checkbox"
                      checked={col.getIsVisible()}
                      onChange={(e) => col.toggleVisibility(e.target.checked)}
                      className="h-4 w-4"
                    />
                    {col.id}
                  </label>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
DataTableToolbar.displayName = 'DataTableToolbar';
