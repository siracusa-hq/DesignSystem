import * as React from 'react';
import type { Table } from '@tanstack/react-table';
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
          <span className="text-sm text-neutral-600">
            {selectedCount} selected
          </span>
        )}
        {children}
      </div>

      {enableColumnVisibility && (
        <div className="relative" ref={menuRef}>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            aria-label="Toggle columns"
            aria-expanded={showColumnMenu}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18M3 12h18" />
            </svg>
            Columns
          </button>

          {showColumnMenu && (
            <div className="absolute right-0 top-full z-popover mt-1 min-w-[10rem] rounded-md border border-neutral-200 bg-white p-2 shadow-md">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-neutral-50 cursor-pointer capitalize"
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
