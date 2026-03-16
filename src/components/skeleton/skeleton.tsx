import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-[--color-skeleton]', className)}
      {...props}
    />
  ),
);
Skeleton.displayName = 'Skeleton';
