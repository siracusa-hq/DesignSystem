import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { Badge } from '@/components/primitives/badge';
import { SectionHeader } from '@/components/sections/section-header';
import type { MediaFrameProps } from '@/components/primitives/media-frame';
import type { ProductShotProps } from '@/components/primitives/product-shot';
import { Check } from 'lucide-react';
import styles from './feature-showcase.module.css';

export interface ShowcaseItem {
  badge?: string;
  title: string;
  description: string;
  /** MediaFrame / ProductShot の要素のみ受け付ける（素の ReactNode は不可。workorder §4） */
  image?: React.ReactElement<MediaFrameProps | ProductShotProps>;
  features?: string[];
}

export interface FeatureShowcaseProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  items: ShowcaseItem[];
}

export const FeatureShowcase = React.forwardRef<HTMLElement, FeatureShowcaseProps>(
  ({ eyebrow, title, subtitle, items, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.items}>
          {items.map((item, i) => (
            <div key={i} className={cn(styles.row, i % 2 === 1 && styles.reversed)}>
              <div className={styles.copy}>
                {item.badge && <Badge variant="default">{item.badge}</Badge>}
                <Heading as="h3" size="display-sm">
                  {item.title}
                </Heading>
                <Text size="body-lg" tone="secondary">
                  {item.description}
                </Text>
                {item.features && item.features.length > 0 && (
                  <ul className={styles.featureList}>
                    {item.features.map((feat, j) => (
                      <li key={j} className={styles.featureItem}>
                        <span className={styles.checkMark}>
                          <Check className={styles.checkIcon} />
                        </span>
                        <Text as="span" size="body-sm">
                          {feat}
                        </Text>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {item.image && <div className={styles.media}>{item.image}</div>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
FeatureShowcase.displayName = 'FeatureShowcase';
