import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './badge.module.css';

export const badgeVariants = cva(styles.badge, {
  variants: {
    variant: {
      default: styles.variantDefault,
      secondary: styles.variantSecondary,
      outline: styles.variantOutline,
      new: styles.variantNew,
      beta: styles.variantBeta,
      comingSoon: styles.variantComingSoon,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ variant, ...props }, ref) => (
  <span ref={ref} className={badgeVariants({ variant })} {...props} />
));
Badge.displayName = 'Badge';
