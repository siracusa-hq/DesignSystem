import type { Meta, StoryObj } from '@storybook/react';
import { AirPocketFeature } from '../../components/sections/air-pocket-feature';

const meta: Meta<typeof AirPocketFeature> = {
  title: 'Sections/AirPocketFeature',
  component: AirPocketFeature,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof AirPocketFeature>;

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-sm text-primary-500 dark:from-primary-950 dark:to-neutral-900">
    {label}
  </div>
);

export const ThreeAirPockets: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <AirPocketFeature
        eyebrow={isJa ? '差別化' : 'DIFFERENTIATION'}
        title={isJa ? '3つのエアポケット' : '3 Air Pockets'}
        subtitle={
          isJa
            ? '競合が標準提供していない、Polastack独自の差別化領域。'
            : 'Differentiation areas where no competitor offers as standard.'
        }
        airPockets={
          isJa
            ? [
                {
                  module: 'PolaFind',
                  headline: '打ち間違えても、見つかる。100万件でも、ミリ秒で。',
                  description:
                    'Meilisearchで日本語対応のtypo tolerant全文検索を標準搭載。「田中」「たなか」「Tanaka」を横断検索。',
                  proof: '100万件のデータからミリ秒レベルで結果を返却',
                  competitors: [
                    { name: 'kintone', status: '部分一致のみ' },
                    { name: 'Supabase', status: 'PGroonga拡張が必要' },
                  ],
                  visual: <Placeholder label="PolaFind Demo" />,
                },
                {
                  module: 'PolaStore',
                  headline: '見せたい情報だけ見せる。見た人は、全員記録する。',
                  description:
                    'FLSと監査ログをデータベース最下層で強制。アプリケーションコードに関係なく、セキュリティが保証される。',
                  proof: 'SOC2/ISMS要件を標準で充足',
                  competitors: [
                    { name: 'kintone', status: 'FLS部分対応・詳細監査は有料' },
                    { name: 'Supabase', status: 'FLS未成熟・監査ログなし' },
                  ],
                  visual: <Placeholder label="PolaStore Security" />,
                },
                {
                  module: 'PolaLens',
                  headline: 'SQLを書かなくても、分析できる。数千万行でも、ミリ秒で。',
                  description:
                    'BigQuery + Cubeによるセマンティックレイヤー。非エンジニアでもメトリクスを定義・クエリ可能。',
                  proof: 'Pre-aggregationで高速クエリ。トランザクションDBに負荷をかけない',
                  competitors: [
                    { name: 'kintone', status: '非対応' },
                    { name: 'Supabase', status: '非対応' },
                  ],
                  visual: <Placeholder label="PolaLens Dashboard" />,
                },
              ]
            : [
                {
                  module: 'PolaFind',
                  headline: 'Find it even with typos. In milliseconds, even with 1M records.',
                  description:
                    'Typo-tolerant full-text search with Meilisearch, built-in Japanese support. Cross-search "田中", "たなか", "Tanaka".',
                  proof: 'Millisecond-level response from 1M+ records',
                  competitors: [
                    { name: 'kintone', status: 'Partial match only' },
                    { name: 'Supabase', status: 'Requires PGroonga extension' },
                  ],
                  visual: <Placeholder label="PolaFind Demo" />,
                },
                {
                  module: 'PolaStore',
                  headline: 'Show only what you want. Record everyone who sees it.',
                  description:
                    'FLS and audit logs enforced at the database layer. Security guaranteed regardless of application code.',
                  proof: 'Meets SOC2/ISMS requirements out of the box',
                  competitors: [
                    { name: 'kintone', status: 'Partial FLS, detailed audit is paid' },
                    { name: 'Supabase', status: 'FLS immature, no audit logs' },
                  ],
                  visual: <Placeholder label="PolaStore Security" />,
                },
                {
                  module: 'PolaLens',
                  headline: 'Analyze without SQL. In milliseconds, even with tens of millions of rows.',
                  description:
                    'Semantic layer with BigQuery + Cube. Non-engineers can define and query metrics.',
                  proof: 'Pre-aggregation for fast queries without loading the transaction DB',
                  competitors: [
                    { name: 'kintone', status: 'Not supported' },
                    { name: 'Supabase', status: 'Not supported' },
                  ],
                  visual: <Placeholder label="PolaLens Dashboard" />,
                },
              ]
        }
      />
    );
  },
};
