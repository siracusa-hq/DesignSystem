import type { Meta, StoryObj } from '@storybook/react';
import { MigrationComparison } from '../../components/sections/migration-comparison';

const meta: Meta<typeof MigrationComparison> = {
  title: 'Sections/MigrationComparison',
  component: MigrationComparison,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof MigrationComparison>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <MigrationComparison
        eyebrow={isJa ? '移行パス' : 'MIGRATION'}
        title={isJa ? '既存プラットフォームからの移行' : 'Migrate from existing platforms'}
        subtitle={isJa ? '現在のツールの限界に直面していませんか？' : 'Hitting the limits of your current tools?'}
        paths={
          isJa
            ? [
                {
                  from: 'kintone卒業',
                  tagline: 'kintoneの限界を超える',
                  description: 'コードで納品し、マルチテナントで100社にスケール。',
                  triggers: [
                    { trigger: 'データ量の壁', pain: '数万件超で検索・集計が実用に耐えない', solution: 'PostgreSQLベースで数百万件対応' },
                    { trigger: 'FLS/監査ログ要求', pain: 'フィールドレベルセキュリティが未対応', solution: 'PolaStoreでFLS + 監査ログを標準搭載' },
                    { trigger: 'コード納品要求', pain: 'クライアントがコード納品を希望', solution: 'SDK自動生成でコード資産として蓄積・納品可能' },
                    { trigger: 'API Rate Limit', pain: '10,000回/日の制限がビジネスを制約', solution: 'CDCベースでRate Limit大幅緩和' },
                  ],
                  action: { label: '移行ガイドを見る', href: '/migration/kintone' },
                },
                {
                  from: 'Supabase卒業',
                  tagline: 'エンタープライズレディへ',
                  description: 'SSO・監査ログ・マルチテナントを初日から利用可能。',
                  triggers: [
                    { trigger: 'SSO高コスト', pain: 'Team Plan $599/月のコストが合わない', solution: 'PolaAuth: ¥50,000/接続/月。Supabaseより安価' },
                    { trigger: 'FLS未成熟', pain: '列レベルセキュリティが実用的でない', solution: 'PolaStore: FLSをDB最下層で強制' },
                    { trigger: 'マルチテナント分離', pain: 'RLSだけでは物理分離要件を満たせない', solution: 'アーキテクチャレベルでの物理テナント分離' },
                    { trigger: '日本語全文検索', pain: 'PGroonga拡張の運用が負担', solution: 'PolaFind: Meilisearchで日本語typo tolerant標準搭載' },
                  ],
                  action: { label: '移行ガイドを見る', href: '/migration/supabase' },
                },
              ]
            : [
                {
                  from: 'From kintone',
                  tagline: 'Beyond the limits of kintone',
                  description: 'Deliver as code, scale to 100 tenants with multi-tenancy.',
                  triggers: [
                    { trigger: 'Data volume wall', pain: 'Search unusable past tens of thousands of records', solution: 'PostgreSQL-based, supports millions of records' },
                    { trigger: 'FLS/Audit log needs', pain: 'No field-level security support', solution: 'PolaStore: FLS + audit logs built-in' },
                    { trigger: 'Code delivery request', pain: 'Client wants code deliverables', solution: 'Auto SDK generation for code assets' },
                    { trigger: 'API Rate Limit', pain: '10,000 calls/day limiting business', solution: 'CDC-based, significantly relaxed rate limits' },
                  ],
                  action: { label: 'View Migration Guide', href: '/migration/kintone' },
                },
                {
                  from: 'From Supabase',
                  tagline: 'Become enterprise-ready',
                  description: 'SSO, audit logs, and multi-tenancy from Day 1.',
                  triggers: [
                    { trigger: 'SSO cost', pain: 'Team Plan $599/mo too expensive', solution: 'PolaAuth: ¥50,000/connection/mo. Cheaper than Supabase' },
                    { trigger: 'FLS immaturity', pain: 'Column-level security not practical', solution: 'PolaStore: FLS enforced at DB layer' },
                    { trigger: 'Multi-tenant isolation', pain: 'RLS alone cannot meet physical isolation', solution: 'Architecture-level physical tenant isolation' },
                    { trigger: 'Japanese full-text search', pain: 'PGroonga extension maintenance burden', solution: 'PolaFind: Meilisearch with Japanese typo-tolerant built-in' },
                  ],
                  action: { label: 'View Migration Guide', href: '/migration/supabase' },
                },
              ]
        }
      />
    );
  },
};
