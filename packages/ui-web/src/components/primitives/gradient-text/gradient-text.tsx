import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
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
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof gradientTextVariants> {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** `gradient="custom"` のときの CSS グラデーション値（任意の linear-gradient 等） */
  customGradient?: string;
  /**
   * @deprecated 移行期間限定（未移行コンポーネントからのレイアウト調整用）。
   * Slice 6 で削除する（stage2-workorder.md §0）。新規利用は禁止。
   */
  className?: string;
}

export const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  ({ className, gradient = 'brand', as: Tag = 'span', customGradient, style, ...props }, ref) => (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(gradientTextVariants({ gradient }), className)}
      style={gradient === 'custom' && customGradient ? { backgroundImage: customGradient, ...style } : style}
      {...props}
    />
  ),
);
GradientText.displayName = 'GradientText';
