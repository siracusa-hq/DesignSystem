import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import { Grid } from '@/components/primitives/grid';
import { SectionHeader } from '@/components/sections/section-header';
import { ArticleCard, type ArticleListItem } from '@/components/sections/article-card';
import { ShareButtons, type ShareButtonsLabels } from '@/components/sections/share-buttons';
import { formatArticleDate } from '@/lib/article-date';
import styles from './article-body.module.css';

export interface ArticlePhoto {
  src: string;
  /** 何が写っているかを書く。装飾なら空文字にする */
  alt: string;
  caption?: string;
}

/** 章 = 見出し + 段落（+ 写真1枚まで）。構成は固定で、種類は選ばせない */
export interface ArticleChapter {
  heading: string;
  paragraphs: string[];
  photo?: ArticlePhoto;
}

/** 著者・監修者（ブログのみ）。実測: 著者 14/15・監修者 3/15 */
export interface ArticlePerson {
  name: string;
  /** 肩書き・所属 */
  role?: string;
  /** プロフィール文 */
  bio?: string;
  photo?: { src: string; alt: string };
}

export interface ArticleBodyLabels {
  breadcrumb: string;
  /** 目次の見出し。例: 「目次」 */
  toc: string;
  /** 著者の前置き。例: 「執筆」 */
  author: string;
  /** 監修者の前置き。例: 「監修」 */
  supervisor: string;
  /** 更新日の前置き。例: 「最終更新」 */
  updated: string;
  share: Partial<ShareButtonsLabels>;
}

const DEFAULT_LABELS: ArticleBodyLabels = {
  breadcrumb: 'パンくず',
  toc: '目次',
  author: '執筆',
  supervisor: '監修',
  updated: '最終更新',
  share: {},
};

interface ArticleBodyCommon
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  title: string;
  /** ISO 8601（`YYYY-MM-DD`）。表示書式はシステムが決める */
  publishedAt: string;
  category?: string;
  /** 一覧への戻り導線。実測 News 10/12・ブログ 11/15 のため**必須にしない** */
  backTo?: { label: string; href: string };
  photo?: ArticlePhoto;
  lead?: string[];
  /** 本文の章。最低1章 */
  chapters: [ArticleChapter, ...ArticleChapter[]];
  /** シェアボタン。URL を渡したときだけ出る（News 8/12・ブログ 15/15） */
  share?: { url: string };
  labels?: Partial<ArticleBodyLabels>;
}

/**
 * News 記事。
 *
 * **著者・目次・更新日・監修者は型として存在しない**（実測 0/12）。
 * optional にもしないのは、両方 optional の1型にすると
 * 「著者と目次を持つ News」という実測に無い構成が型で許されるため
 * （article-pages-workorder.md §2）。
 */
export interface NewsBodyProps extends ArticleBodyCommon {
  kind: 'news';
}

/** ブログ記事。著者（14/15）・目次（12/15）・更新日（5/15）・監修者（3/15）を持てる */
export interface BlogBodyProps extends ArticleBodyCommon {
  kind: 'blog';
  author?: ArticlePerson;
  supervisor?: ArticlePerson;
  /** ISO 8601。公開日と別に持つ */
  updatedAt?: string;
  /** 章見出しからの目次を出す */
  toc?: boolean;
}

export type ArticleBodySectionProps = NewsBodyProps | BlogBodyProps;

/**
 * 章のアンカー ID（目次と本文で同じ規則を使う）。
 *
 * `React.useId()` は `:r0:` のようにコロンを含む。HTML の id としては有効だが
 * **CSS セレクタでは扱えない**ため、`querySelector('#…')` や
 * `scroll-margin` のデバッグで詰まる。コロンだけ落として使う
 * （SSR とクライアントで同じ値になるので hydration は壊れない）。
 */
const chapterId = (uid: string, index: number) =>
  `${uid.replace(/:/g, '')}-chapter-${index + 1}`;

function PersonBlock({ person, label }: { person: ArticlePerson; label: string }) {
  return (
    <div className={styles.author}>
      {person.photo ? (
        <img
          className={styles.authorPhoto}
          src={person.photo.src}
          alt={person.photo.alt}
          loading="lazy"
        />
      ) : (
        <div className={styles.authorInitial} aria-hidden="true">
          {[...person.name][0]}
        </div>
      )}
      <div>
        <div className={styles.authorRole}>
          {label}
          {person.role ? ` / ${person.role}` : ''}
        </div>
        <div className={styles.authorName}>{person.name}</div>
        {person.bio && (
          <Text as="p" size="body-sm" tone="secondary">
            {person.bio}
          </Text>
        )}
      </div>
    </div>
  );
}

