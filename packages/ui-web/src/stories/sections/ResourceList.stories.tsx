import type { Meta, StoryObj } from '@storybook/react';
import { ResourceListSection } from '../../components/sections/resource-list';
import type { ResourceListItem } from '../../components/sections/resource-card';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * ResourceListSection — 資料ライブラリ（`resources-library` 型）。
 *
 * **記事一覧と違い、日付もページャも持たない**（実測 日付 0/7・無限スクロール 0/31）。
 * 形式表記（PDF / ページ数）も持たない（0/13）。
 *
 * カードの遷移先は**詳細ページでもフォームでもよい** — 実測に両方が存在する
 * （詳細ページ経由7サイト / フォーム直行 Sansan・Bill One。
 * docs/acquisition-pages-workorder.md §9-1）。
 */
const meta: Meta<typeof ResourceListSection> = {
  title: 'Sections/ResourceListSection',
  component: ResourceListSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ResourceListSection>;

const cover = (label: string, tint: 'green' | 'blue' | 'sand') => ({
  src: photoPlaceholder(label, tint, '3:2'),
  alt: `${label}の表紙`,
});

const ja: ResourceListItem[] = [
  {
    href: '/dl/agent-checklist',
    title: 'エージェント導入チェックリスト（全24項目）',
    category: '導入の実務',
    description: '権限設計・監査証跡・保存先の3点を、稟議前に確認できる形にまとめました。',
    cover: cover('導入チェックリスト', 'green'),
    badge: '新着',
  },
  {
    href: '/form/download_cases',
    title: 'Polastack 導入事例集 2026',
    category: '事例',
    description: '製造・小売・金融の6社の導入前後を掲載。',
    cover: cover('導入事例集', 'blue'),
  },
  {
    href: '/dl/security-whitepaper',
    title: 'セキュリティホワイトペーパー',
    category: 'セキュリティ',
    description: 'SOC 2 Type II の対象範囲と、データの取り扱いを説明します。',
    cover: cover('セキュリティ', 'sand'),
  },
  {
    href: '/dl/roi',
    title: '投資対効果の考え方',
    category: '導入の実務',
    cover: cover('投資対効果', 'green'),
  },
];

const en: ResourceListItem[] = [
  {
    href: '/dl/agent-checklist',
    title: 'Agent rollout checklist (24 items)',
    category: 'Implementation',
    description: 'Permissions, audit trails and storage — settled before you write the proposal.',
    cover: cover('Checklist', 'green'),
    badge: 'New',
  },
  {
    href: '/form/download_cases',
    title: 'Polastack customer stories 2026',
    category: 'Case studies',
    cover: cover('Case studies', 'blue'),
  },
  {
    href: '/dl/security-whitepaper',
    title: 'Security whitepaper',
    category: 'Security',
    cover: cover('Security', 'sand'),
  },
];

const enLabels = {
  category: 'Category',
  all: 'All',
  resultCount: (shown: number, total: number) => `${shown} of ${total}`,
  empty: 'No resources match the current filter.',
};

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ResourceListSection
        title={isJa ? 'お役立ち資料' : 'Resources'}
        subtitle={
          isJa
            ? '導入の検討から運用まで、実務で使える資料を配布しています。'
            : 'Practical material for evaluating and running Polastack.'
        }
        resources={isJa ? ja : en}
        labels={isJa ? undefined : enLabels}
      />
    );
  },
};

/** ピックアップ枠つき（先頭に大きめに出す。フィルタの影響を受けない） */
export const WithPickup: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    const list = isJa ? ja : en;
    return (
      <ResourceListSection
        title={isJa ? 'お役立ち資料' : 'Resources'}
        resources={list}
        pickup={[list[0]]}
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
      <ResourceListSection
        title={isJa ? 'お役立ち資料' : 'Resources'}
        resources={[]}
        labels={isJa ? undefined : enLabels}
      />
    );
  },
};
