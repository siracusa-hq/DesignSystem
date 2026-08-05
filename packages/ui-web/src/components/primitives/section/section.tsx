import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
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
  extends Omit<React.HTMLAttributes<HTMLElement>, 'className'>,
    VariantProps<typeof sectionVariants> {}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ spacing, background, ...props }, ref) => (
    <section ref={ref} className={sectionVariants({ spacing, background })} {...props} />
  ),
);
Section.displayName = 'Section';
