import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = '選択してください',
      searchPlaceholder = '検索...',
      emptyMessage = '見つかりませんでした',
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const selectedOption = options.find((o) => o.value === value);

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          ref={ref}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-on-surface)] transition-colors duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-error-500 aria-[invalid=true]:focus-visible:ring-error-500',
            'touch:min-h-[--touch-target-min]',
            className,
          )}
          {...props}
        >
          <span className={cn(!selectedOption && 'text-[var(--color-on-surface-muted)]')}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="z-popover w-[var(--radix-popover-trigger-width)] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-0 shadow-md animate-in fade-in-0 zoom-in-95"
            sideOffset={4}
            align="start"
          >
            <Command shouldFilter>
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder}
                className="flex h-9 w-full border-b border-[var(--color-border)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--color-on-surface-muted)]"
              />
              <Command.List className="max-h-60 overflow-auto p-1">
                <Command.Empty className="px-2 py-6 text-center text-sm text-[var(--color-on-surface-muted)]">
                  {emptyMessage}
                </Command.Empty>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => {
                      onValueChange?.(
                        option.value === value ? '' : option.value,
                      );
                      setOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                      'data-[selected=true]:bg-[var(--color-surface-muted)]',
                      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                    )}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {option.value === value && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </span>
                    {option.label}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
Combobox.displayName = 'Combobox';
