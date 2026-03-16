import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 ring-offset-[--color-ring-offset] disabled:pointer-events-none disabled:opacity-50 touch:min-h-[--touch-target-min]',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        destructive:
          'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
        outline:
          'border border-[--color-border-input] bg-[--color-surface-raised] text-[--color-on-surface] hover:bg-[--color-surface-sunken] active:bg-[--color-surface-muted]',
        ghost: 'text-[--color-on-surface] hover:bg-[--color-surface-muted] active:bg-neutral-200 dark:active:bg-neutral-700',
        link: 'text-primary-500 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-base',
        icon: 'h-9 w-9 touch:min-w-[--touch-target-min]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
