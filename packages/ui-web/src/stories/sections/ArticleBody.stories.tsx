import type { Meta, StoryObj } from '@storybook/react';
import {
  ArticleBodySection,
  ArticleRelatedSection,
  type ArticleChapter,
} from '../../components/sections/article-body';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * ArticleBodySection — News / ブログの記事本体（`article-detail` 型）。
 *
 * **`kind` で News とブログを分ける判別ユニオン。** News には著者・監修者・目次・更新日が
 * **型として存在しない**（実測 0/12）。両方 optional の1型にすると
 * 「著者と目次を持つ News」という実測に無い構成が型で許されてしまう。
 *
 * 読み幅・本文寸法は `CaseStudyArticleSection` と共有する。
 * 実ブラウザ計測（2026-08-15）でブログ 680px / News 780px / 全16本 725px に対し
 * 現行 46.5rem（744px）との差は 2.6% で、種別ごとに割らない判断をした
 * （docs/article-pages-workorder.md §9-1）。
 */
const meta: Meta<typeof ArticleBodySection> = {
  title: 'Sections/ArticleBodySection',
  component: ArticleBodySection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ArticleBodySection>;

const chaptersJa: [ArticleChapter, ...ArticleChapter[]] = [
  {
    heading: '取得の概要',
    paragraphs: [
      '今回取得したのは、セキュリティ・可用性・機密保持の3原則を対象とした Type II 報告書です。Type I が「ある時点で統制が設計されているか」を見るのに対し、Type II は一定期間にわたって統制が実際に機能していたかを検証します。',
      '監査対象期間は2025年8月1日から2026年6月30日までの11か月間です。',
    ],
  },
  {
    heading: 'お客様への影響',
    paragraphs: [
      '既存のご契約内容および料金に変更はありません。セキュリティチェックシートへの回答時に、報告書をもって代替いただけるようになります。',
    ],
  },
  {
    heading: '今後の予定',
    paragraphs: [
      '年次での更新監査を継続します。2026年度中に対象範囲をオンプレミス版へ拡大する予定です。',
    ],
  },
];

const chaptersEn: [ArticleChapter, ...ArticleChapter[]] = [
  {
    heading: 'Overview',
    paragraphs: [
      'The report covers security, availability and confidentiality. Type II verifies that controls operated effectively over a period of time, rather than at a single point.',
    ],
  },
  {
    heading: 'What this means for customers',
    paragraphs: [
      'There is no change to existing contracts or pricing. The report can be used in place of answering security questionnaires.',
    ],
  },
];

/** News 記事。著者も目次も持たない（実測 0/12） */
export const NewsArticle: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ArticleBodySection
        kind="news"
        title={
          isJa
            ? 'Polastack が SOC 2 Type II 報告書を取得しました'
            : 'Polastack has obtained a SOC 2 Type II report'
        }
        publishedAt="2026-07-30"
        category={isJa ? 'プレスリリース' : 'Press release'}
        backTo={{ label: isJa ? 'お知らせ一覧' : 'News', href: '/news' }}
        lead={
          isJa
            ? ['2026年7月30日付で、Polastack の運用体制について SOC 2 Type II の報告書を取得しました。']
            : ['As of 30 July 2026, Polastack has obtained a SOC 2 Type II report.']
        }
        chapters={isJa ? chaptersJa : chaptersEn}
        share={{ url: 'https://example.com/news/soc2' }}
        labels={
          isJa
            ? undefined
            : { breadcrumb: 'Breadcrumb', share: { heading: 'Share', service: (s) => `Share on ${s}` } }
        }
      />
    );
  },
};

/** ブログ記事。著者・監修者・目次・更新日を持つ */
export const BlogArticle: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ArticleBodySection
        kind="blog"
        title={isJa ? '人事評価制度のつくり方' : 'How to design a performance review system'}
        publishedAt="2026-07-14"
        updatedAt="2026-08-01"
        category={isJa ? '人事評価' : 'Performance'}
        backTo={{ label: isJa ? 'ブログ一覧' : 'Blog', href: '/blog' }}
        photo={{
          src: photoPlaceholder(isJa ? '記事のヒーロー写真' : 'Article hero', 'green', '1.9:1'),
          alt: isJa ? '会議室で評価制度を議論する様子' : 'A team discussing review criteria',
        }}
        author={{
          name: isJa ? '金子 卓也' : 'Takuya Kaneko',
          role: isJa ? '編集部' : 'Editorial',
          bio: isJa ? '人事・労務領域の記事を担当。' : 'Covers HR and labour topics.',
          photo: {
            src: photoPlaceholder('Author', 'green', '1:1'),
            alt: isJa ? '執筆者 金子 卓也のポートレート' : 'Portrait of Takuya Kaneko',
          },
        }}
        supervisor={{
          name: isJa ? '田中 花子' : 'Hanako Tanaka',
          role: isJa ? '社会保険労務士' : 'Certified labour consultant',
        }}
        chapters={isJa ? chaptersJa : chaptersEn}
        toc
        share={{ url: 'https://example.com/blog/review' }}
        labels={
          isJa
            ? undefined
            : {
                breadcrumb: 'Breadcrumb',
                toc: 'Contents',
                author: 'Written by',
                supervisor: 'Reviewed by',
                updated: 'Last updated',
                share: { heading: 'Share', service: (s) => `Share on ${s}` },
              }
        }
      />
    );
  },
};

/** 関連記事（実測 ブログ 15/15。1セクションで足りる） */
export const Related: StoryObj<typeof ArticleRelatedSection> = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ArticleRelatedSection
        title={isJa ? '関連記事' : 'Related articles'}
        backTo={{ label: isJa ? '一覧をみる' : 'See all', href: '/blog' }}
        articles={[
          {
            href: '/blog/a',
            title: isJa ? '目標設定の型を決める' : 'Setting goals that hold up',
            publishedAt: '2026-07-01',
            category: isJa ? '人事評価' : 'Performance',
          },
          {
            href: '/blog/b',
            title: isJa ? '1on1 を続けるための仕組み' : 'Making 1-on-1s stick',
            publishedAt: '2026-06-10',
            category: isJa ? 'マネジメント' : 'Management',
          },
          {
            href: '/blog/c',
            title: isJa ? '評価者研修に何を入れるか' : 'What belongs in reviewer training',
            publishedAt: '2026-05-20',
            category: isJa ? '人事評価' : 'Performance',
          },
        ]}
      />
    );
  },
};
