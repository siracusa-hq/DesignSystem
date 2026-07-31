import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const descriptionListVariants = cva('', {
  variants: {
    direction: {
      horizontal: '',
      vertical: '',
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});

export interface DescriptionListProps
  extends React.HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof descriptionListVariants> {}

export const DescriptionList = React.forwardRef<
  HTMLDListElement,
  DescriptionListProps
>(({ className, direction, ...props }, ref) => (
  <dl
    ref={ref}
    data-direction={direction ?? 'horizontal'}
    className={cn('divide-y divide-[var(--color-border)]', className)}
    {...props}
  />
));
DescriptionList.displayName = 'DescriptionList';

export const DescriptionListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'py-3 text-sm',
      'group-data-[direction=horizontal]/dl:flex group-data-[direction=horizontal]/dl:items-baseline group-data-[direction=horizontal]/dl:gap-4',
      className,
    )}
    {...props}
  />
));
DescriptionListItem.displayName = 'DescriptionListItem';

export const DescriptionListTerm = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dt
    ref={ref}
    className={cn(
      'text-[var(--color-on-surface-muted)] font-medium',
      'min-w-[140px] shrink-0',
      className,
    )}
    {...props}
  />
));
DescriptionListTerm.displayName = 'DescriptionListTerm';

export const DescriptionListDetails = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dd
    ref={ref}
    className={cn('text-[var(--color-on-surface)]', className)}
    {...props}
  />
));
DescriptionListDetails.displayName = 'DescriptionListDetails';
