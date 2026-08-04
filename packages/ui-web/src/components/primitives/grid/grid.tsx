import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
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
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  /**
   * @deprecated 移行期間限定（未移行コンポーネントからのレイアウト調整用）。
   * Slice 6 で削除する（stage2-workorder.md §0）。新規利用は禁止。
   */
  className?: string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns, gap, ...props }, ref) => (
    <div ref={ref} className={cn(gridVariants({ columns, gap }), className)} {...props} />
  ),
);
Grid.displayName = 'Grid';
