import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-[var(--container-sm)]',
      md: 'max-w-[var(--container-md)]',
      lg: 'max-w-[var(--container-lg)]',
      xl: 'max-w-[var(--container-xl)]',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} className={cn(containerVariants({ size }), className)} {...props} />
  ),
);
Container.displayName = 'Container';
