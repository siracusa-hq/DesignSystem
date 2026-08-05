import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { CTARegistryContext } from '@/lib/cta-registry';
import { isDev } from '@/lib/dev';
import styles from './marketing-button.module.css';

/** dev のみ: variant="cta" のラベルを Page のレジストリに登録する
    （ラベル2種ルールの検査。Page の外・prod では何もしない） */
function useCTALabelReport(
  isCta: boolean,
  elementRef: React.RefObject<HTMLElement | null>,
) {
  const registry = React.useContext(CTARegistryContext);
  React.useEffect(() => {
    if (!isDev || !isCta || !registry) return;
    const text = elementRef.current?.textContent;
    if (text) registry.register(text);
  }, [isCta, registry, elementRef]);
}

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
  const innerRef = React.useRef<HTMLElement | null>(null);
  useCTALabelReport(variant === 'cta', innerRef);
  const setRefs = (node: HTMLAnchorElement | HTMLButtonElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const content = (
    <>
      {children}
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </>
  );

  if (href) {
    return (
      <a
        ref={setRefs}
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
      ref={setRefs}
      className={cn(marketingButtonVariants({ variant, size }), fullWidth && styles.fullWidth)}
      {...props}
    >
      {content}
    </button>
  );
});
MarketingButton.displayName = 'MarketingButton';
