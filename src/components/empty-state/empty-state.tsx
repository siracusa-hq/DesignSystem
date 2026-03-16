import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ----- EmptyState ----- */

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'py-8 gap-2',
        md: 'py-12 gap-3',
        lg: 'py-20 gap-4',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    />
  ),
);
EmptyState.displayName = 'EmptyState';

/* ----- EmptyStateIcon ----- */

export const EmptyStateIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-[--color-on-surface-muted] [&>svg]:h-10 [&>svg]:w-10', className)}
    {...props}
  />
));
EmptyStateIcon.displayName = 'EmptyStateIcon';

/* ----- EmptyStateTitle ----- */

export const EmptyStateTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold text-[--color-on-surface]', className)}
    {...props}
  />
));
EmptyStateTitle.displayName = 'EmptyStateTitle';

/* ----- EmptyStateDescription ----- */

export const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[--color-on-surface-muted] max-w-sm', className)}
    {...props}
  />
));
EmptyStateDescription.displayName = 'EmptyStateDescription';

/* ----- EmptyStateActions ----- */

export const EmptyStateActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 mt-2', className)}
    {...props}
  />
));
EmptyStateActions.displayName = 'EmptyStateActions';
