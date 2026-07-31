import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

export const textVariants = cva('', {
  variants: {
    size: {
      'body-lg': 'text-body-lg',
      'body-md': 'text-body-md',
      'body-sm': 'text-body-sm',
      caption: 'text-caption',
      overline: 'inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-body-sm font-medium tracking-wide text-primary-600 dark:bg-primary-400/10 dark:text-primary-400',
      'overline-pill': 'inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-body-sm font-medium tracking-wide text-primary-600 dark:bg-primary-400/10 dark:text-primary-400',
      'overline-border': 'inline-flex items-center rounded-full border border-primary-500/20 px-3 py-1 text-body-sm font-medium tracking-wide text-primary-600 dark:border-primary-400/20 dark:text-primary-400',
      'overline-text': 'text-body-sm font-medium tracking-wide text-primary-600 dark:text-primary-400',
      'overline-dot': 'inline-flex items-center gap-2 text-body-sm font-medium tracking-wide text-primary-600 dark:text-primary-400 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary-500 before:dark:bg-primary-400',
      'overline-gradient': 'text-body-sm font-medium tracking-wide bg-gradient-to-r from-primary-500 to-info-500 bg-clip-text text-transparent',
      'overline-icon-pill': 'inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-body-sm font-medium tracking-wide text-primary-600 dark:bg-primary-400/10 dark:text-primary-400',
    },
    tone: {
      default: 'text-neutral-900 dark:text-neutral-50',
      secondary: 'text-neutral-600 dark:text-neutral-400',
      muted: 'text-neutral-500 dark:text-neutral-500',
      brand: 'text-primary-500',
      inherit: '',
    },
  },
  defaultVariants: {
    size: 'body-md',
    tone: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, tone, as: Tag = 'p', ...props }, ref) => (
    <Tag ref={ref} className={clsx(textVariants({ size, tone }), className)} {...props} />
  ),
);
Text.displayName = 'Text';
