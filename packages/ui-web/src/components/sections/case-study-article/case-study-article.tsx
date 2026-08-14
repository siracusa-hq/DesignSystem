import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import { SectionHeader } from '@/components/sections/section-header';
import { CaseCard, type CaseStudyMeta, type CaseStudyListItem } from '@/components/sections/case-card';
import { cn } from '@/lib/cn';
import styles from './case-study-article.module.css';

/**
 * 写真。alt は必須（既存 CaseStudy.photo / CaseStudyListItem.photo と同じ契約）。
 *
 * 実測では意味のある alt を書いているのは 9 サイト中 1 サイトだけだが
 * （docs/research/research-case-study-detail.md §3-6）、これは我々の既存決定を
 * 曲げる理由にならない。写真は実在性の証拠であって装飾ではない。
 */
export interface CasePhoto {
  src: string;
  alt: string;
  /** 話者名と肩書き。実測 2/9 が figcaption をこの用途に使う */
  caption?: string;
}

/** 話者。実測: 明示ブロックを持つのは 3/9、最大 4 名（マネーフォワード） */
export interface CaseSpeaker {
  name: string;
  /** 会社名 + 部署 + 役職（実測は1行で書かれる） */
  title: string;
}

/** 4名まで（実測の最大が 4。5人目は型エラーで落とす） */
export type CaseSpeakerList =
  | [CaseSpeaker]
  | [CaseSpeaker, CaseSpeaker]
  | [CaseSpeaker, CaseSpeaker, CaseSpeaker]
  | [CaseSpeaker, CaseSpeaker, CaseSpeaker, CaseSpeaker];

/** 問答（実測 4/9。h3 = 質問、段落 = 回答） */
export interface CaseQA {
  question: string;
  answer: string[];
}

/**
 * 章の中身。地の文か問答かはページ全体で1つに決める
 * （実測: 記事ごとに混在するサイトは無い）。LandingProof と同じ「どちらか一方」のユニオン。
 */
export type CaseChapterBody = { paragraphs: string[] } | { qa: CaseQA[] };

/** 章 = 見出し + 本文 + 写真1枚まで（実測: 章数 ≒ 写真枚数） */
export type CaseChapter = {
  heading: string;
  photo?: CasePhoto;
} & CaseChapterBody;

/**
 * 冒頭サマリー（実測 5/9）。
 * 課題と効果は必ず対で現れ（片方だけの例は 0/27）、決め手は任意（2/9 は持たない）。
 */
export interface CaseSummary {
  challenge: string[];
  /** 「導入の決め手」「解決策」。実測 3/9 */
  reason?: string[];
  effect: string[];
}

/**
 * UI 語彙。既定は日本語で、英語ページでは差し替える
 * （コンポーネントにハードコードテキストを持たせない方針の実装）。
 */
export interface CaseStudyArticleLabels {
  /** パンくず <nav> の aria-label */
  breadcrumb?: string;
  /** サマリーのラベル列（実測: freee はラベル文言だけ記事ごとに揺れる） */
  challenge?: string;
  reason?: string;
  effect?: string;
  /** プロフィールのラベル列。軸は一覧のフィルタ軸と同一 */
  industry?: string;
  employeeRange?: string;
  service?: string;
  challenges?: string;
  /** 関連事例セクション（パターンが記事の後ろに描画する）の語彙 */
  related?: string;
  readMore?: string;
  backToList?: string;
}

const DEFAULT_LABELS: Required<CaseStudyArticleLabels> = {
  breadcrumb: 'パンくず',
  challenge: '課題',
  reason: '決め手',
  effect: '効果',
  industry: '業種',
  employeeRange: '従業員規模',
  service: '利用サービス',
  challenges: '課題',
  related: '関連事例',
  readMore: '詳しく見る',
  backToList: '事例一覧をみる',
};

