import type { Meta, StoryObj } from '@storybook/react';
import { BentoGrid } from '../../components/sections/bento-grid';

const meta: Meta<typeof BentoGrid> = {
  title: 'Sections/BentoGrid',
  component: BentoGrid,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BentoGrid>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <BentoGrid
        eyebrow={isJa ? 'プラットフォーム' : 'PLATFORM'}
        title={isJa ? '統合アーキテクチャ' : 'Integrated Architecture'}
        items={
          isJa
            ? [
                {
                  title: 'PolaAuth + PolaStore',
                  description: '認証とデータを一体化。RLS/FLSがアーキテクチャレベルで保証されます。',
                  span: 2,
                  content: (
                    <div className="flex h-32 items-center justify-center rounded-xl bg-primary-50 text-sm text-primary-500 dark:bg-primary-950">
                      認証 × データ統合図
                    </div>
                  ),
                },
                {
                  title: 'PolaGate',
                  description: 'スキーマからSDK・OpenAPI・MCPサーバーを自動生成。',
                },
                {
                  title: 'PolaFind',
                  description: 'typo tolerant全文検索。日本語完全対応。',
                },
                {
                  title: 'PolaLens',
                  description: 'セマンティックレイヤーでBigQuery + Cubeを統合。',
                },
                {
                  title: 'PolaCast + PolaWatch + PolaNest',
                  description: 'イベント連携・監視・ホスティングを統合管理。Zero DevOpsを実現。',
                  span: 2,
                },
              ]
            : [
                {
                  title: 'PolaAuth + PolaStore',
                  description: 'Unified auth and data. RLS/FLS guaranteed at architecture level.',
                  span: 2,
                  content: (
                    <div className="flex h-32 items-center justify-center rounded-xl bg-primary-50 text-sm text-primary-500 dark:bg-primary-950">
                      Auth × Data Integration
                    </div>
                  ),
                },
                {
                  title: 'PolaGate',
                  description: 'Auto-generates SDK, OpenAPI, and MCP server from schema.',
                },
                {
                  title: 'PolaFind',
                  description: 'Typo tolerant full-text search. Full Japanese support.',
                },
                {
                  title: 'PolaLens',
                  description: 'Semantic layer integrating BigQuery + Cube.',
                },
                {
                  title: 'PolaCast + PolaWatch + PolaNest',
                  description: 'Unified event integrations, monitoring, and hosting. Zero DevOps.',
                  span: 2,
                },
              ]
        }
      />
    );
  },
};

/** 強調は「1件目」という位置で決まる（旧 variant prop は削除済み。workorder §3） */
export const FirstItemIsFeatured: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <BentoGrid
        eyebrow={isJa ? 'ハイライト' : 'HIGHLIGHTS'}
        title={isJa ? '主役は並び順で決まる' : 'Order decides the lead'}
        items={
          isJa
            ? [
                {
                  title: '1件目のカード',
                  description:
                    '先頭のカードだけが淡いブランド面とグローで強調される。指定は不要。',
                  span: 2,
                },
                {
                  title: '2件目のカード',
                  description: '以降は通常のカード。面は surface、影は card。',
                },
                {
                  title: '3件目のカード',
                  description: 'ホバーの持ち上がりは全カード共通。',
                },
                {
                  title: '4件目のカード',
                  description: '横幅は span で 2 列ぶんに広げられる（強調とは別の軸）。',
                  span: 2,
                },
              ]
            : [
                {
                  title: 'First card',
                  description:
                    'Only the first card gets the tinted brand surface and glow. No prop needed.',
                  span: 2,
                },
                {
                  title: 'Second card',
                  description: 'The rest are plain cards on the default surface.',
                },
                {
                  title: 'Third card',
                  description: 'Hover lift is shared by every card.',
                },
                {
                  title: 'Fourth card',
                  description: 'Width is controlled by span — a separate axis from emphasis.',
                  span: 2,
                },
              ]
        }
      />
    );
  },
};
