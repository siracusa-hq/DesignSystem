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

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  emptyState?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function DataTable<TData>({
  columns,
  data,
  enableSorting = false,
  enableRowSelection = false,
  enableColumnVisibility = false,
  enablePagination = false,
  pageSize = 10,
  pageSizeOptions,
  onRowSelectionChange,
  emptyState,
  className,
  'aria-label': ariaLabel,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
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

  const showToolbar = enableRowSelection || enableColumnVisibility;

  return (
    <div className={cn('rounded-md border border-[--color-border]', className)}>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          enableColumnVisibility={enableColumnVisibility}
        />
      )}

      <Table aria-label={ariaLabel}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      className="flex items-center gap-1 -ml-2 px-2 py-1 rounded-md hover:bg-[--color-surface-muted] transition-colors duration-fast"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={`Sort by ${typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : header.column.id}`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
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
                          'shrink-0',
                          header.column.getIsSorted() ? 'opacity-100' : 'opacity-30',
                        )}
                      >
                        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
                      </svg>
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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
