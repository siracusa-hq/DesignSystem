import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const marketingButtonVariants = cva(
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 !text-white hover:bg-primary-600 active:bg-primary-700 hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-neutral-700 dark:text-neutral-300 hover:bg-[var(--color-surface-sunken)] hover:border-primary-300 hover:-translate-y-0.5 active:translate-y-0',
        ghost:
          'text-[var(--color-on-surface)] hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800 dark:hover:text-primary-400',
        gradient:
          'bg-gradient-to-r from-primary-500 to-primary-400 !text-white hover:from-primary-600 hover:to-primary-500 hover:shadow-glow-primary bg-[length:200%_100%] hover:bg-[position:right] hover:-translate-y-0.5 active:translate-y-0',
      },
      size: {
        sm: 'h-9 px-4 text-body-sm',
        md: 'h-11 px-6 text-body-md',
        lg: 'h-13 px-8 text-body-lg',
        xl: 'h-15 px-10 text-body-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface MarketingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof marketingButtonVariants> {
  href?: string;
  rightIcon?: React.ReactNode;
}

export const MarketingButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  MarketingButtonProps
>(({ className, variant, size, href, rightIcon, children, ...props }, ref) => {
  const content = (
    <>
      {children}
      {rightIcon && (
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          {rightIcon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(marketingButtonVariants({ variant, size }), className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cn(marketingButtonVariants({ variant, size }), className)}
      {...props}
    >
      {content}
    </button>
  );
});
MarketingButton.displayName = 'MarketingButton';