export interface CaseStudyArticleSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  /** 成果か課題を含む1文（実測 8/9 がこの型。会社名だけのタイトルは採らない） */
  title: string;
  /** 一覧への戻り導線。実測 9/9 が持つため必須 */
  backTo: { label: string; href: string };
  /** 冒頭写真（実測 8/9）。比率 1.9:1・高さ上限つきでシステムが正規化する */
  photo?: CasePhoto;
  /** 本文前のリード段落（実測 6/9） */
  lead?: string;
  /**
   * 公開日・取材時点（実測 2/9）。
   * `StatsSection` の `asOf` と違い **dev 警告は出さない**。記事には数値タイルが
   * 無く（実測 0/27）、日付の必須化を支える実測が 2/9 しかないため（§4-4）。
   */
  publishedAt?: string;
  /** 会社プロフィール。実測 9/9 が持つため必須 */
  profile: CaseStudyMeta;
  /** 話者（実測 3/9 が明示ブロック、3/9 が写真キャプション） */
  speakers?: CaseSpeakerList;
  /** 冒頭サマリー（実測 5/9） */
  summary?: CaseSummary;
  /** 本文。最低2章（実測の最小が 2 章）。中央値 5 章 */
  chapters: [CaseChapter, CaseChapter, ...CaseChapter[]];
  labels?: CaseStudyArticleLabels;
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className={styles.paragraph}>
          {p}
        </p>
      ))}
    </>
  );
}

