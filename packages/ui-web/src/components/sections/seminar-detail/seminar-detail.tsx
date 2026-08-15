import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { Badge } from '@/components/primitives/badge';
import {
  formatSeminarDateTime,
  type SeminarFormat,
  type SeminarFormatLabels,
  type SeminarStatusLabels,
} from '@/components/sections/seminar-card';
import type { ContentImage, ContentPerson } from '@/lib/content-vocabulary';
import styles from './seminar-detail.module.css';

/**
 * アジェンダの1項目。
 *
 * 実測は**章立て型（①②③）と時間割型（`12:00-12:05`）の2形式**に割れていた。
 * `startAt` の有無で描き分ける（形式を選ぶ props は持たない）。
 */
export interface SeminarAgendaItem {
  /** 時間割型のときだけ渡す。例: 「12:00-12:05」 */
  time?: string;
  title: string;
  description?: string;
}

/** 開催要項の1行 */
export interface EventMetaItem {
  label: string;
  value: string;
}

export interface SeminarDetailLabels {
  recommended: string;
  agenda: string;
  eventMeta: string;
  speakers: string;
  overview: string;
  status: SeminarStatusLabels;
  format: SeminarFormatLabels;
}

const DEFAULT_LABELS: SeminarDetailLabels = {
  recommended: 'こんな方におすすめ',
  agenda: 'プログラム',
  eventMeta: '開催要項',
  speakers: '登壇者',
  overview: 'セミナー概要',
  status: { upcoming: '受付中', closed: '受付終了', archive: 'アーカイブ配信中' },
  format: { online: 'オンライン', venue: '会場開催' },
};

interface SeminarDetailBase
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  title: string;
  format?: SeminarFormat;
  photo?: ContentImage;
  /** セミナー概要の段落 */
  overview?: string[];
  /** こんな方におすすめ（箇条書き） */
  recommended?: string[];
  agenda?: SeminarAgendaItem[];
  /** 開催要項。日時・申込締切・開催形式・参加費・定員など */
  eventMeta?: EventMetaItem[];
  /** 登壇者。実測は最大3名 */
  speakers?: ContentPerson[];
  labels?: Partial<SeminarDetailLabels>;
  /**
   * 申込フォーム。**獲得系ではフォーム自体が CTA** なので、
   * 末尾 CTA も関連コンテンツも SNS シェアも持たない（実測 0/21）。
   */
  form?: React.ReactNode;
  formatDateTime?: (iso: string) => string;
}

/** 開催予定。開催日時を持ち、視聴期限は型として存在しない */
export interface UpcomingSeminarProps extends SeminarDetailBase {
  status: 'upcoming';
  startAt: string;
}

/** 受付終了。開催日時は残るが申し込めない */
export interface ClosedSeminarProps extends SeminarDetailBase {
  status: 'closed';
  startAt: string;
}

/** アーカイブ配信。**開催日時が型として存在しない**（あるのは視聴期限） */
export interface ArchiveSeminarProps extends SeminarDetailBase {
  status: 'archive';
  viewableUntil?: string;
}

export type SeminarDetailSectionProps =
  | UpcomingSeminarProps
  | ClosedSeminarProps
  | ArchiveSeminarProps;

const STATUS_VARIANT = {
  upcoming: 'new',
  closed: 'secondary',
  archive: 'default',
} as const;

function Speaker({ person }: { person: ContentPerson }) {
  return (
    <div className={styles.speaker}>
      {person.photo ? (
        <img
          className={styles.speakerPhoto}
          src={person.photo.src}
          alt={person.photo.alt}
          loading="lazy"
        />
      ) : (
        <div className={styles.speakerInitial} aria-hidden="true">
          {[...person.name][0]}
        </div>
      )}
      <div>
        {person.organization && <div className={styles.speakerOrg}>{person.organization}</div>}
        {person.role && (
          <Text as="div" size="body-sm" tone="muted">
            {person.role}
          </Text>
        )}
        <div className={styles.speakerName}>{person.name}</div>
        {person.bio && (
          <Text as="p" size="body-sm" tone="secondary">
            {person.bio}
          </Text>
        )}
      </div>
    </div>
  );
}

