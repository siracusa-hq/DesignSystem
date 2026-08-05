import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './feature-grid.module.css';

export interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 列数は件数から導出する（見た目の選択肢としては持たない。workorder §3） */
  features: FeatureItem[];
}

/**
 * 件数 → 列数。2件を3列に流すと右端が空いて崩れるため、割り切れる形に寄せる。
 * 2→2 / 3→3 / 4→2列2段 / 5件以上→3列（1件のみのときは全幅の1列）
 */
function columnsFor(count: number): 1 | 2 | 3 {
  if (count <= 1) return 1;
  if (count === 2 || count === 4) return 2;
  return 3;
}

export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  ({ eyebrow, title, subtitle, features, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Grid columns={columnsFor(features.length)} gap="lg">
          {features.map((feature, i) => (
            <div key={i} className={styles.card}>
              {feature.icon && <div className={styles.iconBox}>{feature.icon}</div>}
              <Heading as="h3" size="heading-md">
                {feature.title}
              </Heading>
              <Text size="body-sm" tone="secondary">
                {feature.description}
              </Text>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  ),
);
FeatureGrid.displayName = 'FeatureGrid';
