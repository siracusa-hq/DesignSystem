import type { Meta, StoryObj } from '@storybook/react';
import { MarketingButton } from '../../components/primitives/marketing-button';
import { ArrowRight, ExternalLink } from 'lucide-react';

const meta: Meta<typeof MarketingButton> = {
  title: 'Primitives/MarketingButton',
  component: MarketingButton,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof MarketingButton>;

export const Variants: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div className="flex flex-wrap items-center gap-4">
        <MarketingButton variant="primary">
          {isJa ? '無料で始める' : 'Get Started Free'}
        </MarketingButton>
        <MarketingButton variant="secondary">
          {isJa ? 'ドキュメントを見る' : 'View Docs'}
        </MarketingButton>
        <MarketingButton variant="ghost">
          {isJa ? '詳しく見る' : 'Learn More'}
        </MarketingButton>
        <MarketingButton variant="gradient">
          {isJa ? '今すぐ試す' : 'Try Now'}
        </MarketingButton>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <MarketingButton size="sm">Small</MarketingButton>
      <MarketingButton size="md">Medium</MarketingButton>
      <MarketingButton size="lg">Large</MarketingButton>
      <MarketingButton size="xl">Extra Large</MarketingButton>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div className="flex flex-wrap items-center gap-4">
        <MarketingButton variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
          {isJa ? '無料で始める' : 'Get Started'}
        </MarketingButton>
        <MarketingButton variant="secondary" rightIcon={<ExternalLink className="h-4 w-4" />}>
          {isJa ? 'ドキュメントを見る' : 'View Docs'}
        </MarketingButton>
        <MarketingButton variant="gradient" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
          {isJa ? '今すぐ試す' : 'Try Now'}
        </MarketingButton>
      </div>
    );
  },
};

export const AsLink: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <MarketingButton href="/signup" variant="primary" size="lg">
        {isJa ? '無料で開発を始める' : 'Start Building for Free'}
      </MarketingButton>
    );
  },
};