/**
 * SeminarDetailSection — セミナー詳細。
 *
 * **分割しない。** 実測でセクション順序は21本すべて一致しており、
 * 細かく分けても組み合わせの自由度は要らない
 * （`CaseStudyArticleSection` / `ArticleBodySection` と同じ判断）。
 *
 * `status` の判別ユニオンで、**アーカイブに開催日時が、開催予定に視聴期限が
 * 型として存在しない**ようにしてある。
 */
export const SeminarDetailSection = React.forwardRef<HTMLElement, SeminarDetailSectionProps>(
  (props, ref) => {
    const {
      title,
      format,
      photo,
      overview,
      recommended,
      agenda,
      eventMeta,
      speakers,
      labels,
      form,
      formatDateTime = formatSeminarDateTime,
      status,
      ...rest
    } = props;
    const l = {
      ...DEFAULT_LABELS,
      ...labels,
      status: { ...DEFAULT_LABELS.status, ...labels?.status },
      format: { ...DEFAULT_LABELS.format, ...labels?.format },
    };

    /* 判別ユニオンの片側だけに存在する props を DOM へ素通ししない
       （HeroSection の offers で踏んだのと同じ事故を避ける） */
    const domProps = { ...rest } as Record<string, unknown>;
    for (const key of ['startAt', 'viewableUntil']) delete domProps[key];

    const schedule =
      status === 'archive'
        ? (props as ArchiveSeminarProps).viewableUntil
        : (props as UpcomingSeminarProps | ClosedSeminarProps).startAt;

    return (
      <Section ref={ref} background="default" spacing="md" {...domProps}>
        <Container size="md">
          <article className={styles.article}>
            <header className={styles.head}>
              <div className={styles.badges}>
                {/* 色だけで状態を伝えない。文言を必ず出す */}
                <Badge variant={STATUS_VARIANT[status]}>{l.status[status]}</Badge>
                {format && <span className={styles.format}>{l.format[format]}</span>}
                {schedule && (
                  <Text as="span" size="body-sm" tone="muted">
                    <time dateTime={schedule}>{formatDateTime(schedule)}</time>
                  </Text>
                )}
              </div>
              <h1 className={styles.title}>{title}</h1>
            </header>

            {photo && (
              <figure className={styles.heroFigure}>
                <img className={styles.heroPhoto} src={photo.src} alt={photo.alt} loading="lazy" />
              </figure>
            )}

            {overview && overview.length > 0 && (
              <section className={styles.block}>
                <h2 className={styles.blockHeading}>{l.overview}</h2>
                {overview.map((p, i) => (
                  <p key={i} className={styles.paragraph}>
                    {p}
                  </p>
                ))}
              </section>
            )}

            {recommended && recommended.length > 0 && (
              <section className={styles.block}>
                <h2 className={styles.blockHeading}>{l.recommended}</h2>
                <ul className={styles.recommendedList}>
                  {recommended.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {agenda && agenda.length > 0 && (
              <section className={styles.block}>
                <h2 className={styles.blockHeading}>{l.agenda}</h2>
                <div className={styles.agenda}>
                  {agenda.map((a, i) => (
                    <div key={i} className={styles.agendaRow}>
                      {/* 時間割型なら時刻、章立て型なら連番。形式を選ぶ props は持たない */}
                      <div className={styles.agendaMarker}>{a.time ?? `${i + 1}`}</div>
                      <div className={styles.agendaTitle}>{a.title}</div>
                      {a.description && (
                        <div className={styles.agendaDescription}>
                          <Text as="p" size="body-sm" tone="secondary">
                            {a.description}
                          </Text>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {eventMeta && eventMeta.length > 0 && (
              <section className={styles.block}>
                <h2 className={styles.blockHeading}>{l.eventMeta}</h2>
                <dl className={styles.eventMeta}>
                  {eventMeta.map((m, i) => (
                    <div key={i} className={styles.eventMetaRow}>
                      <dt className={styles.eventMetaLabel}>{m.label}</dt>
                      <dd className={styles.eventMetaValue}>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {speakers && speakers.length > 0 && (
              <section className={styles.block}>
                <h2 className={styles.blockHeading}>{l.speakers}</h2>
                <div className={styles.speakers}>
                  {speakers.map((s, i) => (
                    <Speaker key={i} person={s} />
                  ))}
                </div>
              </section>
            )}

            {form && <div className={styles.form}>{form}</div>}
          </article>
        </Container>
      </Section>
    );
  },
);
SeminarDetailSection.displayName = 'SeminarDetailSection';
