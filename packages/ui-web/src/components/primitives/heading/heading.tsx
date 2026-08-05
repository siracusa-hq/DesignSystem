import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './heading.module.css';

export const headingVariants = cva(styles.heading, {
  variants: {
    size: {
      'display-2xl': styles.display2xl,
      'display-xl': styles.displayXl,
      'display-lg': styles.displayLg,
      'display-md': styles.displayMd,
      'display-sm': styles.displaySm,
      'heading-lg': styles.headingLg,
      'heading-md': styles.headingMd,
      'heading-sm': styles.headingSm,
    },
  },
  defaultVariants: {
    size: 'display-md',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className'>,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ size, as: Tag = 'h2', ...props }, ref) => (
    <Tag ref={ref} className={headingVariants({ size })} {...props} />
  ),
);
Heading.displayName = 'Heading';
