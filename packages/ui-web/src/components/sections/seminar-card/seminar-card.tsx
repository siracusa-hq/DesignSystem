import * as React from 'react';
import { Text } from '@/components/primitives/text';
import { Badge } from '@/components/primitives/badge';
import { cn } from '@/lib/cn';
import type { ContentImage } from '@/lib/content-vocabulary';
import styles from './seminar-card.module.css';

/**
 * 開催状態。
 *
 * **`sold-out`（満席）と `permanent`（常設）は型に含めない**（実測 0/29 と 1/21）。
 * ただし判別ユニオンに値を足すのは非破壊なので、根拠が出れば後から足せる
 * （acquisition-pages-workorder.md §2 の未決着 #13・#14）。
 */
export const SEMINAR_STATUSES = ['upcoming', 'closed', 'archive'] as const;
export type SeminarStatus = (typeof SEMINAR_STATUSES)[number];

/** 開催形式。実測はオンライン 17 / 会場 1。ハイブリッドは 0/21 なので持たない */
export type SeminarFormat = 'online' | 'venue';

interface SeminarBase {
  href: string;
  title: string;
  thumbnail?: ContentImage;
  format?: SeminarFormat;
}

/**
 * セミナー1件。**状態で持てる情報が変わる。**
 *
 * 全部 optional の1型にすると「開催日時の無い開催予定」「視聴期限のある LIVE」が
 * 型で許されてしまう（`kind` 判別ユニオンで避けたのと同じ失敗）。
 */
export type SeminarListItem =
  | (SeminarBase & {
      status: 'upcoming';
      /** 開催日時。ISO 8601（`YYYY-MM-DD` または `YYYY-MM-DDTHH:mm`） */
      startAt: string;
    })
  | (SeminarBase & { status: 'closed'; startAt: string })
  /** アーカイブ配信には開催日時が無い。あるのは視聴期限 */
  | (SeminarBase & { status: 'archive'; viewableUntil?: string });

export interface SeminarStatusLabels {
  /** 開催状態の文言。**実測14通りに割れているため必ず利用側が渡す** */
  upcoming: string;
  closed: string;
  archive: string;
}

export interface SeminarFormatLabels {
  online: string;
  venue: string;
}

export interface SeminarCardProps {
  item: SeminarListItem;
  statusLabels: SeminarStatusLabels;
  formatLabels: SeminarFormatLabels;
  /** 日時の表示文字列を組み立てる。既定は `YYYY.MM.DD HH:mm` */
  formatDateTime?: (iso: string) => string;
  /** 視聴期限の前置き。例: 「視聴期限」 */
  viewableUntilLabel?: string;
}

/**
 * 日時の表示。**書式はシステムが決める**（実測が6サイトで6通りに割れている）。
 * `Intl` を使わないのは意図的（SSG でロケールに依存させない）。
 */
export function formatSeminarDateTime(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(iso);
  if (!m) return iso;
  const date = `${m[1]}.${m[2]}.${m[3]}`;
  return m[4] ? `${date} ${m[4]}:${m[5]}` : date;
}

/** 状態バッジの見た目。受付中だけが操作色、他は沈んだ面に置く */
const STATUS_VARIANT = {
  upcoming: 'new',
  closed: 'secondary',
  archive: 'default',
} as const;

export function SeminarCard({
  item,
  statusLabels,
  formatLabels,
  formatDateTime = formatSeminarDateTime,
  viewableUntilLabel,
}: SeminarCardProps) {
  const closed = item.status !== 'upcoming';

  return (
    <a className={cn(styles.card, closed && styles.cardClosed)} href={item.href}>
      {item.thumbnail && (
        <img
          className={styles.thumbnail}
          src={item.thumbnail.src}
          alt={item.thumbnail.alt}
          loading="lazy"
        />
      )}
      <div className={styles.body}>
        <div className={styles.meta}>
          {/* 色だけで状態を伝えない。文言を必ず出す */}
          <Badge variant={STATUS_VARIANT[item.status]}>{statusLabels[item.status]}</Badge>
          {item.format && <span className={styles.format}>{formatLabels[item.format]}</span>}
        </div>

        <div className={styles.schedule}>
          {item.status === 'archive' ? (
            item.viewableUntil && (
              <Text as="span" size="body-sm" tone="muted">
                {viewableUntilLabel ? `${viewableUntilLabel}: ` : ''}
                <time className={styles.date} dateTime={item.viewableUntil}>
                  {formatDateTime(item.viewableUntil)}
                </time>
              </Text>
            )
          ) : (
            <Text as="span" size="body-sm" tone="muted">
              <time className={styles.date} dateTime={item.startAt}>
                {formatDateTime(item.startAt)}
              </time>
            </Text>
          )}
        </div>

        <div className={styles.title}>{item.title}</div>
      </div>
    </a>
  );
}
