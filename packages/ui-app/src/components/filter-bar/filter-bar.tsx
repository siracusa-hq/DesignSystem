import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { X, ListFilter, Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/dropdown-menu/dropdown-menu';
import { cn } from '@/lib/cn';

/* ----- FilterBar ----- */

export const FilterBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-3',
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
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors duration-fast touch:min-h-[--touch-target-min]',
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
          className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-black/10 transition-colors touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]"
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
        className="inline-flex items-center text-sm text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface-secondary)] underline transition-colors touch:min-h-[--touch-target-min] touch:px-2"
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

/**
 * DropdownMenu 内で使う、ブランドカラーのチェックボックス表示を持つ項目。
 * onSelect を preventDefault してマルチセレクト中にメニューが閉じないようにする。
 */
function FilterMenuCheckboxItem({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={(e) => e.preventDefault()}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'focus:bg-[var(--color-surface-muted)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'touch:min-h-[--touch-target-min]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-fast',
          checked
            ? 'border-primary-400 bg-primary-400 text-white'
            : 'border-[var(--color-border-input)]',
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function FilterSelector({
  options,
  selected,
  onToggle,
  label = 'Filters',
  className,
}: FilterSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-surface-muted)] touch:min-h-[--touch-target-min]',
            className,
          )}
          aria-label={label}
        >
          <ListFilter className="h-3.5 w-3.5" />
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {options.map((opt) => (
          <FilterMenuCheckboxItem
            key={opt.id}
            checked={selected.includes(opt.id)}
            onCheckedChange={(checked) => onToggle(opt.id, checked)}
          >
            {opt.label}
          </FilterMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
FilterSelector.displayName = 'FilterSelector';

/* ----- FilterChipSelect ----- */

export interface FilterChipSelectProps
  extends VariantProps<typeof filterChipVariants> {
  label: string;
  /** 選択できる値の候補 */
  options: FilterOption[];
  /** 選択中の値の id 配列 */
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onRemove?: () => void;
  /** 値が未選択のときに表示するテキスト */
  placeholder?: string;
  /** マウント時にメニューを開く（FilterSelector で軸を追加した直後に値を選ばせる用途） */
  defaultOpen?: boolean;
  className?: string;
}

export function FilterChipSelect({
  label,
  options,
  selected,
  onSelectedChange,
  onRemove,
  placeholder = 'Any',
  defaultOpen,
  variant,
  className,
}: FilterChipSelectProps) {
  const selectedLabels = options
    .filter((opt) => selected.includes(opt.id))
    .map((opt) => opt.label);
  const display =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.length} selected`;

  function handleToggle(id: string, checked: boolean) {
    onSelectedChange(
      checked ? [...selected, id] : selected.filter((s) => s !== id),
    );
  }

  return (
    <span className={cn(filterChipVariants({ variant }), className)}>
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1 ring-offset-[var(--color-ring-offset)]"
          >
            <span className="text-xs opacity-70">{label}:</span>
            <span>{display}</span>
            <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          {options.map((opt) => (
            <FilterMenuCheckboxItem
              key={opt.id}
              checked={selected.includes(opt.id)}
              onCheckedChange={(checked) => handleToggle(opt.id, checked)}
            >
              {opt.label}
            </FilterMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-black/10 transition-colors touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]"
          aria-label={`Remove ${label} filter`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
FilterChipSelect.displayName = 'FilterChipSelect';
