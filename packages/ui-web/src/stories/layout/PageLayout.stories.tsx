import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from '../../components/layout/page-layout';
import { HeroSection } from '../../components/sections/hero-section';
import { FeatureGrid } from '../../components/sections/feature-grid';
import { CTASection } from '../../components/sections/cta-section';

const meta: Meta<typeof PageLayout> = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PageLayout>;

export const FullPage: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <PageLayout
        headerProps={{
          navItems: [
            { label: isJa ? '機能' : 'Features', href: '#features' },
            { label: isJa ? '料金' : 'Pricing', href: '#pricing' },
            { label: isJa ? 'ドキュメント' : 'Docs', href: '/docs' },
          ],
          actions: [
            { label: isJa ? 'ログイン' : 'Log in', href: '/login', variant: 'ghost' },
            { label: isJa ? '無料で始める' : 'Start Free', href: '/signup', variant: 'primary' },
          ],
        }}
        footerProps={{
          description: isJa
            ? 'Enterprise Agent Stack'
            : 'Enterprise Agent Stack',
          linkGroups: [
            {
              title: isJa ? 'プロダクト' : 'Product',
              links: [
                { label: isJa ? '機能' : 'Features', href: '/features' },
                { label: isJa ? '料金' : 'Pricing', href: '/pricing' },
              ],
            },
            {
              title: isJa ? '開発者' : 'Developers',
              links: [
                { label: isJa ? 'ドキュメント' : 'Docs', href: '/docs' },
                { label: 'API', href: '/api' },
              ],
            },
          ],
          copyright: `© ${new Date().getFullYear()} Polastack, Inc.`,
          legalLinks: [
            { label: isJa ? 'プライバシー' : 'Privacy', href: '/privacy' },
            { label: isJa ? '利用規約' : 'Terms', href: '/terms' },
          ],
        }}
      >
        <HeroSection
          title={
            isJa
              ? 'Agent Coding時代の、消えない複雑性を解決する。'
              : 'Solve the unsolvable complexity of the Agent Coding era.'
          }
          subtitle={
            isJa
              ? 'AIエージェントにAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる。'
              : 'Build enterprise-grade business apps rapidly with 8 integrated modules.'
          }
          actions={[
            { label: isJa ? '無料で始める' : 'Start Free', href: '/signup' },
            { label: isJa ? 'ドキュメント' : 'Docs', href: '/docs', variant: 'secondary' },
          ]}
        />

        <FeatureGrid
          eyebrow={isJa ? 'モジュール' : 'MODULES'}
          title={isJa ? '11の統合モジュール' : '11 Integrated Modules'}
          features={[
            { title: 'PolaAuth', description: isJa ? '認証・アイデンティティ基盤' : 'Authentication & identity' },
            { title: 'PolaStore', description: isJa ? 'メタデータ駆動DB' : 'Metadata-driven DB' },
            { title: 'PolaGate', description: isJa ? 'Runtime Gateway' : 'Runtime Gateway' },
          ]}
          columns={3}
          background="muted"
        />

        <CTASection
          background="dark"
          title={isJa ? '無料で開発を始める' : 'Start building for free'}
          subtitle={isJa ? 'クレジットカード不要' : 'No credit card required'}
          actions={[
            { label: isJa ? '無料で始める' : 'Get Started', href: '/signup', variant: 'gradient' },
          ]}
        />
      </PageLayout>
    );
  },
};
