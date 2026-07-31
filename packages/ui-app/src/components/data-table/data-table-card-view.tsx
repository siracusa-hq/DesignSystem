import * as React from 'react';
import { flexRender, type Row, type Table, type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { Checkbox } from '@/components/checkbox';
import type { DataTableColumnMeta } from './data-table.types';

interface DataTableCardViewProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData, unknown>[];
  enableRowSelection: boolean;
  renderCard?: (row: TData, index: number) => React.ReactNode;
  ariaLabel?: string;
}

function getColumnLabel<TData>(col: ColumnDef<TData, unknown>): string {
  const meta = col.meta as DataTableColumnMeta | undefined;
  if (meta?.mobileLabel) return meta.mobileLabel;
  if (typeof col.header === 'string') return col.header;
  return (col as { accessorKey?: string }).accessorKey ?? col.id ?? '';
}

function getCardColumns<TData>(
  columns: ColumnDef<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
  return columns
    .filter((col) => {
      if (col.id === 'select') return false;
      const meta = col.meta as DataTableColumnMeta | undefined;
      return !meta?.hideInCardView;
    })
    .sort((a, b) => {
      const pa = (a.meta as DataTableColumnMeta | undefined)?.cardPriority ?? 999;
      const pb = (b.meta as DataTableColumnMeta | undefined)?.cardPriority ?? 999;
      return pa - pb;
    });
}

export function DataTableCardView<TData>({
  table,
  columns,
  enableRowSelection,
  renderCard,
  ariaLabel,
}: DataTableCardViewProps<TData>) {
  const rows = table.getRowModel().rows;
  const cardColumns = React.useMemo(() => getCardColumns(columns), [columns]);

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-[var(--color-on-surface-muted)]">
        No results.
      </div>
    );
  }

  return (
    <div role="list" aria-label={ariaLabel} className="flex flex-col gap-3 p-3">
      {rows.map((row, index) => (
        <CardItem
          key={row.id}
          row={row}
          index={index}
          columns={cardColumns}
          enableRowSelection={enableRowSelection}
          renderCard={renderCard}
        />
      ))}
    </div>
  );
}

function CardItem<TData>({
  row,
  index,
  columns,
  enableRowSelection,
  renderCard,
}: {
  row: Row<TData>;
  index: number;
  columns: ColumnDef<TData, unknown>[];
  enableRowSelection: boolean;
  renderCard?: (row: TData, index: number) => React.ReactNode;
}) {
  if (renderCard) {
    return (
      <div role="listitem">
        {renderCard(row.original, index)}
      </div>
    );
  }

  return (
    <div
      role="listitem"
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-sm',
        row.getIsSelected() && 'ring-2 ring-primary-500',
      )}
    >
      {enableRowSelection && (
        <div className="mb-3 flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <span className="text-xs text-[var(--color-on-surface-muted)]">Select</span>
        </div>
      )}
      <dl className="space-y-0">
        {columns.map((col) => {
          const colId = (col as { accessorKey?: string }).accessorKey ?? col.id ?? '';
          const cell = row.getVisibleCells().find((c) => c.column.id === colId)
            ?? row.getAllCells().find((c) => c.column.id === colId);
          if (!cell) return null;

          return (
            <div
              key={colId}
              className="flex items-baseline justify-between gap-4 border-b border-[var(--color-border)] py-2 last:border-b-0"
            >
              <dt className="shrink-0 text-xs font-medium text-[var(--color-on-surface-muted)]">
                {getColumnLabel(col)}
              </dt>
              <dd className="text-right text-sm text-[var(--color-on-surface)]">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
