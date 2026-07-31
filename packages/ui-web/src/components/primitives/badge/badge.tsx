import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-caption font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
        secondary:
          'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        outline:
          'border border-[var(--color-border)] text-[var(--color-on-surface-secondary)]',
        new: 'bg-primary-500 text-white',
        beta: 'bg-info-100 text-info-700 dark:bg-info-950 dark:text-info-300',
        comingSoon:
          'bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-300',
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
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';
