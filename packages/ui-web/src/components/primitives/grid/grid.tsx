import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './grid.module.css';

export const gridVariants = cva(styles.grid, {
  variants: {
    columns: {
      1: styles.cols1,
      2: styles.cols2,
      3: styles.cols3,
      4: styles.cols4,
    },
    gap: {
      sm: styles.gapSm,
      md: styles.gapMd,
      lg: styles.gapLg,
      xl: styles.gapXl,
    },
  },
  defaultVariants: {
    columns: 3,
    gap: 'md',
  },
});

export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>,
    VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns, gap, ...props }, ref) => (
    <div ref={ref} className={gridVariants({ columns, gap })} {...props} />
  ),
);
Grid.displayName = 'Grid';
