import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const sectionVariants = cva('w-full', {
  variants: {
    spacing: {
      sm: 'py-[var(--spacing-section-sm)]',
      md: 'py-[var(--spacing-section-md)]',
      lg: 'py-[var(--spacing-section-lg)]',
      xl: 'py-[var(--spacing-section-xl)]',
      none: 'py-0',
    },
    background: {
      default: 'bg-[var(--color-surface)]',
      muted: 'bg-[var(--color-surface-sunken)]',
      dark: 'bg-neutral-950 text-neutral-50',
      brand: 'bg-primary-950 text-neutral-50',
    },
  },
  defaultVariants: {
    spacing: 'md',
    background: 'default',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    />
  ),
);
Section.displayName = 'Section';
