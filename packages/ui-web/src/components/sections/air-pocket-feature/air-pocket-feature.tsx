import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Eyebrow } from '@/components/primitives/eyebrow';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './air-pocket-feature.module.css';

export interface AirPocket {
  module: string;
  headline: string;
  description: string;
  proof: string;
  competitors: { name: string; status: string }[];
  visual?: React.ReactNode;
}

export interface AirPocketFeatureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  airPockets: AirPocket[];
  /** 自社名（競合ステータス表の最終行）。既定は Polastack */
  ownName?: string;
  /** 自社の状態（競合ステータス表の最終行）。既定は「✓ 標準搭載」 */
  ownStatus?: string;
}

export const AirPocketFeature = React.forwardRef<HTMLElement, AirPocketFeatureProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      airPockets,
      ownName = 'Polastack',
      ownStatus = '✓ 標準搭載',
      ...props
    },
    ref,
  ) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.items}>
          {airPockets.map((pocket, i) => (
            <div key={i} className={cn(styles.row, i % 2 === 1 && styles.reversed)}>
              <div className={styles.copy}>
                <Eyebrow>{pocket.module}</Eyebrow>
                <Heading as="h3" size="display-sm">
                  {pocket.headline}
                </Heading>
                <Text size="body-lg" tone="secondary">
                  {pocket.description}
                </Text>
                <div className={styles.proof}>
                  <Text as="div" size="body-sm" tone="brand">
                    {pocket.proof}
                  </Text>
                </div>

                {/* 競合ステータス */}
                <div className={styles.competitors}>
                  {pocket.competitors.map((comp, j) => (
                    <div key={j} className={styles.competitorRow}>
                      <span className={styles.competitorName}>
                        <Text as="span" size="caption" tone="muted">
                          {comp.name}
                        </Text>
                      </span>
                      <Text as="span" size="caption" tone="muted">
                        {comp.status}
                      </Text>
                    </div>
                  ))}
                  <div className={cn(styles.competitorRow, styles.ownRow)}>
                    <span className={styles.competitorName}>
                      <Text as="span" size="caption" tone="brand">
                        {ownName}
                      </Text>
                    </span>
                    <Text as="span" size="caption" tone="brand">
                      {ownStatus}
                    </Text>
                  </div>
                </div>
              </div>

              {pocket.visual && <div className={styles.media}>{pocket.visual}</div>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
AirPocketFeature.displayName = 'AirPocketFeature';
