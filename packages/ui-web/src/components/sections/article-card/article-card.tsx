import * as React from 'react';
import { Text } from '@/components/primitives/text';
import { formatArticleDate } from '@/lib/article-date';
import styles from './article-card.module.css';

/**
 * 記事1件のカード語彙。
 *
 * **一覧・関連記事・ContentHub がこの1つの型を共有する**（article-pages-workorder.md §2。
 * `CaseStudyMeta` を一覧と記事で共有したのと同じ効き方を狙う）。
 */
export interface ArticleListItem {
  href: string;
  title: string;
  /**
   * 公開日。**ISO 8601（`YYYY-MM-DD`）で渡す。**
   * 表示書式はシステムが決める（実測が4通りに割れているため。§3-1）。
   */
  publishedAt: string;
  /** カテゴリ・種別。実測: News 8/12・ブログ 15/15 */
  category?: string;
  /** 抜粋文。実測 News 1/7・ブログ 2/7 と少数だが、持つサイトがある */
  excerpt?: string;
  /** サムネイル。実測 News 3/6・ブログ 5/7。alt には内容を書く */
  thumbnail?: { src: string; alt: string };
}

export interface ArticleCardProps {
  item: ArticleListItem;
}

/**
 * ArticleCard — 記事カード。
 *
 * **`CaseCard` は変更しない。** 事例カードは会社名・数値バッジ・業種などの
 * 構造化メタを持つが、記事カードはそれを1つも持たない（実測 0/27 の逆で、
 * 事例だけが持つ要素）。意匠だけを揃え、語彙は分ける。
 */
export function ArticleCard({ item }: ArticleCardProps) {
  return (
    <a className={styles.card} href={item.href}>
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
          <Text as="span" size="body-sm" tone="muted">
            <time className={styles.date} dateTime={item.publishedAt}>
              {formatArticleDate(item.publishedAt)}
            </time>
          </Text>
          {item.category && <span className={styles.category}>{item.category}</span>}
        </div>
        <div className={styles.title}>{item.title}</div>
        {item.excerpt && (
          <div className={styles.excerpt}>
            <Text as="p" size="body-sm" tone="muted">
              {item.excerpt}
            </Text>
          </div>
        )}
      </div>
    </a>
  );
}
