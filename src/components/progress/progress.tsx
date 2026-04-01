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

const floatingBubbleVariants: Record<
  NonNullable<VariantProps<typeof progressVariants>['variant']>,
  string
> = {
  default: 'bg-primary-600 dark:bg-primary-400',
  success: 'bg-success-600 dark:bg-success-400',
  warning: 'bg-warning-600 dark:bg-warning-400',
  error: 'bg-error-600 dark:bg-error-400',
  info: 'bg-info-600 dark:bg-info-400',
};

const floatingArrowVariants: Record<
  NonNullable<VariantProps<typeof progressVariants>['variant']>,
  string
> = {
  default: 'border-t-primary-600 dark:border-t-primary-400',
  success: 'border-t-success-600 dark:border-t-success-400',
  warning: 'border-t-warning-600 dark:border-t-warning-400',
  error: 'border-t-error-600 dark:border-t-error-400',
  info: 'border-t-info-600 dark:border-t-info-400',
};

const markerVariants: Record<
  NonNullable<VariantProps<typeof progressVariants>['variant']>,
  string
> = {
  default: 'border-primary-500',
  success: 'border-success-500',
  warning: 'border-warning-500',
  error: 'border-error-500',
  info: 'border-info-500',
};

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showLabel?: boolean | ((value: number | null | undefined) => React.ReactNode);
  /** @default 'right' */
  labelPosition?: 'right' | 'top' | 'floating';
  /** Show a dot marker at the progress edge */
  showMarker?: boolean;
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
      showMarker,
      ...props
    },
    ref,
  ) => {
    const isIndeterminate = value === null || value === undefined;
    const clampedValue = isIndeterminate
      ? null
      : Math.min(max, Math.max(0, value));
    const percent = isIndeterminate ? 0 : (clampedValue! / max) * 100;

    const resolvedVariant = variant ?? 'default';

    const labelContent = showLabel
      ? typeof showLabel === 'function'
        ? showLabel(clampedValue)
        : isIndeterminate
          ? null
          : `${Math.round(clampedValue!)}%`
      : null;

    const isFloating = labelPosition === 'floating' && labelContent && !isIndeterminate;
    const hasMarker = showMarker && !isIndeterminate;

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
          style={isIndeterminate ? undefined : { width: `${percent}%` }}
        />
      </ProgressPrimitive.Root>
    );

    // Floating bubble or marker require a wrapper with relative positioning
    if (isFloating || hasMarker) {
      return (
        <div className="relative">
          {/* Floating bubble label */}
          {isFloating && (
            <div
              className="absolute bottom-full mb-2 transition-[left] duration-normal ease-default"
              style={{ left: `${percent}%` }}
              aria-hidden="true"
            >
              <div className="relative -translate-x-1/2">
                <span
                  className={cn(
                    'block rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums text-white whitespace-nowrap shadow-sm',
                    floatingBubbleVariants[resolvedVariant],
                  )}
                >
                  {labelContent}
                </span>
                <div
                  className={cn(
                    'mx-auto h-0 w-0 border-x-4 border-t-4 border-x-transparent',
                    floatingArrowVariants[resolvedVariant],
                  )}
                />
              </div>
            </div>
          )}
          {bar}
          {/* Dot marker at progress edge */}
          {hasMarker && (
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-[left] duration-normal ease-default pointer-events-none"
              style={{ left: `${percent}%` }}
              aria-hidden="true"
            >
              <div
                className={cn(
                  'h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 bg-white shadow-sm dark:bg-[var(--color-surface-raised)]',
                  markerVariants[resolvedVariant],
                )}
              />
            </div>
          )}
        </div>
      );
    }

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

    // right (default)
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
