import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  /** 選択中の値の配列。未指定は空配列扱い */
  value?: string[];
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** トリガー内に個別表示する選択タグ数の上限。超過分は「+N」に畳む */
  maxDisplay?: number;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      value = [],
      onValueChange,
      placeholder = '選択してください',
      searchPlaceholder = '検索...',
      emptyMessage = '見つかりませんでした',
      maxDisplay = 3,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const selectedOptions = options.filter((o) => value.includes(o.value));
    const visibleTags = selectedOptions.slice(0, maxDisplay);
    const overflowCount = selectedOptions.length - visibleTags.length;

    function toggle(optionValue: string) {
      onValueChange?.(
        value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue],
      );
    }

    return (
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearch('');
        }}
      >
        <PopoverPrimitive.Trigger
          ref={ref}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-sm text-[var(--color-on-surface)] transition-colors duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-error-500 aria-[invalid=true]:focus-visible:ring-error-500',
            'touch:min-h-[--touch-target-min]',
            className,
          )}
          {...props}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-[var(--color-on-surface-muted)]">
              {placeholder}
            </span>
          ) : (
            <span className="flex flex-wrap items-center gap-1">
              {visibleTags.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700"
                >
                  {opt.label}
                </span>
              ))}
              {overflowCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-surface-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-on-surface-secondary)]">
                  +{overflowCount}
                </span>
              )}
            </span>
          )}
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
                {options.map((option) => {
                  const checked = value.includes(option.value);
                  return (
                    <Command.Item
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      // 選択してもメニューを閉じない（続けて複数選ぶ操作が主のため）
                      onSelect={() => toggle(option.value)}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                        'data-[selected=true]:bg-[var(--color-surface-muted)]',
                        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
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
                        {checked && (
                          <Check className="h-3 w-3" strokeWidth={3} />
                        )}
                      </span>
                      {option.label}
                    </Command.Item>
                  );
                })}
              </Command.List>
            </Command>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
MultiSelect.displayName = 'MultiSelect';
