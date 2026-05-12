import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)] disabled:pointer-events-none disabled:opacity-50 touch:min-h-[--touch-target-min]',
  {
    variants: {
      variant: {
        // primary-500 (#13c3a0) は brand teal だが white text とのコントラストが
        // 2.24:1 で WCAG AA (4.5:1) 不適合。操作 UI には暗めシェードを使う。
        // primary-700 (#137663) / white = 5.34:1 ✅ AA pass、hover/active も繰り上げ。
        // primary-500 自体は Badge/Tabs indicator 等のアクセント装飾用に温存。
        default:
          'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900',
        destructive:
          'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
        outline:
          'border border-[var(--color-border-input)] bg-[var(--color-surface-raised)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-sunken)] active:bg-[var(--color-surface-muted)]',
        ghost: 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-muted)] active:bg-neutral-200 dark:active:bg-neutral-700',
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
