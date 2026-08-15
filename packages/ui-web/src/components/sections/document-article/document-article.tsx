import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import styles from './document-article.module.css';

/** 要点パネルの1行（法務文書の対象範囲・記事の前提など） */
export interface DocumentPanelItem {
  label: string;
  body: string;
}

export interface DocumentArticleLabels {
  /** パンくずの aria-label */
  breadcrumb: string;
  /** 更新日の前置き。例: 「最終更新」 */
  updated: string;
}

const DEFAULT_LABELS: DocumentArticleLabels = {
  breadcrumb: 'パンくず',
  updated: '最終更新',
};

export interface DocumentArticleProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  /** ページタイトル。この部品が h1 を出す */
  title: string;
  /**
   * 親ページへの戻り導線。**任意**。
   * 渡すとパンくずも組む。法務文書は単独で成立するため必須にしていない。
   */
  backTo?: { label: string; href: string };
  /** 制定日・公開日。表示に使う文字列をそのまま渡す（このパッケージは文言を持たない） */
  publishedAt?: string;
  /** 改定履歴のある法務文書向け */
  updatedAt?: string;
  /** リード文。段落の配列 */
  lead?: string[];
  /** 任意。冒頭の要点パネル（意匠は事例記事の冒頭サマリーと共有） */
  panel?: DocumentPanelItem[];
  labels?: Partial<DocumentArticleLabels>;
  /**
   * 本文。**Markdown → HTML の変換はこのパッケージの責務ではない。**
   * 変換済みの内容を渡すと、組版（見出し階層・表・リスト・引用）だけを DS が担う。
   * 依存を増やさないため、パーサは同梱しない。
   */
  children?: React.ReactNode;
}

/**
 * DocumentArticle — 法務文書・静的文書の器。
 *
 * 対象は**プライバシーポリシー・利用規約・特商法表記といった法務文書と、404 等の
 * 静的ページ**。Markdown から生成した本文を受け、組版だけを DS が担う。
 *
 * **お知らせ・ブログの記事はこの部品の担当ではない。** 記事は `article-detail`
 * ページ型（`ArticleBodySection` + 著者 + 目次 + シェア）が担う
 * （packages/ui-web/docs/article-pages-workorder.md）。記事固有の語彙
 * （カテゴリ・著者・関連記事）をここに足さないこと。
 *
 * 組版は CaseStudyArticleSection と同じ実測値（読み幅 46.5rem・本文 16px /
 * 行間 1.80・章見出し 26px）を使い、読み物の組版を2つ持たない。
 * 本文は単一の面に置く（実測 9/9）。Page の面リズムは外側でだけ働く。
 */
export const DocumentArticle = React.forwardRef<HTMLElement, DocumentArticleProps>(
  (
    {
      title,
      backTo,
      publishedAt,
      updatedAt,
      lead,
      panel,
      labels,
      children,
      ...props
    },
    ref,
  ) => {
    const l = { ...DEFAULT_LABELS, ...labels };

    return (
      <Section ref={ref} background="default" spacing="md" {...props}>
        <Container size="lg">
          <article className={styles.article}>
            {backTo && (
              <nav className={styles.breadcrumb} aria-label={l.breadcrumb}>
                <ol className={styles.breadcrumbList}>
                  <li>
                    <Link href={backTo.href} variant="subtle">
                      {backTo.label}
                    </Link>
                  </li>
                  <li aria-hidden="true" className={styles.breadcrumbSeparator}>
                    /
                  </li>
                  <li className={styles.breadcrumbCurrent} aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            )}

            <h1 className={styles.title}>{title}</h1>

            {publishedAt && (
              <div className={styles.meta}>
                <Text as="span" size="body-sm" tone="muted">
                  <span className={styles.date}>{publishedAt}</span>
                </Text>
              </div>
            )}

            {lead && lead.length > 0 && (
              <div className={styles.lead}>
                {lead.map((p, i) => (
                  <p key={i} className={styles.leadParagraph}>
                    {p}
                  </p>
                ))}
              </div>
            )}

            {panel && panel.length > 0 && (
              <div className={styles.panel}>
                {panel.map((item, i) => (
                  <div key={i} className={styles.panelRow}>
                    <div className={styles.panelLabel}>{item.label}</div>
                    <div className={styles.panelBody}>{item.body}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Markdown 由来の HTML はここに入る。組版だけが DS の管理下 */}
            <div className={styles.prose}>{children}</div>

            {updatedAt && (
              <div className={styles.updated}>
                <Text size="body-sm" tone="muted">
                  {l.updated}: {updatedAt}
                </Text>
              </div>
            )}
          </article>
        </Container>
      </Section>
    );
  },
);
DocumentArticle.displayName = 'DocumentArticle';
