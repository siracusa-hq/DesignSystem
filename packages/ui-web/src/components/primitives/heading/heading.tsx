import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const headingVariants = cva('font-bold text-[var(--color-on-surface)]', {
  variants: {
    size: {
      'display-2xl': 'text-display-lg md:text-display-xl lg:text-display-2xl tracking-[-0.04em]',
      'display-xl': 'text-display-md md:text-display-lg lg:text-display-xl tracking-[-0.035em]',
      'display-lg': 'text-display-sm md:text-display-md lg:text-display-lg tracking-[-0.03em]',
      'display-md': 'text-heading-lg md:text-display-sm lg:text-display-md tracking-[-0.025em]',
      'display-sm': 'text-heading-md md:text-heading-lg lg:text-display-sm tracking-tight',
      'heading-lg': 'text-heading-md md:text-heading-lg tracking-tight',
      'heading-md': 'text-heading-sm md:text-heading-md tracking-tight',
      'heading-sm': 'text-heading-sm tracking-tight',
    },
  },
  defaultVariants: {
    size: 'display-md',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, as: Tag = 'h2', ...props }, ref) => (
    <Tag ref={ref} className={cn(headingVariants({ size }), className)} {...props} />
  ),
);
Heading.displayName = 'Heading';
