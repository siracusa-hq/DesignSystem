import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './container.module.css';

export const containerVariants = cva(styles.container, {
  variants: {
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
      xl: styles.sizeXl,
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

export interface ContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size, ...props }, ref) => <div ref={ref} className={containerVariants({ size })} {...props} />,
);
Container.displayName = 'Container';
