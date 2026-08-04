import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '../../components/sections/hero-section';
import { ProductShot } from '../../components/primitives/product-shot';

const meta = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 日本語: Story = {
  args: {
    badge: 'Enterprise Agent Stack',
    title: (
      <>
        AIがコードを書く時代。
        <br />
        業務に耐える裏側は、Polastackが引き受ける。
      </>
    ),
    subtitle:
      'AIエージェントにAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる。',
    actions: [
      { label: '無料で開発を始める', href: '#signup' },
      { label: 'デモを予約', href: '#demo' },
    ],
  },
};

export const English: Story = {
  args: {
    badge: 'Enterprise Agent Stack',
    title: (
      <>
        In the age of AI-generated code,
        <br />
        Polastack handles the enterprise backend.
      </>
    ),
    subtitle:
      'Just pass API specs to an AI agent, and enterprise-grade search, analytics, and auth infrastructure spins up instantly.',
    actions: [
      { label: 'Start Free', href: '#signup' },
      { label: 'Book a Demo', href: '#demo' },
    ],
  },
};

export const 画像を横に: Story = {
  args: {
    ...日本語.args,
    image: <ProductShot />,
    imagePlacement: 'side',
  },
};

export const 画像を下に: Story = {
  args: {
    ...日本語.args,
    image: <ProductShot fade />,
    imagePlacement: 'below',
  },
};

/** 貴社コーポレートサイトと同型の「淡背景 + 左寄せコピー + 明滅する装飾層」。
    アニメーションは --duration-ambient を使うため reduced-motion に自動追従する */
const AmbientBackdrop = () => (
  <>
    <style>{`@keyframes hero-pulse { 0%, 64%, 100% { opacity: var(--o); } 9% { opacity: calc(var(--o) * 2.6); } 26% { opacity: var(--o); } }`}</style>
    <svg width="100%" height="100%" aria-hidden="true">
      {[
        { cx: '12%', cy: '30%', r: 90, o: 0.05, d: '0s' },
        { cx: '78%', cy: '18%', r: 130, o: 0.07, d: '-3s' },
        { cx: '88%', cy: '70%', r: 170, o: 0.06, d: '-6s' },
        { cx: '45%', cy: '85%', r: 110, o: 0.05, d: '-9s' },
      ].map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="var(--color-decor-brand)"
          style={{
            ['--o' as string]: c.o,
            opacity: c.o,
            animation: `hero-pulse calc(var(--duration-ambient) * 9) ${c.d} infinite ease-in-out`,
          }}
        />
      ))}
    </svg>
  </>
);

export const 背景演出_左寄せ: Story = {
  args: {
    badge: 'コーポレート',
    title: '技術でレバレッジをかける。',
    subtitle:
      '最先端の技術で、人の能力を拡張する。私たちは、業務の現場に監査に耐えるソフトウェアを届けます。',
    actions: [
      { label: '会社紹介資料', href: '#' },
      { label: '採用情報', href: '#' },
    ],
    backdrop: <AmbientBackdrop />,
  },
};
