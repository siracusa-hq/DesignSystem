import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ========================================================================
   DashboardGrid — 12-column CSS Grid container for dashboard layouts
   ======================================================================== */

export const dashboardGridVariants = cva('grid grid-cols-12', {
  variants: {
    gap: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

export interface DashboardGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardGridVariants> {
  /** Base row height in pixels. Panels spanning N rows get minHeight = N * rowHeight. Default: 80 */
  rowHeight?: number;
}

export const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ className, gap, rowHeight = 80, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(dashboardGridVariants({ gap }), className)}
      style={
        {
          '--dashboard-row-height': `${rowHeight}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  ),
);
DashboardGrid.displayName = 'DashboardGrid';

/* ========================================================================
   DashboardSection — Semantic grouping within a DashboardGrid
   ======================================================================== */

export interface DashboardSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Optional section heading */
  title?: string;
  /** Optional description below the title */
  description?: string;
}

export const DashboardSection = React.forwardRef<HTMLElement, DashboardSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    const headingId = React.useId();

    return (
      <section
        ref={ref}
        className={cn(
          'col-span-12 grid grid-cols-subgrid gap-[inherit]',
          className,
        )}
        {...(title ? { role: 'region', 'aria-labelledby': headingId } : {})}
        {...props}
      >
        {title && (
          <div className="col-span-12">
            <h2
              id={headingId}
              className="text-sm font-semibold text-[var(--color-on-surface)]"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </section>
    );
  },
);
DashboardSection.displayName = 'DashboardSection';

/* ========================================================================
   DashboardPanel — Grid item with responsive colSpan / rowSpan
   ======================================================================== */

/** Responsive colSpan: a number or breakpoint-keyed object */
export type ResponsiveColSpan = number | {
  default: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export interface DashboardPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Columns to span (1-12). Supports responsive object. Default: 12 */
  colSpan?: ResponsiveColSpan;
  /** Rows to span. Works with parent's rowHeight for minHeight. Default: 1 */
  rowSpan?: number;
  /** Minimum columns hint for drag-and-drop constraints (Layer 2). */
  minColSpan?: number;
}

/* Static class lookup maps — ensures Tailwind compiler detects all classes */
const COL_SPAN: Record<number, string> = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3',
  4: 'col-span-4', 5: 'col-span-5', 6: 'col-span-6',
  7: 'col-span-7', 8: 'col-span-8', 9: 'col-span-9',
  10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
};

const SM_COL_SPAN: Record<number, string> = {
  1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3',
  4: 'sm:col-span-4', 5: 'sm:col-span-5', 6: 'sm:col-span-6',
  7: 'sm:col-span-7', 8: 'sm:col-span-8', 9: 'sm:col-span-9',
  10: 'sm:col-span-10', 11: 'sm:col-span-11', 12: 'sm:col-span-12',
};

const MD_COL_SPAN: Record<number, string> = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3',
  4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
  7: 'md:col-span-7', 8: 'md:col-span-8', 9: 'md:col-span-9',
  10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
};

const LG_COL_SPAN: Record<number, string> = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3',
  4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6',
  7: 'lg:col-span-7', 8: 'lg:col-span-8', 9: 'lg:col-span-9',
  10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
};

const XL_COL_SPAN: Record<number, string> = {
  1: 'xl:col-span-1', 2: 'xl:col-span-2', 3: 'xl:col-span-3',
  4: 'xl:col-span-4', 5: 'xl:col-span-5', 6: 'xl:col-span-6',
  7: 'xl:col-span-7', 8: 'xl:col-span-8', 9: 'xl:col-span-9',
  10: 'xl:col-span-10', 11: 'xl:col-span-11', 12: 'xl:col-span-12',
};

function resolveColSpanClasses(colSpan: ResponsiveColSpan): string {
  if (typeof colSpan === 'number') {
    return COL_SPAN[colSpan] ?? 'col-span-12';
  }

  const classes: string[] = [];
  classes.push(COL_SPAN[colSpan.default] ?? 'col-span-12');
  if (colSpan.sm) classes.push(SM_COL_SPAN[colSpan.sm] ?? '');
  if (colSpan.md) classes.push(MD_COL_SPAN[colSpan.md] ?? '');
  if (colSpan.lg) classes.push(LG_COL_SPAN[colSpan.lg] ?? '');
  if (colSpan.xl) classes.push(XL_COL_SPAN[colSpan.xl] ?? '');
  return classes.filter(Boolean).join(' ');
}

export const DashboardPanel = React.forwardRef<HTMLDivElement, DashboardPanelProps>(
  ({ className, colSpan = 12, rowSpan, minColSpan, style, children, ...props }, ref) => {
    const rowSpanStyle: React.CSSProperties = rowSpan
      ? {
          gridRow: `span ${rowSpan}`,
          minHeight: `calc(${rowSpan} * var(--dashboard-row-height, 80px))`,
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(resolveColSpanClasses(colSpan), className)}
        style={{ ...rowSpanStyle, ...style }}
        {...(minColSpan ? { 'data-min-col-span': minColSpan } : {})}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DashboardPanel.displayName = 'DashboardPanel';
