import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './service-portfolio.module.css';

export interface ServiceCard {
  /** テーマ契約のブランドキー（corporate / polastack / peerdesk / peerdesk-taxpeer …） */
  brand: string;
  name: string;
  description: string;
  href: string;
  /** 例: 「エンタープライズ Agent 基盤」 */
  tagline?: string;
  linkLabel?: string;
}

export interface ServicePortfolioProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  services: ServiceCard[];
}

/**
 * ServicePortfolio — product-portfolio-top 型（LP調査 19頁中7頁）の主役セクション。
 * 各カードは data-brand を持ち、チップとリンクだけが各ブランドの色になる。
 * React 側にブランド分岐は無い（テーマ契約のスロット参照のみ）。
 */
export const ServicePortfolio = React.forwardRef<HTMLElement, ServicePortfolioProps>(
  ({ eyebrow, title, subtitle, services, ...props }, ref) => (
    <Section ref={ref} background="muted" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.grid}>
          {services.map((service) => (
            <a
              key={service.brand + service.name}
              href={service.href}
              data-brand={service.brand}
              className={styles.card}
            >
              <div className={styles.chipRow}>
                <span className={styles.chip}>{service.name}</span>
                {service.tagline && <span className={styles.tagline}>{service.tagline}</span>}
              </div>
              <Text as="div" size="body-sm" tone="secondary">
                {service.description}
              </Text>
              <span className={styles.arrow}>{service.linkLabel ?? '詳しく見る →'}</span>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
ServicePortfolio.displayName = 'ServicePortfolio';
