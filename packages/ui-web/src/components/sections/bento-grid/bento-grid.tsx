import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './bento-grid.module.css';

export interface BentoItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  span?: 1 | 2;
  rowSpan?: 1 | 2;
}

export interface BentoGridProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 強調されるのは常に1件目。順番が主役を決める（旧 variant は削除。workorder §3） */
  items: BentoItem[];
}

export const BentoGrid = React.forwardRef<HTMLElement, BentoGridProps>(
  ({ eyebrow, title, subtitle, items, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.grid}>
          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                styles.card,
                i === 0 && styles.featured,
                item.span === 2 && styles.span2,
                item.rowSpan === 2 && styles.rowSpan2,
              )}
            >
              {item.icon && <div className={styles.iconBox}>{item.icon}</div>}
              <Heading as="h3" size="heading-md">
                {item.title}
              </Heading>
              {item.description && (
                <Text size="body-sm" tone="secondary">
                  {item.description}
                </Text>
              )}
              {item.content && <div className={styles.content}>{item.content}</div>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
BentoGrid.displayName = 'BentoGrid';
