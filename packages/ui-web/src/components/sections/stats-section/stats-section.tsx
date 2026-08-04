import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { AnimatedCounter } from '@/components/primitives/animated-counter';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './stats-section.module.css';
import { cn } from '@/lib/cn';

export interface StatItem {
  value: string;
  /** 指定するとカウントアップ表示（reduced-motion はトークン層が処理） */
  numericValue?: number;
  label: string;
  description?: string;
  prefix?: string;
  suffix?: string;
}

export interface StatsSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 推奨4スロット: 導入規模 / No.1・シェア / 継続率 / 削減率（LP調査） */
  stats: StatItem[];
  /**
   * 時点注記（例: 「※2026年7月末時点。○○調査による」）。
   * No.1・シェア系の数値を出す場合は景表法上ほぼ必須。
   */
  note?: string;
}

export const StatsSection = React.forwardRef<HTMLElement, StatsSectionProps>(
  ({ eyebrow, title, subtitle, stats, note, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={cn(styles.grid, stats.length <= 3 ? styles.cols3 : styles.cols4)}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div className={styles.value}>
                {stat.numericValue != null ? (
                  <AnimatedCounter
                    value={stat.numericValue}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <Text as="div" size="body-md" className={styles.label}>
                {stat.label}
              </Text>
              {stat.description && (
                <Text size="body-sm" tone="muted" className={styles.description}>
                  {stat.description}
                </Text>
              )}
            </div>
          ))}
        </div>
        {note && (
          <Text size="caption" tone="muted" className={styles.note}>
            {note}
          </Text>
        )}
      </Container>
    </Section>
  ),
);
StatsSection.displayName = 'StatsSection';
