import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import styles from './divider.module.css';

export const dividerVariants = cva(styles.divider, {
  variants: {
    variant: {
      solid: styles.solid,
      gradient: styles.gradient,
      /** 装飾のみのヘアラインのため、彩度の高い装飾スロット（--color-decor-brand）を使う */
      brand: styles.brand,
      dashed: styles.dashed,
    },
    spacing: {
      sm: styles.spacingSm,
      md: styles.spacingMd,
      lg: styles.spacingLg,
      none: styles.spacingNone,
    },
  },
  defaultVariants: {
    variant: 'solid',
    spacing: 'md',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>, VariantProps<typeof dividerVariants> {
  /**
   * @deprecated 移行期間限定（未移行コンポーネントからのレイアウト調整用）。
   * Slice 6 で削除する（stage2-workorder.md §0）。新規利用は禁止。
   */
  className?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, variant, spacing, ...props }, ref) => (
    <hr ref={ref} className={cn(dividerVariants({ variant, spacing }), className)} {...props} />
  ),
);
Divider.displayName = 'Divider';
