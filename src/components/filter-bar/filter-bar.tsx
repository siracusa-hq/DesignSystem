import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ----- FilterBar ----- */

export const FilterBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3',
      className,
    )}
    role="toolbar"
    aria-label="Filters"
    {...props}
  />
));
FilterBar.displayName = 'FilterBar';

/* ----- FilterBarGroup ----- */

export const FilterBarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2', className)}
    role="group"
    {...props}
  />
));
FilterBarGroup.displayName = 'FilterBarGroup';

/* ----- FilterChip ----- */

const filterChipVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors duration-fast',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 text-primary-700',
        outline: 'border border-neutral-300 text-neutral-700',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface FilterChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof filterChipVariants> {
  label: string;
  value: string;
  onRemove?: () => void;
}

export const FilterChip = React.forwardRef<HTMLSpanElement, FilterChipProps>(
  ({ className, variant, label, value, onRemove, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(filterChipVariants({ variant }), className)}
      {...props}
    >
      <span className="text-xs opacity-70">{label}:</span>
      <span>{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  ),
);
FilterChip.displayName = 'FilterChip';

/* ----- ActiveFilters ----- */

export interface ActiveFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClearAll?: () => void;
  clearAllLabel?: string;
}

export const ActiveFilters = React.forwardRef<
  HTMLDivElement,
  ActiveFiltersProps
>(({ className, onClearAll, clearAllLabel = 'Clear all', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-wrap items-center gap-2', className)}
    {...props}
  >
    {children}
    {onClearAll && (
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm text-neutral-500 hover:text-neutral-700 underline transition-colors"
      >
        {clearAllLabel}
      </button>
    )}
  </div>
));
ActiveFilters.displayName = 'ActiveFilters';

/* ----- FilterBarActions ----- */

export const FilterBarActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('ml-auto flex items-center gap-2', className)}
    {...props}
  />
));
FilterBarActions.displayName = 'FilterBarActions';
