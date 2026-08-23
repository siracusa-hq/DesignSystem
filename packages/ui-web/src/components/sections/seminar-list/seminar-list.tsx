import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Heading } from '@/components/primitives/heading';
import { SectionHeader } from '@/components/sections/section-header';
import {
  SeminarCard,
  SEMINAR_STATUSES,
  formatSeminarDateTime,
  type SeminarListItem,
  type SeminarStatus,
  type SeminarStatusLabels,
  type SeminarFormatLabels,
} from '@/components/sections/seminar-card';
import styles from './seminar-list.module.css';

export interface SeminarListLabels {
  status: SeminarStatusLabels;
  format: SeminarFormatLabels;
  /** 各グループの見出し。状態バッジの文言とは別に持つ（「開催予定のセミナー」等） */
  groupHeading: Record<SeminarStatus, string>;
  empty: string;
  viewableUntil: string;
}

const DEFAULT_LABELS: SeminarListLabels = {
  status: { upcoming: '受付中', closed: '受付終了', archive: 'アーカイブ配信中' },
  format: { online: 'オンライン', venue: '会場開催' },
  groupHeading: {
    upcoming: '開催予定のセミナー',
    closed: '終了したセミナー',
    archive: 'アーカイブ配信',
  },
  empty: '現在公開中のセミナーはありません。',
  viewableUntil: '視聴期限',
};

export interface SeminarListSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 状態を問わず全件を渡す。**グルーピングはこの部品が決める** */
  seminars: SeminarListItem[];
  labels?: Partial<SeminarListLabels>;
  formatDateTime?: (iso: string) => string;
}

/**
 * SeminarListSection — セミナー一覧。
 *
 * **予定用と終了用でページを分けない**（実測 0/8。8サイトすべてが同じ一覧で両方を扱う）。
 * **状態の分け方はこの部品が決める** — 呼び出し側は `status` 付きで全件を渡すだけ。
 * 実測はタブ 4/8・フィルタ軸 1/8・バッジ 1/8 に割れており、選ばせる根拠が無いため
 * 「状態ごとの見出しで縦に積む」1つに固定した。
 *
 * 検索ボックス・並べ替え UI・ページャは作らない（実測 0/8・無限スクロール 0/31）。
 */
export const SeminarListSection = React.forwardRef<HTMLElement, SeminarListSectionProps>(
  (
    { eyebrow, title, subtitle, seminars, labels, formatDateTime = formatSeminarDateTime, ...props },
    ref,
  ) => {
    const l = {
      ...DEFAULT_LABELS,
      ...labels,
      status: { ...DEFAULT_LABELS.status, ...labels?.status },
      format: { ...DEFAULT_LABELS.format, ...labels?.format },
      groupHeading: { ...DEFAULT_LABELS.groupHeading, ...labels?.groupHeading },
    };

    /* 状態の順序は「申し込めるものが先」。開催予定 → アーカイブ → 終了 */
    const groups = React.useMemo(() => {
      const order: SeminarStatus[] = ['upcoming', 'archive', 'closed'];
      return order
        .map((status) => ({ status, items: seminars.filter((s) => s.status === status) }))
        .filter((g) => g.items.length > 0);
    }, [seminars]);

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container>
          <SectionHeader
            as="h1"
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />

          {groups.length > 0 ? (
            groups.map(({ status, items }) => (
              <section key={status} className={styles.group}>
                <div className={styles.groupHeading}>
                  <Heading as="h2" size="heading-lg">
                    {l.groupHeading[status]}
                  </Heading>
                </div>
                <Grid columns={3} gap="lg">
                  {items.map((s, i) => (
                    <SeminarCard
                      key={i}
                      item={s}
                      statusLabels={l.status}
                      formatLabels={l.format}
                      formatDateTime={formatDateTime}
                      viewableUntilLabel={l.viewableUntil}
                    />
                  ))}
                </Grid>
              </section>
            ))
          ) : (
            <div className={styles.empty}>
              <Text tone="muted">{l.empty}</Text>
            </div>
          )}
        </Container>
      </Section>
    );
  },
);
SeminarListSection.displayName = 'SeminarListSection';

/** SEMINAR_STATUSES は seminar-card が正本。再エクスポートで参照点を1つにする */
export { SEMINAR_STATUSES };
