import * as React from 'react';
import { flexRender, type Row, type ColumnDef } from '@tanstack/react-table';
import { TableRow, TableCell } from '@/components/table';
import type { DataTableColumnMeta } from './data-table.types';

interface DataTablePopInRowProps<TData> {
  row: Row<TData>;
  columns: ColumnDef<TData, unknown>[];
  poppedInColumnIds: string[];
  visibleColumnCount: number;
}

function getColumnLabel<TData>(col: ColumnDef<TData, unknown>): string {
  const meta = col.meta as DataTableColumnMeta | undefined;
  if (meta?.mobileLabel) return meta.mobileLabel;
  if (typeof col.header === 'string') return col.header;
  return (col as { accessorKey?: string }).accessorKey ?? col.id ?? '';
}

export function DataTablePopInRow<TData>({
  row,
  columns,
  poppedInColumnIds,
  visibleColumnCount,
}: DataTablePopInRowProps<TData>) {
  if (poppedInColumnIds.length === 0) return null;

  const poppedColumns = columns.filter((col) => {
    const colId = (col as { accessorKey?: string }).accessorKey ?? col.id;
    return colId && poppedInColumnIds.includes(colId);
  });

  if (poppedColumns.length === 0) return null;

  return (
    <TableRow className="border-t-0 hover:bg-transparent">
      <TableCell colSpan={visibleColumnCount} className="px-4 py-2">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1">
          {poppedColumns.map((col) => {
            const colId = (col as { accessorKey?: string }).accessorKey ?? col.id ?? '';
            const cell = row.getAllCells().find((c) => c.column.id === colId);
            if (!cell) return null;

            return (
              <React.Fragment key={colId}>
                <dt className="text-xs font-medium text-[var(--color-on-surface-muted)]">
                  {getColumnLabel(col)}
                </dt>
                <dd className="text-sm text-[var(--color-on-surface)]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </dd>
              </React.Fragment>
            );
          })}
        </dl>
      </TableCell>
    </TableRow>
  );
}
