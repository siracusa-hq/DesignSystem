import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const Timeline = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn('relative space-y-0', className)} {...props} />
));
Timeline.displayName = 'Timeline';

export const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('relative flex gap-4 pb-8 last:pb-0', className)}
    {...props}
  />
));
TimelineItem.displayName = 'TimelineItem';

export const timelineIconVariants = cva(
  'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
        success: 'bg-success-100 text-success-600 dark:bg-success-950 dark:text-success-400',
        error: 'bg-error-100 text-error-600 dark:bg-error-950 dark:text-error-400',
        warning: 'bg-warning-100 text-warning-600 dark:bg-warning-950 dark:text-warning-400',
        info: 'bg-info-100 text-info-600 dark:bg-info-950 dark:text-info-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface TimelineIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineIconVariants> {}

export const TimelineIcon = React.forwardRef<HTMLDivElement, TimelineIconProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(timelineIconVariants({ variant }), className)}
      {...props}
    />
  ),
);
TimelineIcon.displayName = 'TimelineIcon';

export const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      'absolute left-4 top-8 -bottom-0 w-px -translate-x-1/2 bg-[var(--color-border)]',
      className,
    )}
    {...props}
  />
));
TimelineConnector.displayName = 'TimelineConnector';

export const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 pt-1 text-sm', className)}
    {...props}
  />
));
TimelineContent.displayName = 'TimelineContent';

export const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    className={cn('text-xs text-[var(--color-on-surface-muted)]', className)}
    {...props}
  />
));
TimelineTime.displayName = 'TimelineTime';
