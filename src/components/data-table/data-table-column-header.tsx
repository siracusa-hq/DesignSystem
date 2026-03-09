import * as React from 'react';
import type { Column } from '@tanstack/react-table';
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
        'flex items-center gap-1 -ml-2 px-2 py-1 rounded-md hover:bg-neutral-100 transition-colors duration-fast',
        className,
      )}
      onClick={() => column.toggleSorting(sorted === 'asc')}
      aria-label={`Sort by ${title}`}
    >
      {title}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'shrink-0 transition-opacity',
          sorted ? 'opacity-100' : 'opacity-30',
        )}
      >
        {sorted === 'desc' ? (
          <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
        ) : sorted === 'asc' ? (
          <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
        ) : (
          <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
        )}
      </svg>
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
