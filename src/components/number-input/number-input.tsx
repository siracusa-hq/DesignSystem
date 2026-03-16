import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const numberInputVariants = cva(
  'flex w-full rounded-md border border-[--color-border-input] bg-[--color-surface-raised] text-[--color-on-surface] transition-colors duration-fast focus-within:ring-2 focus-within:ring-[--color-ring] focus-within:ring-offset-2 ring-offset-[--color-ring-offset] aria-[invalid=true]:border-error-500 aria-[invalid=true]:focus-within:ring-error-500',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface NumberInputProps
  extends VariantProps<typeof numberInputVariants> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-describedby'?: string;
  required?: boolean;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      size,
      value: controlledValue,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      precision,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue != null ? formatValue(defaultValue, precision) : '',
    );

    const isControlled = controlledValue !== undefined;
    const displayValue = isControlled
      ? controlledValue != null
        ? formatValue(controlledValue, precision)
        : ''
      : internalValue;

    function formatValue(val: number, prec?: number): string {
      return prec != null ? val.toFixed(prec) : String(val);
    }

    function clamp(val: number): number {
      let result = val;
      if (min != null) result = Math.max(min, result);
      if (max != null) result = Math.min(max, result);
      return result;
    }

    function updateValue(newValue: number | undefined) {
      if (newValue != null) {
        const clamped = clamp(newValue);
        if (!isControlled) {
          setInternalValue(formatValue(clamped, precision));
        }
        onChange?.(clamped);
      } else {
        if (!isControlled) {
          setInternalValue('');
        }
        onChange?.(undefined);
      }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value;
      if (!isControlled) {
        setInternalValue(raw);
      }
      if (raw === '' || raw === '-') {
        onChange?.(undefined);
        return;
      }
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        onChange?.(num);
      }
    }

    function handleBlur() {
      const num = parseFloat(displayValue);
      if (!isNaN(num)) {
        updateValue(num);
      } else {
        updateValue(undefined);
      }
    }

    function increment() {
      const current = parseFloat(displayValue) || 0;
      updateValue(current + step);
    }

    function decrement() {
      const current = parseFloat(displayValue) || 0;
      updateValue(current - step);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
    }

    return (
      <div
        className={cn(
          numberInputVariants({ size }),
          (disabled || readOnly) && 'opacity-50 cursor-not-allowed',
          className,
        )}
        aria-invalid={props['aria-invalid']}
      >
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          className="h-full w-full bg-transparent px-3 outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {!readOnly && !disabled && (
          <div className="flex flex-col border-l border-[--color-border-input]">
            <button
              type="button"
              tabIndex={-1}
              onClick={increment}
              disabled={max != null && parseFloat(displayValue) >= max}
              className="flex flex-1 items-center justify-center px-1.5 text-[--color-on-surface-muted] hover:bg-[--color-surface-muted] disabled:opacity-30"
              aria-label="Increment"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={decrement}
              disabled={min != null && parseFloat(displayValue) <= min}
              className="flex flex-1 items-center justify-center border-t border-[--color-border-input] px-1.5 text-[--color-on-surface-muted] hover:bg-[--color-surface-muted] disabled:opacity-30"
              aria-label="Decrement"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';
