import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const dividerVariants = cva('w-full', {
  variants: {
    variant: {
      solid: 'h-px bg-[var(--color-border)]',
      gradient:
        'h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent',
      brand:
        'h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent',
      dashed: 'border-t border-dashed border-[var(--color-border)]',
    },
    spacing: {
      sm: 'my-4',
      md: 'my-8',
      lg: 'my-12',
      none: 'my-0',
    },
  },
  defaultVariants: {
    variant: 'solid',
    spacing: 'md',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, variant, spacing, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn(dividerVariants({ variant, spacing }), className)}
      {...props}
    />
  ),
);
Divider.displayName = 'Divider';
