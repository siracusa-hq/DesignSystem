import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { AnimatedCounter } from '@/components/primitives/animated-counter';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './stats-section.module.css';
import { cn } from '@/lib/cn';
import { isDev } from '@/lib/dev';

export interface StatItem {
  value: string;
  /**
   * 指定するとカウントアップ表示。
   * `prefers-reduced-motion: reduce` では数え上げを行わず最終値を即座に出す
   * （AnimatedCounter が JS 実装なので、トークン層の CSS では止まらない。
   * stage5-workorder.md §7-1）。
   */
  numericValue?: number;
  label: string;
  description?: string;
  prefix?: string;
  suffix?: string;
}

export interface StatsSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 推奨4スロット: 導入規模 / No.1・シェア / 継続率 / 削減率（LP調査） */
  stats: StatItem[];
  /**
   * 実績数値の基準時点（例: 「2026年7月時点」）。
   *
   * **景品表示法上、実績値には時点が要る。** いつの数字か分からない実績表示は
   * 不当表示になりえるため、未指定だと dev 警告が出る（Stage 5 Slice 1）。
   * 文字列は利用側が渡すこと（このパッケージは文言を持たない）。
   */
  asOf?: string;
  /**
   * 出典・調査方法などの補足注記（例: 「当社調べ。導入企業アンケート412件の集計」）。
   *
   * `asOf` と違い自由文。時点をこの自由文に含めている既存ページのために、
   * `note` があるときは `asOf` 未指定の警告を出さない（誤発火を避ける）。
   */
  note?: string;
}

export const StatsSection = React.forwardRef<HTMLElement, StatsSectionProps>(
  ({ eyebrow, title, subtitle, stats, asOf, note, ...props }, ref) => {
    if (isDev && !asOf && !note) {
      console.warn(
        '[StatsSection] 実績数値に時点表記がありません。asOf に基準時点（例: 「2026年7月時点」）を' +
          '渡してください。景品表示法上、いつの数字か分からない実績表示は不当表示になりえます' +
          '（composition-redesign.md §Stage 5）。出典・調査方法まで書く場合は note を使ってください。',
      );
    }

    return (
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
                {/* 余白・太字はラッパーが持つ（Text は className を受け取らない） */}
                <div className={styles.label}>
                  <Text as="div" size="body-md">
                    {stat.label}
                  </Text>
                </div>
                {stat.description && (
                  <div className={styles.description}>
                    <Text size="body-sm" tone="muted">
                      {stat.description}
                    </Text>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* 時点表記と補足注記は同じ caption の枠に収める（控えめに、1ブロックで） */}
          {(asOf || note) && (
            <div className={styles.note}>
              {asOf && (
                <Text size="caption" tone="muted">
                  {asOf}
                </Text>
              )}
              {note && (
                <Text size="caption" tone="muted">
                  {note}
                </Text>
              )}
            </div>
          )}
        </Container>
      </Section>
    );
  },
);
StatsSection.displayName = 'StatsSection';
