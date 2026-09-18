import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { VariantProps } from 'class-variance-authority';
import { inputVariants } from '@/components/input';
import { Spinner } from '@/components/spinner';
import { cn } from '@/lib/cn';

/**
 * 非同期の入力補完（typeahead）。
 *
 * Combobox（選択専用）と違い、**自由入力を保ったまま**候補を出す。候補は `loadOptions` で
 * 外から非同期に供給する（デザインシステムは通信を知らない）。
 *
 * - 打鍵ごとに叩かない: `debounceMs` の間引き・`minChars` 未満は照会しない・
 *   直前の照会は `AbortSignal` で取り消し・同じ文字列はコンポーネント内で使い回す
 * - 候補を選ぶと入力欄に `label` を反映し `onSelect` を呼ぶ。選ばなくても入力はそのまま有効
 * - WAI-ARIA combobox（list autocomplete）: ↑↓ で候補移動・Enter で確定・Esc で閉じる
 */
export interface AutocompleteOption<T = unknown> {
  /** 一意キー */
  value: string;
  /** 選択時に入力欄へ反映する文字列 */
  label: string;
  /** 候補行の補足（住所など）。`renderOption` 未指定時に薄字で表示 */
  description?: string;
  disabled?: boolean;
  /** 付随データ。`onSelect` にそのまま渡る */
  data?: T;
}

export interface AutocompleteProps<T = unknown> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onSelect' | 'size'
> {
  /** 入力欄の文字列（制御コンポーネント） */
  value: string;
  onValueChange: (value: string) => void;
  /** 候補の供給。`signal` は次の照会が始まったときに abort される */
  loadOptions: (query: string, signal: AbortSignal) => Promise<AutocompleteOption<T>[]>;
  onSelect?: (option: AutocompleteOption<T>) => void;
  renderOption?: (option: AutocompleteOption<T>, state: { active: boolean }) => React.ReactNode;
  /** 照会を始める最低文字数（既定 2） */
  minChars?: number;
  /** 間引き（既定 300ms） */
  debounceMs?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  size?: VariantProps<typeof inputVariants>['size'];
  listClassName?: string;
}

type Status = 'idle' | 'loading' | 'ready' | 'error';

