import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '../../components/sections/hero-section';

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

const DemoShot = () => (
  <div
    aria-hidden="true"
    style={{
      borderRadius: 'var(--radius-media)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-card-hover)',
      overflow: 'hidden',
      background: 'var(--color-surface)',
    }}
  >
    <div
      style={{
        display: 'flex',
        gap: '6px',
        padding: '10px 14px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-sunken)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--color-border)',
          }}
        />
      ))}
    </div>
    <div style={{ aspectRatio: '16 / 9', display: 'grid', gridTemplateColumns: '160px 1fr' }}>
      <div style={{ background: 'var(--color-surface-sunken)' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[64, 88, 76, 52].map((w, i) => (
          <div
            key={i}
            style={{
              height: 12,
              width: `${w}%`,
              borderRadius: 6,
              background: i === 0 ? 'var(--color-bg-brand-muted)' : 'var(--color-surface-sunken)',
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

export const 画像を横に: Story = {
  args: {
    ...日本語.args,
    image: <DemoShot />,
    imagePlacement: 'side',
  },
};

export const 画像を下に: Story = {
  args: {
    ...日本語.args,
    image: <DemoShot />,
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
