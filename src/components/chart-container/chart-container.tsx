import * as React from 'react';
import { cn } from '@/lib/cn';

/* ----- ChartContainer ----- */

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Chart title */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Actions rendered in the header (e.g. period selector, export button) */
  actions?: React.ReactNode;
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, title, description, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-sm',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 p-4 sm:p-5 pb-0">
        <div>
          <h3 className="text-sm font-semibold leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  ),
);
ChartContainer.displayName = 'ChartContainer';
