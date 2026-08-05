import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Eyebrow } from '@/components/primitives/eyebrow';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './migration-comparison.module.css';

export interface MigrationTrigger {
  trigger: string;
  pain: string;
  solution: string;
}

export interface MigrationPath {
  from: string;
  tagline: string;
  description: string;
  triggers: MigrationTrigger[];
  action: { label: string; href: string };
}

export interface MigrationComparisonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  paths: MigrationPath[];
}

export const MigrationComparison = React.forwardRef<HTMLElement, MigrationComparisonProps>(
  ({ eyebrow, title, subtitle, paths, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={cn(styles.grid, paths.length === 2 && styles.cols2)}>
          {paths.map((path, i) => (
            <div key={i} className={styles.card}>
              <Eyebrow>{path.from}</Eyebrow>
              <Heading as="h3" size="heading-lg">
                {path.tagline}
              </Heading>
              <Text size="body-md" tone="secondary">
                {path.description}
              </Text>

              <div className={styles.triggers}>
                {path.triggers.map((trigger, j) => (
                  <div key={j} className={styles.trigger}>
                    <div className={styles.triggerTitle}>
                      <Text as="div" size="body-sm">
                        {trigger.trigger}
                      </Text>
                    </div>
                    <div className={styles.triggerPain}>
                      <Text size="caption" tone="muted">
                        {trigger.pain}
                      </Text>
                    </div>
                    <div className={styles.triggerSolution}>
                      <Text size="caption" tone="brand">
                        → {trigger.solution}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.action}>
                <MarketingButton variant="primary" href={path.action.href}>
                  {path.action.label}
                </MarketingButton>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
MigrationComparison.displayName = 'MigrationComparison';
