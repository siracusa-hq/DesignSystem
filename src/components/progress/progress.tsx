import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]',
  {
    variants: {
      variant: {
        default: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      size: {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

const progressIndicatorVariants = cva(
  'h-full rounded-full transition-[width] duration-normal ease-default',
  {
    variants: {
      variant: {
        default: 'bg-primary-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
        info: 'bg-info-500',
      },
      indeterminate: {
        true: 'w-1/3 animate-[progress-indeterminate_2s_ease-in-out_infinite]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      indeterminate: false,
    },
  },
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showLabel?: boolean | ((value: number | null | undefined) => React.ReactNode);
  labelPosition?: 'right' | 'top';
}

export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      variant,
      size,
      value,
      max = 100,
      showLabel,
      labelPosition = 'right',
      ...props
    },
    ref,
  ) => {
    const isIndeterminate = value === null || value === undefined;
    const clampedValue = isIndeterminate
      ? null
      : Math.min(max, Math.max(0, value));

    const labelContent = showLabel
      ? typeof showLabel === 'function'
        ? showLabel(clampedValue)
        : isIndeterminate
          ? null
          : `${Math.round(clampedValue!)}%`
      : null;

    const bar = (
      <ProgressPrimitive.Root
        ref={ref}
        value={clampedValue}
        max={max}
        className={cn(progressVariants({ variant, size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorVariants({
              variant,
              indeterminate: isIndeterminate,
            }),
          )}
          style={isIndeterminate ? undefined : { width: `${(clampedValue! / max) * 100}%` }}
        />
      </ProgressPrimitive.Root>
    );

    if (!labelContent) return bar;

    if (labelPosition === 'top') {
      return (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            {labelContent}
          </span>
          {bar}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">{bar}</div>
        <span className="shrink-0 text-sm font-medium tabular-nums text-[var(--color-on-surface-secondary)]">
          {labelContent}
        </span>
      </div>
    );
  },
);
Progress.displayName = 'Progress';
