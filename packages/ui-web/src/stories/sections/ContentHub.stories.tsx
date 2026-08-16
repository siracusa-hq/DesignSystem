import type { Meta, StoryObj } from '@storybook/react';
import { ContentHubSection } from '../../components/sections/content-hub';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * ContentHubSection — LP 末尾のコンテンツ回遊セクション。
 *
 * 製品系 LP の **9/13** が末尾に資料・セミナー・コラム・News の回遊を持つ
 * （実ブラウザ計測 16ページ。`[LP]` の 9/12 は分母を再現できず訂正した）。
 *
 * **系統ごとに塊を作る。** 複数系統を1つのグリッドに混ぜて種別ラベルで区別する形は
 * 実測 **0/11** で存在しない。種別ラベル自体も 0/17。
 *
 * **News だけ表示形が違う。** サムネイルは 資料/セミナー/コラム 9/10 が持つのに対し
 * **News は 0/7** で、日付つきの行リストになる。語彙（`ArticleListItem`）は共有し、
 * 表示形だけを枠の `kind` で分けている。
 *
 * **タブ・フィルタは作らない**（0/11 ページ・0/17 枠）。絞り込みは一覧型の仕事。
 */
const meta: Meta<typeof ContentHubSection> = {
  title: 'Sections/ContentHubSection',
  component: ContentHubSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ContentHubSection>;

const statusJa = { upcoming: '受付中', closed: '受付終了', archive: 'アーカイブ配信中' };
const formatJa = { online: 'オンライン', venue: '会場開催' };
const statusEn = { upcoming: 'Open', closed: 'Closed', archive: 'On demand' };
const formatEn = { online: 'Online', venue: 'In person' };

/** 実測の最頻構成: 2系統・各3件 */
export const 資料とお知らせ: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ContentHubSection
        title={isJa ? '関連コンテンツ' : 'More from Polastack'}
        groups={[
          {
            kind: 'resource',
            title: isJa ? 'お役立ち資料' : 'Resources',
            more: {
              label: isJa ? 'お役立ち資料を見る' : 'See all resources',
              href: '/resources',
            },
            items: [
              {
                href: '/dl/checklist',
                title: isJa ? 'エージェント導入チェックリスト' : 'Agent rollout checklist',
                category: isJa ? '導入の実務' : 'Implementation',
                cover: {
                  src: photoPlaceholder(isJa ? '導入チェックリスト' : 'Checklist', 'green'),
                  alt: isJa ? '導入チェックリストの表紙' : 'Checklist cover',
                },
              },
              {
                href: '/dl/cases',
                title: isJa ? 'Polastack 導入事例集 2026' : 'Customer stories 2026',
                category: isJa ? '事例' : 'Case studies',
                cover: {
                  src: photoPlaceholder(isJa ? '導入事例集' : 'Case studies', 'blue'),
                  alt: isJa ? '導入事例集の表紙' : 'Case studies cover',
                },
              },
              {
                href: '/dl/security',
                title: isJa ? 'セキュリティホワイトペーパー' : 'Security whitepaper',
                category: isJa ? 'セキュリティ' : 'Security',
                cover: {
                  src: photoPlaceholder(isJa ? 'セキュリティ' : 'Security', 'sand'),
                  alt: isJa ? 'セキュリティ資料の表紙' : 'Security whitepaper cover',
                },
              },
            ],
          },
          {
            kind: 'news',
            title: isJa ? 'お知らせ' : 'News',
            more: { label: isJa ? 'お知らせ一覧' : 'All news', href: '/news' },
            items: [
              {
                href: '/news/soc2',
                title: isJa
                  ? 'Polastack が SOC 2 Type II 報告書を取得しました'
                  : 'Polastack has obtained a SOC 2 Type II report',
                publishedAt: '2026-07-30',
                category: isJa ? 'プレスリリース' : 'Press release',
              },
              {
                href: '/news/audit-log',
                title: isJa
                  ? '実行ログを監査証跡として書き出せるようになりました'
                  : 'Execution logs can now be exported as an audit trail',
                publishedAt: '2026-07-14',
                category: isJa ? '製品アップデート' : 'Product update',
              },
              {
                href: '/news/expo',
                title: isJa
                  ? 'Japan IT Week 2026 に出展します'
                  : 'We will exhibit at Japan IT Week 2026',
                publishedAt: '2026-06-26',
                category: isJa ? 'イベント' : 'Event',
              },
              {
                href: '/news/scim',
                title: isJa
                  ? 'ピアデスクが SCIM プロビジョニングに対応しました'
                  : 'Peerdesk now supports SCIM provisioning',
                publishedAt: '2025-12-02',
                category: isJa ? '製品アップデート' : 'Product update',
              },
            ],
          },
        ]}
      />
    );
  },
};

