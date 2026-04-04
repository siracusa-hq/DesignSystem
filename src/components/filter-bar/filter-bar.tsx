import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, ListFilter } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ----- FilterBar ----- */

export const FilterBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-2 rounded-lg border border-[var(--color-on-surface)] bg-[var(--color-surface-sunken)] p-3',
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
        outline: 'border border-[var(--color-border-input)] text-[var(--color-on-surface-secondary)]',
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
          <X className="h-3 w-3" />
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
        className="text-sm text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface-secondary)] underline transition-colors"
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

/* ----- FilterSelector ----- */

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterSelectorProps {
  options: FilterOption[];
  selected: string[];
  onToggle: (id: string, checked: boolean) => void;
  label?: string;
  className?: string;
}

export function FilterSelector({
  options,
  selected,
  onToggle,
  label = 'Filters',
  className,
}: FilterSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-surface-muted)]"
        onClick={() => setOpen(!open)}
        aria-label={label}
        aria-expanded={open}
      >
        <ListFilter className="h-3.5 w-3.5" />
        {label}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-popover mt-1 min-w-[10rem] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-2 shadow-md">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[var(--color-surface-sunken)] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={(e) => onToggle(opt.id, e.target.checked)}
                className="h-4 w-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
FilterSelector.displayName = 'FilterSelector';
