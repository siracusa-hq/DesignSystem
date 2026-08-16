import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './history.module.css';

export interface HistoryEvent {
  year: number;
  /** 1〜12。省略すると年だけを出す */
  month?: number;
  text: string;
}

export interface HistorySectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  events: HistoryEvent[];
  /**
   * 並び順。既定は `desc`（新しい順）。
   * 創業からの物語として読ませたいときだけ `asc` にする。
   */
  order?: 'desc' | 'asc';
  /** 月の表記を組み立てる。既定は「7月」。英語なら `(m) => \`${m}/\`` など */
  formatMonth?: (month: number) => string;
}

const defaultFormatMonth = (month: number) => `${month}月`;

/**
 * HistorySection — 沿革。
 *
 * ここは**順序そのものが情報**なので、年の並びと節点で時系列を示す。
 * 縦の導線は引かない（線の語彙を増やさない）。節点に強調の段階も持たせない。
 */
export const HistorySection = React.forwardRef<HTMLElement, HistorySectionProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      events,
      order = 'desc',
      formatMonth = defaultFormatMonth,
      ...props
    },
    ref,
  ) => {
    /* 渡された配列は変更しない（利用側の状態を壊さない）。
       年 → 月の複合キーで安定に並べる */
    const sorted = React.useMemo(() => {
      const key = (e: HistoryEvent) => e.year * 100 + (e.month ?? 0);
      return [...events].sort((a, b) => (order === 'asc' ? key(a) - key(b) : key(b) - key(a)));
    }, [events, order]);

    return (
      <Section ref={ref} background="default" spacing="md" {...props}>
        <Container size="md">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className={styles.list}>
            {sorted.map((e, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.year}>
                  {e.year}
                  {e.month != null && <span className={styles.month}>{formatMonth(e.month)}</span>}
                </div>
                <div className={styles.text}>{e.text}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  },
);
HistorySection.displayName = 'HistorySection';
