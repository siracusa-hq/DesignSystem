import { useMemo } from 'react';
import { BREAKPOINTS, type Breakpoint } from '@/hooks/use-breakpoint';
import type { ColumnDef } from '@tanstack/react-table';
import type { VisibilityState } from '@tanstack/react-table';
import type { DataTableColumnMeta } from './data-table.types';

const BREAKPOINT_ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

function breakpointIndex(bp: Breakpoint): number {
  return BREAKPOINT_ORDER.indexOf(bp);
}

/**
 * Computes column visibility and pop-in list based on responsive metadata.
 */
export function useResponsiveColumns<TData>(
  columns: ColumnDef<TData, unknown>[],
  currentBreakpoint: Breakpoint,
) {
  return useMemo(() => {
    const responsiveVisibility: VisibilityState = {};
    const poppedInColumnIds: string[] = [];
    const currentIndex = breakpointIndex(currentBreakpoint);

    for (const col of columns) {
      const meta = col.meta as DataTableColumnMeta | undefined;
      if (!meta?.responsive) continue;

      const colId = (col as { accessorKey?: string }).accessorKey ?? col.id;
      if (!colId) continue;

      const requiredIndex = breakpointIndex(meta.responsive);
      if (currentIndex < requiredIndex) {
        responsiveVisibility[colId] = false;
        if (meta.popIn) {
          poppedInColumnIds.push(colId);
        }
      }
    }

    return { responsiveVisibility, poppedInColumnIds };
  }, [columns, currentBreakpoint]);
}
