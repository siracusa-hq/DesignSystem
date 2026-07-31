import type { Meta, StoryObj } from '@storybook/react';
import { FeatureShowcase } from '../../components/sections/feature-showcase';

const meta: Meta<typeof FeatureShowcase> = {
  title: 'Sections/FeatureShowcase',
  component: FeatureShowcase,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof FeatureShowcase>;

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500 dark:from-primary-950 dark:to-neutral-900">
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <FeatureShowcase
        eyebrow={isJa ? '機能詳細' : 'FEATURES'}
        title={isJa ? 'エンタープライズ要件を標準装備' : 'Enterprise requirements built-in'}
        items={[
          {
            badge: 'PolaAuth',
            title: isJa ? '認証・アイデンティティ基盤' : 'Authentication & Identity',
            description: isJa
              ? 'SSO/SAML、SCIMを標準搭載。Enterprise Identityオプションで複数IdPに対応。'
              : 'SSO/SAML, SCIM built-in. Enterprise Identity option supports multiple IdPs.',
            features: isJa
              ? ['SSO/SAML標準搭載', 'SCIM自動プロビジョニング', 'MFA対応']
              : ['SSO/SAML built-in', 'SCIM auto-provisioning', 'MFA support'],
            image: <Placeholder label="PolaAuth Screenshot" />,
          },
          {
            badge: 'PolaFind',
            title: isJa ? '超高速全文検索' : 'Ultra-fast Full-text Search',
            description: isJa
              ? '100万件のデータからミリ秒レベルで結果を返却。typo tolerant、日本語完全対応。'
              : 'Returns results in milliseconds from 1M+ records. Typo tolerant, full Japanese support.',
            features: isJa
              ? ['typo tolerant検索', '日本語完全対応', 'ミリ秒レスポンス']
              : ['Typo tolerant search', 'Full Japanese support', 'Millisecond response'],
            image: <Placeholder label="PolaFind Screenshot" />,
          },
        ]}
      />
    );
  },
};
