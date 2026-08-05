import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
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
  extends Omit<React.HTMLAttributes<HTMLHRElement>, 'className'>,
    VariantProps<typeof dividerVariants> {}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ variant, spacing, ...props }, ref) => (
    <hr ref={ref} className={dividerVariants({ variant, spacing })} {...props} />
  ),
);
Divider.displayName = 'Divider';
