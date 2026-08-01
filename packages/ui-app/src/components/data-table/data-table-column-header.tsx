import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      className={cn(
        'flex items-center gap-1 -ml-2 px-2 py-1 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors duration-fast',
        className,
      )}
      onClick={() => column.toggleSorting(sorted === 'asc')}
      aria-label={`Sort by ${title}`}
    >
      {title}
      <ChevronsUpDown
        className={cn(
          'h-3.5 w-3.5 shrink-0 transition-opacity',
          sorted ? 'opacity-100' : 'opacity-30',
        )}
      />
      {sorted === 'asc' && (
        <span className="sr-only">sorted ascending</span>
      )}
      {sorted === 'desc' && (
        <span className="sr-only">sorted descending</span>
      )}
    </button>
  );
}
DataTableColumnHeader.displayName = 'DataTableColumnHeader';