/** 入口タイル（実測 n=6 / 5社・2枚が最頻）。個別コンテンツを出さず一覧へ送る */
export const 入口タイル: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ContentHubSection
        title={isJa ? 'さまざまな情報を発信しています' : 'Explore more'}
        groups={[
          {
            kind: 'index',
            tiles: [
              {
                href: '/resources',
                label: isJa ? 'お役立ち資料' : 'Resources',
                description: isJa
                  ? '導入の検討から運用まで、実務で使える資料を配布しています。'
                  : 'Practical material for evaluating and running Polastack.',
                action: isJa ? '資料を見る' : 'Browse resources',
                image: {
                  src: photoPlaceholder(isJa ? '資料一覧' : 'Resources', 'green'),
                  alt: isJa ? '資料ライブラリの案内' : 'Resource library',
                },
              },
              {
                href: '/seminar',
                label: isJa ? 'セミナー' : 'Seminars',
                description: isJa
                  ? '現場の実務に落とせる内容だけを扱います。参加費は無料です。'
                  : 'Practical sessions only. Free to attend.',
                action: isJa ? 'セミナーを見る' : 'Browse seminars',
                image: {
                  src: photoPlaceholder(isJa ? 'セミナー' : 'Seminars', 'blue'),
                  alt: isJa ? 'セミナー一覧の案内' : 'Seminar list',
                },
              },
            ],
          },
        ]}
      />
    );
  },
};

/**
 * 濃色の入口タイル。
 *
 * **濃色を持てるのは入口タイルだけ。** 実測でアイテムカードを濃色面に置いた例は 0 で、
 * 濃色として観測されたのは「大型カード」「帯」= タイルそのものの色だった。
 *
 * **ブランド面の上でブランド色をアクセントに使わない。** 面そのものがブランド色である以上、
 * 同系色は前に出ない。加えて corporate では対比 4.42:1 で AA を割る（2026-08-16 の指摘）。
 * 導線の文字は面の前景色（9.51:1）にしてある。
 */
export const 濃色の入口タイル: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ContentHubSection
        groups={[
          {
            kind: 'index',
            tone: 'brand',
            title: isJa ? 'お役立ちコンテンツ' : 'Useful content',
            tiles: [
              {
                href: '/resources',
                label: isJa ? 'お役立ち資料' : 'Resources',
                description: isJa ? '実務で使える資料を配布中。' : 'Practical material, free.',
                action: isJa ? '資料を見る' : 'Browse resources',
              },
              {
                href: '/blog',
                label: isJa ? 'ブログ' : 'Blog',
                description: isJa ? '現場で得た知見を記事にしています。' : 'What we learn, written up.',
                action: isJa ? 'ブログを見る' : 'Read the blog',
              },
            ],
          },
        ]}
      />
    );
  },
};

/** 3系統（資料 + セミナー + コラム）。1ページの系統数は中央値2・実測最大5 */
export const 三系統: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ContentHubSection
        title={isJa ? '関連コンテンツ' : 'More from Polastack'}
        groups={[
          {
            kind: 'resource',
            title: isJa ? 'お役立ち資料' : 'Resources',
            more: { label: isJa ? '資料一覧' : 'All resources', href: '/resources' },
            items: [
              { href: '/dl/1', title: isJa ? '導入チェックリスト' : 'Rollout checklist', cover: { src: photoPlaceholder('資料', 'green'), alt: isJa ? '資料の表紙' : 'Cover' } },
              { href: '/dl/2', title: isJa ? '導入事例集' : 'Customer stories', cover: { src: photoPlaceholder('資料', 'blue'), alt: isJa ? '資料の表紙' : 'Cover' } },
              { href: '/dl/3', title: isJa ? 'セキュリティ資料' : 'Security whitepaper', cover: { src: photoPlaceholder('資料', 'sand'), alt: isJa ? '資料の表紙' : 'Cover' } },
            ],
          },
          {
            kind: 'seminar',
            title: isJa ? 'セミナー' : 'Seminars',
            more: { label: isJa ? 'セミナー一覧' : 'All seminars', href: '/seminar' },
            statusLabels: isJa ? statusJa : statusEn,
            formatLabels: isJa ? formatJa : formatEn,
            viewableUntilLabel: isJa ? '視聴期限' : 'Available until',
            items: [
              {
                status: 'upcoming',
                href: '/seminar/1',
                title: isJa ? '現場の紙運用をどこから置き換えるか' : 'Where to start replacing paper',
                startAt: '2026-09-10T14:00',
                format: 'online',
                thumbnail: { src: photoPlaceholder(isJa ? 'セミナー' : 'Seminar', 'green'), alt: isJa ? 'セミナーの告知画像' : 'Seminar banner' },
              },
              {
                status: 'archive',
                href: '/seminar/2',
                title: isJa ? '権限設計の実務（アーカイブ）' : 'Designing permissions (on demand)',
                viewableUntil: '2026-12-31',
                format: 'online',
                thumbnail: { src: photoPlaceholder(isJa ? 'アーカイブ' : 'On demand', 'sand'), alt: isJa ? 'セミナーの告知画像' : 'Seminar banner' },
              },
            ],
          },
          {
            kind: 'article',
            title: isJa ? 'コラム' : 'Blog',
            more: { label: isJa ? 'コラム一覧' : 'All posts', href: '/blog' },
            items: [
              {
                href: '/blog/1',
                title: isJa ? 'エージェントに社内データを渡すとき' : 'Handing internal data to agents',
                publishedAt: '2026-07-14',
                thumbnail: { src: photoPlaceholder(isJa ? 'コラム' : 'Blog', 'blue'), alt: isJa ? 'コラムのサムネイル' : 'Blog thumbnail' },
              },
              {
                href: '/blog/2',
                title: isJa ? '監査証跡の粒度をどう決めるか' : 'Choosing audit trail granularity',
                publishedAt: '2026-06-20',
                thumbnail: { src: photoPlaceholder(isJa ? 'コラム' : 'Blog', 'green'), alt: isJa ? 'コラムのサムネイル' : 'Blog thumbnail' },
              },
            ],
          },
        ]}
      />
    );
  },
};
