import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Badge } from '@/components/primitives/badge';
import styles from './hero-section.module.css';
import { cn } from '@/lib/cn';

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  /** variant は自動割当: 1つ目 = primary / 以降 = secondary */
  actions?: HeroAction[];
  /** MediaFrame / ProductShot を渡すこと（Slice 4 で型を制約する） */
  image?: React.ReactNode;
  /** image がある場合の配置。side = 右横 / below = 下（既定） */
  imagePlacement?: 'side' | 'below';
}

export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  ({ badge, title, subtitle, actions, image, imagePlacement = 'below', ...props }, ref) => {
    const isSide = image != null && imagePlacement === 'side';
    const content = (
      <div className={cn(styles.inner, !isSide && styles.centered)}>
        {badge && (
          <div className={styles.badgeRow}>
            <Badge variant="default">{badge}</Badge>
          </div>
        )}
        <div className={styles.titleBlock}>
          <Heading as="h1" size="display-2xl">
            {title}
          </Heading>
          {subtitle && (
            <Text size="body-lg" tone="secondary" clauseWrap className={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, i) => (
              <MarketingButton
                key={i}
                variant={i === 0 ? 'primary' : 'secondary'}
                size="lg"
                href={action.href}
              >
                {action.label}
              </MarketingButton>
            ))}
          </div>
        )}
      </div>
    );

    return (
      <Section ref={ref} background="default" spacing="xl" className={styles.hero} {...props}>
        <Container>
          {isSide ? (
            <div className={styles.split}>
              {content}
              <div className={styles.mediaSide}>{image}</div>
            </div>
          ) : (
            <>
              {content}
              {image && <div className={styles.mediaBelow}>{image}</div>}
            </>
          )}
        </Container>
      </Section>
    );
  },
);
HeroSection.displayName = 'HeroSection';