function AutocompleteInner<T>(
  {
    value,
    onValueChange,
    loadOptions,
    onSelect,
    renderOption,
    minChars = 2,
    debounceMs = 300,
    emptyMessage = '該当する候補がありません（このまま入力を続けられます）',
    loadingMessage = '検索中…',
    errorMessage = '候補の取得に失敗しました',
    size,
    listClassName,
    className,
    disabled,
    onKeyDown,
    onBlur,
    onFocus,
    ...props
  }: AutocompleteProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const listId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<AutocompleteOption<T>[]>([]);
  const [status, setStatus] = React.useState<Status>('idle');
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const requestIdRef = React.useRef(0);
  const cacheRef = React.useRef(new Map<string, AutocompleteOption<T>[]>());
  /** 直近の value 変更がユーザーの打鍵によるものか（選択・外部反映では照会しない） */
  const typedRef = React.useRef(false);
  const loadOptionsRef = React.useRef(loadOptions);
  loadOptionsRef.current = loadOptions;

  const query = value.trim();

  const run = React.useCallback(async (q: string) => {
    const cached = cacheRef.current.get(q);
    if (cached) {
      setOptions(cached);
      setStatus('ready');
      setActiveIndex(cached.length > 0 ? 0 : -1);
      setOpen(true);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;
    setStatus('loading');
    setOpen(true);
    try {
      const result = await loadOptionsRef.current(q, controller.signal);
      if (requestId !== requestIdRef.current) return; // 古い応答は捨てる
      cacheRef.current.set(q, result);
      setOptions(result);
      setStatus('ready');
      setActiveIndex(result.length > 0 ? 0 : -1);
    } catch {
      if (controller.signal.aborted || requestId !== requestIdRef.current) return;
      setOptions([]);
      setStatus('error');
      setActiveIndex(-1);
    }
  }, []);

  // 打鍵の間引き。minChars 未満なら閉じる。
  React.useEffect(() => {
    if (!typedRef.current) return;
    if (query.length < minChars) {
      abortRef.current?.abort();
      requestIdRef.current += 1;
      setOptions([]);
      setStatus('idle');
      setOpen(false);
      return;
    }
    const timer = setTimeout(() => void run(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, minChars, debounceMs, run]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  function select(option: AutocompleteOption<T>) {
    if (option.disabled) return;
    typedRef.current = false;
    onValueChange(option.label);
    onSelect?.(option);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    switch (event.key) {
      case 'ArrowDown':
        if (!open && options.length > 0) {
          setOpen(true);
        } else if (options.length > 0) {
          setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (open && options.length > 0) {
          setActiveIndex((i) => Math.max(i - 1, 0));
          event.preventDefault();
        }
        break;
      case 'Enter': {
        const option = open ? options[activeIndex] : undefined;
        if (option) {
          event.preventDefault();
          select(option);
        }
        break;
      }
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  }

  const showList = open && status !== 'idle';
  const optionId = (index: number) => `${listId}-option-${index}`;
  const activeOption = options[activeIndex];

  return (
    <PopoverPrimitive.Root open={showList} onOpenChange={(next) => !next && setOpen(false)}>
      <PopoverPrimitive.Anchor asChild>
        <div ref={anchorRef} className="relative w-full">
          <input
            ref={ref}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={showList ? listId : undefined}
            aria-activedescendant={showList && activeOption ? optionId(activeIndex) : undefined}
            autoComplete="off"
            spellCheck={false}
            value={value}
            disabled={disabled}
            className={cn(inputVariants({ size }), status === 'loading' && 'pr-9', className)}
            onChange={(event) => {
              typedRef.current = true;
              onValueChange(event.target.value);
            }}
            onFocus={(event) => {
              onFocus?.(event);
              if (status !== 'idle' && query.length >= minChars) setOpen(true);
            }}
            onBlur={(event) => {
              onBlur?.(event);
              setOpen(false);
            }}
            onKeyDown={handleKeyDown}
            {...props}
          />
          {status === 'loading' && (
            <Spinner
              size="sm"
              className="text-[var(--color-on-surface-muted)]"
              // 入力欄の右端で回す。ラベルは Spinner 既定（Loading）
              style={{ position: 'absolute', right: '0.625rem', top: '50%', marginTop: '-0.5rem' }}
            />
          )}
        </div>
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          // フォーカスは入力欄に置いたまま候補を出す（combobox パターン）
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (anchorRef.current?.contains(event.target as Node)) event.preventDefault();
          }}
          onFocusOutside={(event) => {
            if (anchorRef.current?.contains(event.target as Node)) event.preventDefault();
          }}
          className={cn(
            'z-popover w-[var(--radix-popover-trigger-width)] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-1 shadow-md outline-none animate-in fade-in-0 zoom-in-95',
            listClassName,
          )}
        >
          {status === 'loading' && options.length === 0 && (
            <div className="px-2 py-3 text-center text-sm text-[var(--color-on-surface-muted)]">
              {loadingMessage}
            </div>
          )}
          {status === 'error' && (
            <div role="alert" className="px-2 py-3 text-center text-sm text-error-600">
              {errorMessage}
            </div>
          )}
          {status === 'ready' && options.length === 0 && (
            <div className="px-2 py-3 text-center text-sm text-[var(--color-on-surface-muted)]">
              {emptyMessage}
            </div>
          )}
          {options.length > 0 && (
            <ul id={listId} role="listbox" className="max-h-72 overflow-auto">
              {options.map((option, index) => {
                const active = index === activeIndex;
                return (
                  <li
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={active}
                    aria-disabled={option.disabled || undefined}
                    className={cn(
                      'cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none',
                      active && 'bg-[var(--color-surface-muted)]',
                      option.disabled && 'pointer-events-none opacity-50',
                      'touch:min-h-[--touch-target-min]',
                    )}
                    // mousedown で preventDefault し、入力欄のフォーカス（＝blur で閉じる）を保つ
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(option)}
                  >
                    {renderOption ? (
                      renderOption(option, { active })
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-[var(--color-on-surface)]">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-[var(--color-on-surface-muted)]">
                            {option.description}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export const Autocomplete = React.forwardRef(AutocompleteInner) as (<T = unknown>(
  props: AutocompleteProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => React.ReactElement) & { displayName?: string };
Autocomplete.displayName = 'Autocomplete';
