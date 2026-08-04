import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { SectionHeader } from '@/components/sections/section-header';
import { PricingCard, type PricingCardProps } from './pricing-card';
import styles from './pricing-table.module.css';

export interface PricingTableProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  plans: PricingCardProps[];
}

export const PricingTable = React.forwardRef<HTMLElement, PricingTableProps>(
  ({ eyebrow, title, subtitle, plans, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container size="xl">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={cn(styles.grid, plans.length <= 3 ? styles.cols3 : styles.cols4)}>
          {plans.map((plan, i) => (
            <PricingCard key={i} {...plan} />
          ))}
        </div>
      </Container>
    </Section>
  ),
);
PricingTable.displayName = 'PricingTable';