function Figure({ photo, className }: { photo: ArticlePhoto; className: string }) {
  return (
    <figure className={styles.figure}>
      <img className={className} src={photo.src} alt={photo.alt} loading="lazy" />
      {photo.caption && (
        <figcaption className={styles.caption}>
          <Text size="body-sm" tone="muted">
            {photo.caption}
          </Text>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * ArticleBodySection — News / ブログの記事本体。
 *
 * **分割しない。** 実測が「サイト内で構成は固定」と言っている以上、細かく分けても
 * 組み合わせの自由度は要らず、分けると順序を間違える余地が生まれる
 * （CaseStudyArticleSection と同じ判断）。
 *
 * 読み幅・本文寸法は CaseStudyArticleSection と共有する（§9-1 の実測で確定）。
 * 記事本文は単一の面に置き、章のあいだに Page の面リズムを入れない。
 */
export const ArticleBodySection = React.forwardRef<HTMLElement, ArticleBodySectionProps>(
  (props, ref) => {
    const {
      title,
      publishedAt,
      category,
      backTo,
      photo,
      lead,
      chapters,
      share,
      labels,
      kind,
      ...rest
    } = props;
    const l = { ...DEFAULT_LABELS, ...labels };
    const uid = React.useId();

    const blog = kind === 'blog' ? (props as BlogBodyProps) : undefined;
    // 目次は章が2つ以上あるときだけ意味がある
    const showToc = !!blog?.toc && chapters.length > 1;

    /* 判別ユニオンの片側だけに存在する props を DOM へ素通ししない
       （HeroSection の offers で踏んだのと同じ事故を避ける） */
    const domProps = { ...rest } as Record<string, unknown>;
    for (const key of ['author', 'supervisor', 'updatedAt', 'toc']) delete domProps[key];

    return (
      <Section ref={ref} background="default" spacing="md" {...domProps}>
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

            <div className={styles.meta}>
              <Text as="span" size="body-sm" tone="muted">
                <time className={styles.date} dateTime={publishedAt}>
                  {formatArticleDate(publishedAt)}
                </time>
              </Text>
              {category && <span className={styles.category}>{category}</span>}
            </div>

            {photo && <Figure photo={photo} className={styles.heroPhoto} />}

            {blog?.author && <PersonBlock person={blog.author} label={l.author} />}
            {blog?.supervisor && <PersonBlock person={blog.supervisor} label={l.supervisor} />}

            {lead && lead.length > 0 && (
              <div className={styles.lead}>
                {lead.map((p, i) => (
                  <p key={i} className={styles.paragraph}>
                    {p}
                  </p>
                ))}
              </div>
            )}

            {showToc && (
              <nav className={styles.toc} aria-labelledby={`${uid}-toc`}>
                <p className={styles.tocHeading} id={`${uid}-toc`}>
                  {l.toc}
                </p>
                <ol className={styles.tocList}>
                  {chapters.map((c, i) => (
                    <li key={i}>
                      <a className={styles.tocLink} href={`#${chapterId(uid, i)}`}>
                        {c.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className={styles.chapters}>
              {chapters.map((c, i) => (
                <section key={i} className={styles.chapter} id={chapterId(uid, i)}>
                  <h2 className={styles.chapterHeading}>{c.heading}</h2>
                  {c.paragraphs.map((p, j) => (
                    <p key={j} className={styles.paragraph}>
                      {p}
                    </p>
                  ))}
                  {c.photo && <Figure photo={c.photo} className={styles.photo} />}
                </section>
              ))}
            </div>

            {(share || blog?.updatedAt) && (
              <div className={styles.footer}>
                {blog?.updatedAt ? (
                  <Text size="body-sm" tone="muted">
                    {l.updated}: {formatArticleDate(blog.updatedAt)}
                  </Text>
                ) : (
                  <span />
                )}
                {share && <ShareButtons url={share.url} title={title} labels={l.share} />}
              </div>
            )}
          </article>
        </Container>
      </Section>
    );
  },
);
ArticleBodySection.displayName = 'ArticleBodySection';

/* ============================================================
   関連記事（実測: ブログ 15/15 が持つ。1セクションで足りる — 複数分割は 6/15）
   ============================================================ */

export interface ArticleRelatedSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  articles: ArticleListItem[];
  /** 見出し。実測で12通りに割れているため必ず利用側が渡す */
  title: React.ReactNode;
  /** 一覧への導線（任意） */
  backTo?: { label: string; href: string };
}

export const ArticleRelatedSection = React.forwardRef<HTMLElement, ArticleRelatedSectionProps>(
  ({ articles, title, backTo, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="md" {...props}>
      <Container>
        <SectionHeader title={title} headingSize="display-sm" />
        <Grid columns={3} gap="lg">
          {articles.map((a, i) => (
            <ArticleCard key={i} item={a} />
          ))}
        </Grid>
        {backTo && (
          <div className={styles.relatedFooter}>
            <Link href={backTo.href} variant="arrow">
              {backTo.label}
            </Link>
          </div>
        )}
      </Container>
    </Section>
  ),
);
ArticleRelatedSection.displayName = 'ArticleRelatedSection';
