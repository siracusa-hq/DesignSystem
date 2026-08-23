import * as React from 'react';
import { Text } from '@/components/primitives/text';
import { Badge } from '@/components/primitives/badge';
import type { ContentImage } from '@/lib/content-vocabulary';
import styles from './resource-card.module.css';

export interface ResourceListItem {
  /**
   * 遷移先。
   *
   * **「詳細ページ」とも「フォーム」とも決めない。** 実測では
   * 詳細ページ経由（SmartHR / カミナシ / MF / ANDPAD ほか 7サイト）と
   * フォーム直行（Sansan / Bill One）の**両方が実在する**
   * （acquisition-pages-workorder.md §9-1）。どちらかに固定すると片方が組めない。
   */
  href: string;
  title: string;
  /** 表紙画像。資料の顔なので実質必須だが、無い資料もあるため任意 */
  cover?: ContentImage;
  category?: string;
  description?: string;
  /** 「新着」「人気」等のバッジ。文言は利用側が決める */
  badge?: string;
}

export interface ResourceCardProps {
  item: ResourceListItem;
}

/**
 * ResourceCard — 資料カード。
 *
 * **日付を持たない**（実測 0/7）。記事カードとの最大の違いがこれで、
 * `ArticleListItem` に寄せられなかった理由でもある（Slice 0 の結論）。
 * **形式表記（PDF / ページ数）も持たない**（実測 0/13）。
 */
export function ResourceCard({ item }: ResourceCardProps) {
  return (
    <a className={styles.card} href={item.href}>
      {item.cover && (
        <img className={styles.cover} src={item.cover.src} alt={item.cover.alt} loading="lazy" />
      )}
      <div className={styles.body}>
        {(item.category || item.badge) && (
          <div className={styles.meta}>
            {item.badge && <Badge variant="new">{item.badge}</Badge>}
            {item.category && <span className={styles.category}>{item.category}</span>}
          </div>
        )}
        <div className={styles.title}>{item.title}</div>
        {item.description && (
          <div className={styles.description}>
            <Text as="p" size="body-sm" tone="muted">
              {item.description}
            </Text>
          </div>
        )}
      </div>
    </a>
  );
}
