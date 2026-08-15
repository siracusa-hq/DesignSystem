import * as React from 'react';
import { Text } from '@/components/primitives/text';
import styles from './share-buttons.module.css';

/** 実測で確認できた共有先（News 8/12・ブログ 15/15 が SNS シェアを持つ） */
export const SHARE_SERVICES = ['x', 'facebook', 'hatena', 'line', 'pocket'] as const;
export type ShareService = (typeof SHARE_SERVICES)[number];

export interface ShareButtonsLabels {
  /** 見出し語。例: 「シェアする」 */
  heading: string;
  /** 各ボタンのアクセシブル名を組み立てる。例: (s) => `${s} でシェア` */
  service: (service: ShareService) => string;
}

const SERVICE_NAMES: Record<ShareService, string> = {
  x: 'X',
  facebook: 'Facebook',
  hatena: 'はてなブックマーク',
  line: 'LINE',
  pocket: 'Pocket',
};

const DEFAULT_LABELS: ShareButtonsLabels = {
  heading: 'シェアする',
  service: (s) => `${SERVICE_NAMES[s]} でシェア`,
};

/** 共有 URL の組み立て。クエリはサービス側の仕様に従う */
function shareUrl(service: ShareService, url: string, title: string): string {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (service) {
    case 'x':
      return `https://x.com/intent/tweet?url=${u}&text=${t}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case 'hatena':
      return `https://b.hatena.ne.jp/entry/panel/?url=${u}&title=${t}`;
    case 'line':
      return `https://social-plugins.line.me/lineit/share?url=${u}`;
    case 'pocket':
      return `https://getpocket.com/edit?url=${u}&title=${t}`;
  }
}

/* アイコンは lucide に該当が無いため、各サービスの単純化した字形を自前で持つ。
   図形の塗りなのでコントラスト要件の対象外（SectionHeader の飾り線と同じ扱い） */
const ICONS: Record<ShareService, React.ReactNode> = {
  x: <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.6L18.9 2Z" />,
  facebook: (
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
  ),
  hatena: (
    <path d="M3 3h5.6c2.8 0 4.3 1.2 4.3 3.3 0 1.4-.7 2.4-2 2.9 1.6.4 2.5 1.6 2.5 3.2 0 2.4-1.7 3.6-4.7 3.6H3V3Zm3.3 5.2h1.6c1 0 1.5-.4 1.5-1.2s-.5-1.2-1.5-1.2H6.3v2.4Zm0 5.3h1.9c1.1 0 1.7-.5 1.7-1.4 0-.9-.6-1.3-1.7-1.3H6.3v2.7ZM16.6 3h3.2v9h-3.2V3Zm0 10.6h3.2V17h-3.2v-3.4Z" />
  ),
  line: (
    <path d="M12 3C6.5 3 2 6.6 2 11c0 4 3.6 7.3 8.4 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1.1 1 .6s6.4-3.8 8.7-6.5c1.6-1.7 2.1-3.5 2.1-4.4C23 6.6 18.5 3 12 3Z" />
  ),
  pocket: (
    <path d="M3 4h18a2 2 0 0 1 2 2v5a11 11 0 0 1-22 0V6a2 2 0 0 1 2-2Zm3.6 5.7 4.7 4.5c.4.4 1 .4 1.4 0l4.7-4.5a1 1 0 0 0-1.4-1.4L12 12.1 7.9 8.3a1 1 0 1 0-1.4 1.4Z" />
  ),
};

export interface ShareButtonsProps {
  /** 共有対象の絶対 URL */
  url: string;
  /** 共有時に添えるタイトル */
  title: string;
  /** 出す共有先。既定は実測で確認できた5つ */
  services?: ShareService[];
  labels?: Partial<ShareButtonsLabels>;
}

/**
 * ShareButtons — SNS シェア。
 *
 * 計測タグは同梱しない（ベンダーの選択は利用側の決定）。
 * クリックを拾いたい場合は `Page.onCTAClick` ではなく通常のリンク計測を使うこと
 * （シェアは CTA ではない）。
 */
export function ShareButtons({ url, title, services, labels }: ShareButtonsProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const list = services ?? [...SHARE_SERVICES];

  return (
    <ul className={styles.list}>
      <li className={styles.label}>
        <Text as="span" size="body-sm" tone="muted">
          {l.heading}
        </Text>
      </li>
      {list.map((service) => (
        <li key={service}>
          <a
            className={styles.button}
            href={shareUrl(service, url, title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.service(service)}
          >
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              {ICONS[service]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
