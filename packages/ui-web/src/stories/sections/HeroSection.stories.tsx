import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '../../components/sections/hero-section';
import { GradientText } from '../../components/primitives/gradient-text';
import { Heading } from '../../components/primitives/heading';

const meta: Meta<typeof HeroSection> = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Centered: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="centered"
        badge={isJa ? '新登場' : 'Now Available'}
        title={
          <Heading as="h1" size="display-2xl">
            {isJa ? (
              <>
                AIがコードを書く時代。
                <br />
                <GradientText as="span">業務に耐える裏側は、Polastackが引き受ける。</GradientText>
              </>
            ) : (
              <>
                In the age of AI-generated code,
                <br />
                <GradientText as="span">Polastack handles the enterprise backend.</GradientText>
              </>
            )}
          </Heading>
        }
        subtitle={
          isJa
            ? 'AIエージェントにAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる。'
            : 'Just pass API specs to an AI agent, and enterprise-grade search, analytics, and auth infrastructure spins up instantly.'
        }
        actions={[
          { label: isJa ? '無料で開発を始める' : 'Start Free', href: '/signup' },
          { label: isJa ? 'ドキュメント' : 'Documentation', href: '/docs', variant: 'secondary' },
        ]}
      />
    );
  },
};

export const SplitImage: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="split-image"
        title={
          isJa
            ? 'ノーコードの妥協を終わらせる。'
            : 'End the no-code compromise.'
        }
        subtitle={
          isJa
            ? 'AIが描く自由なフロントエンドに、最強のバックエンドを直結。'
            : 'Connect the most powerful backend directly to the free frontend drawn by AI.'
        }
        actions={[
          { label: isJa ? '無料で始める' : 'Get Started Free', href: '/signup' },
        ]}
        image={
          <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500 dark:from-primary-950 dark:to-neutral-900">
            <span className="text-lg font-medium">Product Screenshot</span>
          </div>
        }
      />
    );
  },
};

export const WithGridPattern: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="centered"
        background="dark"
        backgroundPattern="grid"
        title={
          <Heading as="h1" size="display-2xl" className="text-white">
            {isJa ? (
              <>
                AIがコードを書く時代。
                <br />
                <GradientText as="span">業務に耐える裏側は、Polastackが引き受ける。</GradientText>
              </>
            ) : (
              <>
                In the age of AI-generated code,
                <br />
                <GradientText as="span">Polastack handles the enterprise backend.</GradientText>
              </>
            )}
          </Heading>
        }
        subtitle={
          isJa
            ? 'AIエージェントにAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる。'
            : 'Just pass API specs to an AI agent, and enterprise-grade search, analytics, and auth infrastructure spins up instantly.'
        }
        actions={[
          { label: isJa ? '無料で開発を始める' : 'Start Free', href: '/signup', variant: 'gradient' },
          { label: isJa ? 'ドキュメント' : 'Documentation', href: '/docs', variant: 'secondary' },
        ]}
      />
    );
  },
};

export const WithDotsPattern: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="centered"
        background="dark"
        backgroundPattern="dots"
        title={isJa ? 'ドットパターン背景' : 'Dots Pattern Background'}
        subtitle={isJa ? 'backgroundPattern="dots" を指定した場合の表示例です。' : 'Example with backgroundPattern="dots" prop.'}
        actions={[{ label: isJa ? '無料で始める' : 'Get Started', href: '/signup', variant: 'gradient' }]}
      />
    );
  },
};

export const WithMeshPattern: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="centered"
        background="dark"
        backgroundPattern="mesh"
        title={isJa ? 'メッシュグラデーション背景' : 'Mesh Gradient Background'}
        subtitle={isJa ? 'backgroundPattern="mesh" を指定した場合の表示例です。' : 'Example with backgroundPattern="mesh" prop.'}
        actions={[{ label: isJa ? '無料で始める' : 'Get Started', href: '/signup', variant: 'gradient' }]}
      />
    );
  },
};

export const WithRadialGlow: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="centered"
        background="dark"
        backgroundPattern="radial-glow"
        title={isJa ? 'ラジアルグロー背景' : 'Radial Glow Background'}
        subtitle={isJa ? 'backgroundPattern="radial-glow" を指定した場合の表示例です。' : 'Example with backgroundPattern="radial-glow" prop.'}
        actions={[{ label: isJa ? '無料で始める' : 'Get Started', href: '/signup', variant: 'gradient' }]}
      />
    );
  },
};

export const DarkBackground: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HeroSection
        layout="centered"
        background="dark"
        title={
          <Heading as="h1" size="display-2xl" className="text-white">
            {isJa ? (
              <>
                AIがコードを書いても、
                <br />
                <GradientText as="span">業務に耐えるバックエンドは残り続ける。</GradientText>
              </>
            ) : (
              <>
                Even when AI writes code,
                <br />
                <GradientText as="span">enterprise backends remain the hard part.</GradientText>
              </>
            )}
          </Heading>
        }
        subtitle={
          isJa
            ? 'Polastackは11の統合モジュールで、セキュリティ・データ基盤・運用のすべてを引き受けます。'
            : 'Polastack handles security, data infrastructure, and operations with 11 integrated modules.'
        }
        actions={[
          { label: isJa ? '無料で開発を始める' : 'Start Free', href: '/signup', variant: 'gradient' },
          { label: isJa ? 'デモを予約' : 'Book a Demo', href: '/demo', variant: 'secondary' },
        ]}
      />
    );
  },
};
