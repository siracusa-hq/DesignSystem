import type { Breakpoint } from '@/hooks/use-breakpoint';

/**
 * Per-column mobile behavior metadata.
 * Attach to ColumnDef.meta to control responsive behavior.
 *
 * @example
 * ```ts
 * const columns: ColumnDef<T>[] = [
 *   { accessorKey: 'name', header: 'Name' },
 *   { accessorKey: 'email', header: 'Email', meta: { responsive: 'md', popIn: true } },
 *   { accessorKey: 'role', header: 'Role', meta: { responsive: 'lg' } },
 * ];
 * ```
 */
export interface DataTableColumnMeta {
  /** Minimum breakpoint at which this column is visible in table mode. */
  responsive?: Breakpoint;
  /** When hidden by responsive, show as inline label-value in the row. */
  popIn?: boolean;
  /** Label for card/pop-in view. Falls back to column header string. */
  mobileLabel?: string;
  /** Ordering in card view (lower = first). */
  cardPriority?: number;
  /** Exclude from card view entirely. */
  hideInCardView?: boolean;
}

export type DataTableMobileDisplay = 'table' | 'cards';
