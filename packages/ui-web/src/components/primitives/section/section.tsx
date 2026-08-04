import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import styles from './section.module.css';

export const sectionVariants = cva(styles.section, {
  variants: {
    spacing: {
      sm: styles.spacingSm,
      md: styles.spacingMd,
      lg: styles.spacingLg,
      xl: styles.spacingXl,
      none: styles.spacingNone,
    },
    background: {
      default: styles.bgDefault,
      muted: styles.bgMuted,
      dark: styles.bgDark,
      brand: styles.bgBrand,
    },
  },
  defaultVariants: {
    spacing: 'md',
    background: 'default',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  /**
   * @deprecated 移行期間限定（未移行コンポーネントからのレイアウト調整用）。
   * Slice 6 で削除する（stage2-workorder.md §0）。新規利用は禁止。
   */
  className?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    />
  ),
);
Section.displayName = 'Section';
