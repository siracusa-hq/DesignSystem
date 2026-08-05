import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import styles from './marketing-button.module.css';

export const marketingButtonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
      /** CTA 第3役割（--color-cta-*）。コンバージョン導線用 */
      cta: styles.cta,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
      xl: styles.sizeXl,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface MarketingButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
    VariantProps<typeof marketingButtonVariants> {
  href?: string;
  rightIcon?: React.ReactNode;
  /** モバイルメニュー等での全幅表示 */
  fullWidth?: boolean;
}

export const MarketingButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  MarketingButtonProps
>(({ variant, size, href, rightIcon, fullWidth = false, children, ...props }, ref) => {
  const content = (
    <>
      {children}
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(marketingButtonVariants({ variant, size }), fullWidth && styles.fullWidth)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cn(marketingButtonVariants({ variant, size }), fullWidth && styles.fullWidth)}
      {...props}
    >
      {content}
    </button>
  );
});
MarketingButton.displayName = 'MarketingButton';
