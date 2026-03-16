import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { cn } from '@/lib/cn';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50],
  className,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 py-3 text-sm text-[--color-on-surface-secondary]',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="h-8 rounded-md border border-[--color-border-input] bg-[--color-surface-raised] px-2 text-sm"
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <span>
          {totalRows > 0 ? `${from}-${to} of ${totalRows}` : '0 results'}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[--color-border-input] bg-[--color-surface-raised] transition-colors hover:bg-[--color-surface-sunken] disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[--color-border-input] bg-[--color-surface-raised] transition-colors hover:bg-[--color-surface-sunken] disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
DataTablePagination.displayName = 'DataTablePagination';
