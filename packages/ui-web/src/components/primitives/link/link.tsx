import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './link.module.css';

export const linkVariants = cva(styles.link, {
  variants: {
    variant: {
      default: styles.variantDefault,
      subtle: styles.variantSubtle,
      arrow: styles.variantArrow,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>,
    VariantProps<typeof linkVariants> {}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant, children, ...props }, ref) => (
    <a ref={ref} className={linkVariants({ variant })} {...props}>
      {children}
      {variant === 'arrow' && (
        <svg
          className={styles.arrowIcon}
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
