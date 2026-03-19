import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors touch:px-3 touch:py-1 touch:text-sm',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
        success: 'bg-success-100 text-success-700 dark:bg-success-950 dark:text-success-300',
        warning: 'bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-300',
        error: 'bg-error-100 text-error-700 dark:bg-error-950 dark:text-error-300',
        info: 'bg-info-100 text-info-700 dark:bg-info-950 dark:text-info-300',
        outline: 'border border-[var(--color-border-input)] text-[var(--color-on-surface-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
