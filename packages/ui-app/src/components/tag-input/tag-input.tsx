import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, X, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { badgeVariants } from '@/components/badge';

export interface TagInputOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TagInputProps {
  options?: TagInputOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  creatable?: boolean;
  maxTags?: number;
  maxDisplayedTags?: number;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
}

export const TagInput = React.forwardRef<HTMLButtonElement, TagInputProps>(
  (
    {
      options = [],
      value = [],
      onValueChange,
      placeholder = 'Select...',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No results found.',
      disabled,
      className,
      creatable = false,
      maxTags,
      maxDisplayedTags,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [focusedTagIndex, setFocusedTagIndex] = React.useState<number | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isMaxReached = maxTags !== undefined && value.length >= maxTags;

    const displayedTags = maxDisplayedTags !== undefined
      ? value.slice(0, maxDisplayedTags)
      : value;
    const overflowCount = maxDisplayedTags !== undefined
      ? Math.max(0, value.length - maxDisplayedTags)
      : 0;

    const getLabel = (val: string) => {
      const opt = options.find((o) => o.value === val);
      return opt?.label ?? val;
    };

    const handleSelect = (selectedValue: string) => {
      if (value.includes(selectedValue)) {
        onValueChange?.(value.filter((v) => v !== selectedValue));
      } else if (!isMaxReached) {
        onValueChange?.([...value, selectedValue]);
      }
      setSearch('');
      setFocusedTagIndex(null);
    };

    const handleRemove = (val: string) => {
      onValueChange?.(value.filter((v) => v !== val));
      setFocusedTagIndex(null);
    };

    const handleCreate = () => {
      const trimmed = search.trim();
      if (trimmed && !value.includes(trimmed) && !isMaxReached) {
        onValueChange?.([...value, trimmed]);
        setSearch('');
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && search === '' && value.length > 0) {
        if (focusedTagIndex !== null) {
          const newValue = [...value];
          newValue.splice(focusedTagIndex, 1);
          onValueChange?.(newValue);
          setFocusedTagIndex(null);
        } else {
          setFocusedTagIndex(value.length - 1);
        }
        e.preventDefault();
      } else if (e.key === 'Escape' && focusedTagIndex !== null) {
        setFocusedTagIndex(null);
      } else if (focusedTagIndex !== null) {
        setFocusedTagIndex(null);
      }
    };

    const showCreate =
      creatable &&
      search.trim() !== '' &&
      !options.some((o) => o.label.toLowerCase() === search.trim().toLowerCase()) &&
      !value.includes(search.trim()) &&
      !isMaxReached;

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          ref={ref}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 py-1 text-sm text-[var(--color-on-surface)] transition-colors duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-error-500 aria-[invalid=true]:focus-visible:ring-error-500',
            'touch:min-h-[--touch-target-min]',
            className,
          )}
          {...props}
        >
          {displayedTags.map((val, index) => (
            <span
              key={val}
              className={cn(
                badgeVariants({ variant: 'outline' }),
                'h-6 gap-1 rounded-md px-2 text-xs',
                focusedTagIndex === index && 'ring-2 ring-primary-500',
              )}
            >
              {getLabel(val)}
              <button
                type="button"
                aria-label={`Remove ${getLabel(val)}`}
                className="ml-0.5 rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(val);
                }}
                onKeyDown={(e) => e.stopPropagation()}
                tabIndex={-1}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          {overflowCount > 0 && (
            <span
              className={cn(
                badgeVariants({ variant: 'outline' }),
                'h-6 rounded-md px-2 text-xs',
              )}
            >
              +{overflowCount}
            </span>
          )}
          {value.length === 0 && (
            <span className="text-[var(--color-on-surface-muted)]">
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="z-popover w-[var(--radix-popover-trigger-width)] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-0 shadow-md animate-in fade-in-0 zoom-in-95"
            sideOffset={4}
            align="start"
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
          >
            <Command shouldFilter>
              <Command.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="flex h-9 w-full border-b border-[var(--color-border)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--color-on-surface-muted)]"
              />
              <Command.List className="max-h-60 overflow-auto p-1">
                <Command.Empty className="px-2 py-6 text-center text-sm text-[var(--color-on-surface-muted)]">
                  {!showCreate && emptyMessage}
                </Command.Empty>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                      'data-[selected=true]:bg-[var(--color-surface-muted)]',
                      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                    )}
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      {value.includes(option.value) && (
                        <Check className="size-3.5" />
                      )}
                    </span>
                    {option.label}
                  </Command.Item>
                ))}
                {showCreate && (
                  <Command.Item
                    value={`create:${search.trim()}`}
                    onSelect={handleCreate}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                      'data-[selected=true]:bg-[var(--color-surface-muted)]',
                    )}
                  >
                    Create &ldquo;{search.trim()}&rdquo;
                  </Command.Item>
                )}
              </Command.List>
            </Command>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
TagInput.displayName = 'TagInput';
