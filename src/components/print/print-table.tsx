import * as React from 'react';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------
   PrintTable — Table optimized for PDF reports
   No overflow wrapper, no hover states, clear borders
   ---------------------------------------------------------------- */

export interface PrintTableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

const PrintTable = React.forwardRef<HTMLTableElement, PrintTableProps>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn('w-full border-collapse text-[9pt]', className)}
      {...props}
    />
  ),
);
PrintTable.displayName = 'PrintTable';

/* ----------------------------------------------------------------
   PrintTableHeader
   ---------------------------------------------------------------- */

export interface PrintTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const PrintTableHeader = React.forwardRef<HTMLTableSectionElement, PrintTableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('', className)} {...props} />
  ),
);
PrintTableHeader.displayName = 'PrintTableHeader';

/* ----------------------------------------------------------------
   PrintTableBody
   ---------------------------------------------------------------- */

export interface PrintTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const PrintTableBody = React.forwardRef<HTMLTableSectionElement, PrintTableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('', className)} {...props} />
  ),
);
PrintTableBody.displayName = 'PrintTableBody';

/* ----------------------------------------------------------------
   PrintTableFooter
   ---------------------------------------------------------------- */

export interface PrintTableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const PrintTableFooter = React.forwardRef<HTMLTableSectionElement, PrintTableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('', className)} {...props} />
  ),
);
PrintTableFooter.displayName = 'PrintTableFooter';

/* ----------------------------------------------------------------
   PrintTableRow
   ---------------------------------------------------------------- */

export interface PrintTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const PrintTableRow = React.forwardRef<HTMLTableRowElement, PrintTableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('[break-inside:avoid]', className)}
      {...props}
    />
  ),
);
PrintTableRow.displayName = 'PrintTableRow';

/* ----------------------------------------------------------------
   PrintTableHead — Header cell
   ---------------------------------------------------------------- */

export interface PrintTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

const PrintTableHead = React.forwardRef<HTMLTableCellElement, PrintTableHeadProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'py-1.5 px-2 font-semibold text-neutral-700 bg-neutral-50 border-b-2 border-neutral-300 text-[8pt]',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
      {...props}
    />
  ),
);
PrintTableHead.displayName = 'PrintTableHead';

/* ----------------------------------------------------------------
   PrintTableCell — Body cell
   ---------------------------------------------------------------- */

export interface PrintTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

const PrintTableCell = React.forwardRef<HTMLTableCellElement, PrintTableCellProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'py-1.5 px-2 border-b border-neutral-200',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
      {...props}
    />
  ),
);
PrintTableCell.displayName = 'PrintTableCell';

export {
  PrintTable,
  PrintTableHeader,
  PrintTableBody,
  PrintTableFooter,
  PrintTableRow,
  PrintTableHead,
  PrintTableCell,
};
