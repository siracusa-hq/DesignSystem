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

export const WithVariants: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <BentoGrid
        eyebrow={isJa ? 'ハイライト' : 'HIGHLIGHTS'}
        title={isJa ? 'カードバリエーション' : 'Card Variations'}
        items={
          isJa
            ? [
                {
                  title: 'Featured カード',
                  description: 'variant="featured" でプライマリカラーのグラデーション背景とグロー効果。',
                  variant: 'featured',
                  span: 2,
                },
                {
                  title: 'Dark カード',
                  description: 'variant="dark" でダーク背景。視覚的なコントラスト。',
                  variant: 'dark',
                },
                {
                  title: 'Default カード 1',
                  description: 'デフォルトの白背景カード。',
                },
                {
                  title: 'Default カード 2',
                  description: 'すべてのカードにホバーインタラクション付き。',
                  span: 2,
                },
              ]
            : [
                {
                  title: 'Featured Card',
                  description: 'variant="featured" applies primary gradient background with glow effect.',
                  variant: 'featured',
                  span: 2,
                },
                {
                  title: 'Dark Card',
                  description: 'variant="dark" for dark background with visual contrast.',
                  variant: 'dark',
                },
                {
                  title: 'Default Card 1',
                  description: 'Default white background card.',
                },
                {
                  title: 'Default Card 2',
                  description: 'All cards have hover interactions.',
                  span: 2,
                },
              ]
        }
      />
    );
  },
};
