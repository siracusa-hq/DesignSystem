import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './gradient-text.module.css';

export const gradientTextVariants = cva(styles.gradientText, {
  variants: {
    gradient: {
      brand: styles.brand,
      neutral: styles.neutral,
      custom: styles.custom,
    },
  },
  defaultVariants: {
    gradient: 'brand',
  },
});

export interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'className'>,
    VariantProps<typeof gradientTextVariants> {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** `gradient="custom"` のときの CSS グラデーション値（任意の linear-gradient 等） */
  customGradient?: string;
}

export const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  ({ gradient = 'brand', as: Tag = 'span', customGradient, style, ...props }, ref) => (
    <Tag
      ref={ref as React.Ref<never>}
      className={gradientTextVariants({ gradient })}
      style={
        gradient === 'custom' && customGradient
          ? { backgroundImage: customGradient, ...style }
          : style
      }
      {...props}
    />
  ),
);
GradientText.displayName = 'GradientText';
