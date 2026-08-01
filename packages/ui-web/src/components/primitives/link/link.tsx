import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const linkVariants = cva(
  'inline-flex items-center gap-1 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:rounded-sm',
  {
    variants: {
      variant: {
        default: 'text-primary-500 hover:text-primary-600 underline underline-offset-4',
        subtle:
          'text-[var(--color-on-surface-secondary)] hover:text-[var(--color-on-surface)]',
        arrow:
          'text-primary-500 hover:text-primary-600 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, children, ...props }, ref) => (
    <a ref={ref} className={cn(linkVariants({ variant }), className)} {...props}>
      {children}
      {variant === 'arrow' && (
        <svg
          className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </a>
  ),
);
Link.displayName = 'Link';
