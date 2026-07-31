import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonTable } from '../../components/sections/comparison-table';

const meta: Meta<typeof ComparisonTable> = {
  title: 'Sections/ComparisonTable',
  component: ComparisonTable,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ComparisonTable>;

export const VsCompetitors: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ComparisonTable
        eyebrow={isJa ? '比較' : 'COMPARISON'}
        title={isJa ? 'Polastackが選ばれる理由' : 'Why choose Polastack'}
        subtitle={isJa ? '既存ソリューションとの機能比較' : 'Feature comparison with existing solutions'}
        columns={[
          { name: 'kintone' },
          { name: 'Polastack', highlighted: true },
          { name: 'Supabase' },
        ]}
        rows={[
          {
            feature: isJa ? '全文検索（typo tolerant）' : 'Full-text search (typo tolerant)',
            values: [false, true, false],
          },
          {
            feature: isJa ? 'フィールドレベルセキュリティ' : 'Field-level security',
            values: [false, true, false],
          },
          {
            feature: isJa ? '監査ログ（標準）' : 'Audit logs (built-in)',
            values: [false, true, false],
          },
          {
            feature: 'SSO/SAML',
            values: [isJa ? 'プレミアムのみ' : 'Premium only', true, false],
          },
          {
            feature: isJa ? '分析基盤' : 'Analytics platform',
            values: [false, true, false],
          },
          {
            feature: isJa ? 'SDK自動生成' : 'Auto SDK generation',
            values: [false, true, false],
          },
          {
            feature: isJa ? '100万件超対応' : '1M+ records support',
            values: [false, true, true],
          },
          {
            feature: isJa ? 'ヘッドレスアーキテクチャ' : 'Headless architecture',
            values: [false, true, true],
          },
        ]}
        background="muted"
      />
    );
  },
};
