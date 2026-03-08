import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const textareaVariants = cva(
  'flex w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 transition-colors duration-fast placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error-500 aria-[invalid=true]:focus-visible:ring-error-500',
  {
    variants: {
      size: {
        sm: 'min-h-[60px] text-xs',
        md: 'min-h-[80px] text-sm',
        lg: 'min-h-[100px] text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
