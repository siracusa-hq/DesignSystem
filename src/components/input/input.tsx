import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const inputVariants = cva(
  'flex w-full rounded-md border border-[--color-border-input] bg-[--color-surface-raised] px-3 text-[--color-on-surface] transition-colors duration-fast file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--color-on-surface-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 ring-offset-[--color-ring-offset] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error-500 aria-[invalid=true]:focus-visible:ring-error-500 touch:min-h-[--touch-target-min]',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
