import type { Meta, StoryObj } from '@storybook/react';
import { MarketingHeader } from '../../components/layout/marketing-header';
import { Section } from '../../components/primitives/section';
import { Container } from '../../components/primitives/container';
import { Heading } from '../../components/primitives/heading';
import { Text } from '../../components/primitives/text';

const meta: Meta<typeof MarketingHeader> = {
  title: 'Layout/MarketingHeader',
  component: MarketingHeader,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof MarketingHeader>;

export const WithDropdown: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div>
        <MarketingHeader
          navItems={[
            {
              label: isJa ? 'プロダクト' : 'Products',
              href: '/products',
              children: [
                { label: 'PolaAuth', href: '/products/auth' },
                { label: 'PolaStore', href: '/products/store' },
                { label: 'PolaGate', href: '/products/gate' },
                { label: 'PolaFind', href: '/products/find' },
              ],
            },
            {
              label: isJa ? 'ソリューション' : 'Solutions',
              href: '/solutions',
              children: [
                { label: isJa ? 'スタートアップ' : 'Startups', href: '/solutions/startups' },
                { label: isJa ? 'エンタープライズ' : 'Enterprise', href: '/solutions/enterprise' },
              ],
            },
            { label: isJa ? '料金' : 'Pricing', href: '/pricing' },
            { label: isJa ? 'ドキュメント' : 'Docs', href: '/docs' },
          ]}
          actions={[
            { label: isJa ? 'ログイン' : 'Log in', href: '/login', variant: 'ghost' },
            { label: isJa ? '無料で始める' : 'Start Free', href: '/signup', variant: 'primary' },
          ]}
        />
        <Section background="muted" spacing="xl">
          <Container>
            <Heading as="h1" size="display-lg">
              {isJa ? 'ドロップダウンナビ付きヘッダー' : 'Header with Dropdown Nav'}
            </Heading>
            <Text tone="secondary" className="mt-4">
              {isJa
                ? '「プロダクト」「ソリューション」にホバーするとドロップダウンが表示されます。'
                : 'Hover over "Products" or "Solutions" to see the dropdown menu.'}
            </Text>
          </Container>
        </Section>
      </div>
    );
  },
};

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div>
        <MarketingHeader
          navItems={[
            { label: isJa ? '機能' : 'Features', href: '/features' },
            { label: isJa ? '料金' : 'Pricing', href: '/pricing' },
            { label: isJa ? 'ドキュメント' : 'Docs', href: '/docs' },
            { label: isJa ? 'ブログ' : 'Blog', href: '/blog' },
          ]}
          actions={[
            { label: isJa ? 'ログイン' : 'Log in', href: '/login', variant: 'ghost' },
            { label: isJa ? '無料で始める' : 'Start Free', href: '/signup', variant: 'primary' },
          ]}
        />
        {/* ヘッダーの下にダミーコンテンツ */}
        <Section background="muted" spacing="xl">
          <Container>
            <Heading as="h1" size="display-lg">
              {isJa ? 'ページコンテンツ' : 'Page Content'}
            </Heading>
            <Text tone="secondary" className="mt-4">
              {isJa
                ? 'スクロールするとヘッダーの背景がブラーに変化します。'
                : 'Scroll to see the header background blur effect.'}
            </Text>
          </Container>
        </Section>
        <Section spacing="xl">
          <Container>
            <div className="h-[800px]" />
          </Container>
        </Section>
      </div>
    );
  },
};