function Figure({ photo, kind }: { photo: CasePhoto; kind: 'hero' | 'body' }) {
  return (
    <figure className={cn(styles.figure, kind === 'hero' && styles.heroFigure)}>
      <img
        className={cn(styles.photo, kind === 'hero' ? styles.heroPhoto : styles.bodyPhoto)}
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
      />
      {photo.caption && (
        <figcaption className={styles.caption}>
          <Text as="div" size="caption" tone="muted">
            {photo.caption}
          </Text>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * CaseStudyArticleSection — 個別事例記事の本体（`case-study-detail` 型）。
 *
 * 実測（9 サイト × 3 記事 = 27 記事。docs/research/research-case-study-detail.md）が
 * 示したのは「**サイト内では構成が完全に固定**（一致率 97.6%）、サイト間では割れる」
 * という性質である。したがって**記事ごとの構成の選択肢は作らない**。
 * 描画順（パンくず → タイトル → プロフィール → 写真 → サマリー → 章）はこの部品が決め、
 * 呼び出し側は内容だけを渡す。記事ごとに変わるのは章数・文字数・写真枚数という「量」だけ。
 *
 * **作らないもの（実測が根拠）:**
 *
 * - **冒頭の数値タイル / メトリクス行** — 実測 **0/27**。数値はタイトルと章見出しの
 *   文章の中にある。一覧カード（`CaseStudyListItem.metrics`）には数値バッジがあるが、
 *   記事側に同じものを持ち込む根拠は無い（§3-4）
 * - **引用の飾り枠（`blockquote`）** — 実測 **0/27**。発言は問答（`qa`）か、
 *   写真キャプションの話者名で示される（§3-5）
 * - **目次** — 実測 2/9。章見出しから自動生成できるので、必要になった時点で足せる
 * - **章ごとの面の交替** — 実測 9/9 が本文を単一の面に置く。記事全体で1セクションとして
 *   描画し、`Page` の面リズムが章のあいだに入らないようにしている（§4-5）
 *
 * ヒーローを持たないため、記事タイトルが `h1` を担う（`case-study-list` と同じ事情）。
 */
export const CaseStudyArticleSection = React.forwardRef<
  HTMLElement,
  CaseStudyArticleSectionProps
>(
  (
    {
      title,
      backTo,
      photo,
      lead,
      publishedAt,
      profile,
      speakers,
      summary,
      chapters,
      labels,
      ...props
    },
    ref,
  ) => {
    const l = { ...DEFAULT_LABELS, ...labels };

    /* プロフィールの軸は一覧のフィルタ軸と同一。値が無い軸は行ごと出さない */
    const profileRows: { label: string; value: string }[] = [
      { label: l.industry, value: profile.industry ?? '' },
      { label: l.employeeRange, value: profile.employeeRange ?? '' },
      { label: l.service, value: profile.service ?? '' },
      { label: l.challenges, value: (profile.challenges ?? []).join('・') },
    ].filter((row) => row.value !== '');

    const summaryRows = summary
      ? ([
          { label: l.challenge, items: summary.challenge },
          { label: l.reason, items: summary.reason },
          { label: l.effect, items: summary.effect },
        ].filter((row) => row.items && row.items.length > 0) as {
          label: string;
          items: string[];
        }[])
      : [];

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="lg">
          <article className={styles.article}>
            {/* 一覧への戻り導線（実測 9/9）。パンくずは 6/9 */}
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

            <h1 className={styles.title}>{title}</h1>

            {publishedAt && (
              <div className={styles.publishedAt}>
                <Text as="div" size="caption" tone="muted">
                  {publishedAt}
                </Text>
              </div>
            )}

            <div className={styles.profileHead}>
              {profile.companyLogo}
              <div className={styles.profileCompany}>{profile.companyName}</div>
            </div>
            {profileRows.length > 0 && (
              <dl className={styles.profile}>
                {profileRows.map((row) => (
                  <div key={row.label} className={styles.profileItem}>
                    <dt className={styles.profileLabel}>{row.label}</dt>
                    <dd className={styles.profileValue}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {photo && <Figure photo={photo} kind="hero" />}

            {speakers && speakers.length > 0 && (
              <div className={styles.speakers}>
                {speakers.map((s, i) => (
                  <div key={i}>
                    <Text as="div" size="body-sm" tone="muted">
                      {s.title}
                    </Text>
                    <div className={styles.speakerName}>{s.name}</div>
                  </div>
                ))}
              </div>
            )}

            {summaryRows.length > 0 && (
              <div className={styles.summary}>
                {summaryRows.map((row) => (
                  <div key={row.label} className={styles.summaryRow}>
                    <div className={styles.summaryLabel}>{row.label}</div>
                    <div className={styles.summaryBody}>
                      {row.items.map((item, i) => (
                        <div key={i}>{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lead && (
              <div className={styles.lead}>
                <p className={styles.paragraph}>{lead}</p>
              </div>
            )}

            <div className={styles.chapters}>
              {chapters.map((chapter, i) => (
                <section key={i} className={styles.chapter}>
                  <h2 className={styles.chapterHeading}>{chapter.heading}</h2>
                  {'qa' in chapter ? (
                    chapter.qa.map((qa, qi) => (
                      <div key={qi} className={styles.qa}>
                        {/* 「―― 」はインタビュー問答の定型として システムが付与する
                            （書き手に覚えさせない。モック確定形 2026-08-14） */}
                        <h3 className={styles.question}>&#8213;&#8213; {qa.question}</h3>
                        <Paragraphs items={qa.answer} />
                      </div>
                    ))
                  ) : (
                    <Paragraphs items={chapter.paragraphs} />
                  )}
                  {chapter.photo && <Figure photo={chapter.photo} kind="body" />}
                </section>
              ))}
            </div>
          </article>
        </Container>
      </Section>
    );
  },
);
CaseStudyArticleSection.displayName = 'CaseStudyArticleSection';

export interface CaseStudyRelatedSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  /** 関連事例（実測 9/9・3 件が最頻）。一覧のカードをそのまま使う */
  cases: CaseStudyListItem[];
  /** 一覧への戻り導線（実測 9/9。明示リンクは 4/9） */
  backTo: { label: string; href: string };
  labels?: Pick<CaseStudyArticleLabels, 'related' | 'readMore' | 'backToList'>;
}

/**
 * 記事末尾の「関連事例」（実測 9/9・2〜9 件。3 件が最頻 5/9）。
 *
 * カードは一覧ページと**同じ `CaseCard`** を使う（見た目の二重実装を作らない）。
 * `case-study-detail` パターンが記事本体の直後に置く。
 */
export const CaseStudyRelatedSection = React.forwardRef<
  HTMLElement,
  CaseStudyRelatedSectionProps
>(({ cases, backTo, labels, ...props }, ref) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  return (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader title={l.related} headingSize="heading-lg" />
        <Grid columns={3} gap="lg">
          {cases.map((c, i) => (
            <CaseCard key={i} item={c} readMore={l.readMore} />
          ))}
        </Grid>
        <div className={styles.relatedFooter}>
          <Link href={backTo.href} variant="arrow">
            {l.backToList}
          </Link>
        </div>
      </Container>
    </Section>
  );
});
CaseStudyRelatedSection.displayName = 'CaseStudyRelatedSection';
