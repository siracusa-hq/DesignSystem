import type { Meta, StoryObj } from '@storybook/react';
import { ArticleListSection } from '../../components/sections/article-list';
import type { ArticleListItem } from '../../components/sections/article-card';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * ArticleListSection — お知らせ / ブログの一覧（`article-list` 型）。
 *
 * **News とブログで同じ部品を使う。** 実測ではサムネイル付きカード型が
 * News 3/6・ブログ 5/7 で News だけが割れており、多数派のカードグリッドに寄せた
 * （サムネイル自体は任意。docs/research/research-news-blog.md §3-1）。
 *
 * **日付は ISO（`YYYY-MM-DD`）で渡す。** 表示書式（`YYYY.MM.DD`）はシステムが決める —
 * 実測が4通りに割れており、利用側に選ばせる根拠が無いため。
 */
const meta: Meta<typeof ArticleListSection> = {
  title: 'Sections/ArticleListSection',
  component: ArticleListSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ArticleListSection>;

const newsJa: ArticleListItem[] = [
  {
    href: '/news/soc2',
    title: 'Polastack が SOC 2 Type II 報告書を取得しました',
    publishedAt: '2026-07-30',
    category: 'プレスリリース',
    excerpt: 'セキュリティ・可用性・機密保持の3原則を対象に第三者評価を受けました。',
  },
  {
    href: '/news/audit-log',
    title: 'エージェントの実行ログを監査証跡として書き出せるようになりました',
    publishedAt: '2026-07-14',
    category: '製品アップデート',
  },
  {
    href: '/news/expo',
    title: 'Japan IT Week 2026 に出展します（小間番号 E-42）',
    publishedAt: '2026-06-26',
    category: 'イベント',
  },
  {
    href: '/news/scim',
    title: 'ピアデスクが Microsoft Entra ID の SCIM プロビジョニングに対応しました',
    publishedAt: '2025-12-02',
    category: '製品アップデート',
  },
];

const newsEn: ArticleListItem[] = [
  {
    href: '/news/soc2',
    title: 'Polastack has obtained a SOC 2 Type II report',
    publishedAt: '2026-07-30',
    category: 'Press release',
    excerpt: 'Covering security, availability and confidentiality.',
  },
  {
    href: '/news/audit-log',
    title: 'Agent execution logs can now be exported as an audit trail',
    publishedAt: '2026-07-14',
    category: 'Product update',
  },
  {
    href: '/news/expo',
    title: 'We will exhibit at Japan IT Week 2026 (booth E-42)',
    publishedAt: '2026-06-26',
    category: 'Event',
  },
  {
    href: '/news/scim',
    title: 'Peerdesk now supports SCIM provisioning with Microsoft Entra ID',
    publishedAt: '2025-12-02',
    category: 'Product update',
  },
];

const enLabels = {
  category: 'Category',
  year: 'Year',
  all: 'All',
  resultCount: (shown: number, total: number) => `${shown} of ${total}`,
  empty: 'No articles match the current filters.',
  previous: 'Previous',
  next: 'Next',
  pagination: 'Article list pagination',
};

/** News の一覧。サムネイル無し（実測 News 3/6 がこの形） */
export const News: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ArticleListSection
        title={isJa ? 'お知らせ' : 'News'}
        subtitle={
          isJa
            ? '製品のリリース、プレスリリース、イベント出展などをお知らせします。'
            : 'Product releases, press announcements and events.'
        }
        articles={isJa ? newsJa : newsEn}
        labels={isJa ? undefined : enLabels}
      />
    );
  },
};

/** ブログの一覧。サムネイル付き（実測 ブログ 5/7 がこの形） */
export const BlogWithThumbnails: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    const base = isJa ? newsJa : newsEn;
    return (
      <ArticleListSection
        title={isJa ? 'ブログ' : 'Blog'}
        subtitle={
          isJa ? '現場で得た知見を記事にしています。' : 'What we learn on the ground, written up.'
        }
        articles={base.map((a, i) => ({
          ...a,
          thumbnail: {
            src: photoPlaceholder(isJa ? '記事のサムネイル' : 'Article thumbnail', ['green', 'blue', 'sand'][i % 3] as 'green' | 'blue' | 'sand'),
            alt: isJa ? `${a.title} のサムネイル` : `Thumbnail for ${a.title}`,
          },
        }))}
        labels={isJa ? undefined : enLabels}
      />
    );
  },
};

/** ページ送りが出る状態（1ページ2件） */
export const WithPagination: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ArticleListSection
        title={isJa ? 'お知らせ' : 'News'}
        articles={isJa ? newsJa : newsEn}
        pageSize={2}
        labels={isJa ? undefined : enLabels}
      />
    );
  },
};

/** 該当が無いときの空状態 */
export const Empty: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ArticleListSection
        title={isJa ? 'お知らせ' : 'News'}
        articles={[]}
        labels={isJa ? undefined : enLabels}
      />
    );
  },
};
