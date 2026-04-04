import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/table';
import { Checkbox } from '@/components/checkbox';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

export type DataTableVariant = 'rows' | 'grid';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  variant?: DataTableVariant;
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  stickyColumns?: number;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  emptyState?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function DataTable<TData>({
  columns,
  data,
  variant = 'rows',
  enableSorting = false,
  enableRowSelection = false,
  enableColumnVisibility = false,
  enablePagination = false,
  pageSize = 10,
  pageSizeOptions,
  stickyColumns = 0,
  onRowSelectionChange,
  emptyState,
  className,
  'aria-label': ariaLabel,
}: DataTableProps<TData>) {
  const isGrid = variant === 'grid';
  const gridCellClass = isGrid
    ? 'border-r border-[var(--color-border)] last:border-r-0'
    : '';
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const headerRowRef = React.useRef<HTMLTableRowElement>(null);
  const [stickyOffsets, setStickyOffsets] = React.useState<number[]>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const allColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectColumn: ColumnDef<TData, unknown> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    enableRowSelection,
    initialState: { pagination: { pageSize } },
  });

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onRowSelectionChange]);

  React.useEffect(() => {
    if (stickyColumns > 0 && headerRowRef.current) {
      const ths = headerRowRef.current.querySelectorAll('th');
      const offsets: number[] = [];
      let left = 0;
      for (let i = 0; i < stickyColumns && i < ths.length; i++) {
        offsets.push(left);
        left += ths[i].offsetWidth;
      }
      setStickyOffsets(offsets);
    }
  }, [stickyColumns, columnVisibility]);

  const getStickyStyle = (colIndex: number): React.CSSProperties | undefined => {
    if (colIndex >= stickyColumns || stickyOffsets.length === 0) return undefined;
    return {
      position: 'sticky',
      left: stickyOffsets[colIndex] ?? 0,
      zIndex: 1,
    };
  };

  const stickyCellClass = (colIndex: number) =>
    colIndex < stickyColumns
      ? 'bg-[var(--color-surface)] [tr:hover>&]:bg-[var(--color-surface-muted)] [tr[data-state=selected]>&]:bg-[var(--color-surface-accent)]'
      : '';

  const stickyHeadClass = (colIndex: number) =>
    colIndex < stickyColumns
      ? 'bg-[var(--color-surface-muted)]'
      : '';

  const showToolbar = enableRowSelection || enableColumnVisibility;

  return (
    <div className={cn('rounded-md border border-[var(--color-border)]', className)}>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          enableColumnVisibility={enableColumnVisibility}
        />
      )}

      <Table aria-label={ariaLabel}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} ref={headerRowRef}>
              {headerGroup.headers.map((header, colIndex) => (
                <TableHead key={header.id} className={cn(gridCellClass, stickyHeadClass(colIndex))} style={getStickyStyle(colIndex)}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      className="flex items-center gap-1 -ml-2 px-2 py-1 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors duration-fast"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={`Sort by ${typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : header.column.id}`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <ChevronsUpDown
                        className={cn(
                          'h-3.5 w-3.5 shrink-0',
                          header.column.getIsSorted() ? 'opacity-100' : 'opacity-30',
                        )}
                      />
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                {...(enableRowSelection && {
                  onClick: () => row.toggleSelected(),
                  className: 'cursor-pointer',
                })}
              >
                {row.getVisibleCells().map((cell, colIndex) => (
                  <TableCell key={cell.id} className={cn(gridCellClass, stickyCellClass(colIndex))} style={getStickyStyle(colIndex)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={allColumns.length}
                className="h-24 text-center"
              >
                {emptyState ?? 'No results.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {enablePagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
DataTable.displayName = 'DataTable';
