import type { Meta, StoryObj } from '@storybook/react';

/**
 * Stage 2 移行ステータス — 各 Slice の PR ごとに status を更新する（DoD の一部）。
 * 「migrated」= CSS Modules + スロット参照 + DoD 全項目クリア。
 */
const STATUS: Array<{ name: string; group: string; state: '済' | '未' | '新規' | '削除' }> = [
  { name: 'Container', group: 'primitives', state: '済' },
  { name: 'Section', group: 'primitives', state: '済' },
  { name: 'Heading', group: 'primitives', state: '済' },
  { name: 'Text', group: 'primitives', state: '済' },
  { name: 'MarketingButton', group: 'primitives', state: '済' },
  { name: 'Badge', group: 'primitives', state: '済' },
  { name: 'Link', group: 'primitives', state: '済' },
  { name: 'Logo', group: 'primitives', state: '済' },
  { name: 'Eyebrow', group: 'primitives', state: '新規' },
  { name: 'LogoMark', group: 'primitives', state: '新規' },
  { name: 'MediaFrame', group: 'primitives', state: '新規' },
  { name: 'ProductShot', group: 'primitives', state: '新規' },
  { name: 'Avatar', group: 'primitives', state: '新規' },
  {
    name: 'Grid / Divider / GradientText / AnimatedCounter / AnimateOnScroll',
    group: 'primitives',
    state: '済',
  },
  {
    name: 'HeroSection / StatsSection / SecurityBadges / CTASection',
    group: 'sections',
    state: '済',
  },
  { name: 'ServicePortfolio', group: 'sections', state: '新規' },
  { name: 'SectionHeader（内部共有）', group: 'sections', state: '新規' },
  {
    name: 'FeatureGrid / FeatureShowcase / ComparisonTable',
    group: 'sections',
    state: '済',
  },
  {
    name: 'TestimonialSection / LogoCloud / CaseStudySection / FAQSection',
    group: 'sections',
    state: '済',
  },
  { name: 'PricingTable / PricingCard / CodeBlock', group: 'sections', state: '済' },
  {
    name: 'ModuleOverview / MigrationComparison / AirPocketFeature',
    group: 'sections',
    state: '済',
  },
  { name: 'MarketingHeader / MarketingFooter / PageLayout', group: 'layout', state: '済' },
  { name: 'フォーム3種（Slice 5）', group: 'sections', state: '未' },
];

function StatusStory() {
  const color = { 済: '#008575', 新規: '#2f4989', 未: '#a1a1aa', 削除: '#8d4f4d' } as const;
  const done = STATUS.filter((s) => s.state !== '未').length;
  return (
    <div className="p-8">
      <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
        Stage 2 移行ステータス
      </h2>
      <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">
        CSS Modules + テーマ契約スロットへの移行状況。作業単位の正本は
        docs/stage2-workorder.md（Slice 0〜6）。
      </p>
      <table className="mt-6 w-full max-w-2xl border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-on-surface-muted)]">
            <th className="py-2 pr-4">コンポーネント</th>
            <th className="py-2 pr-4">区分</th>
            <th className="py-2">状態</th>
          </tr>
        </thead>
        <tbody>
          {STATUS.map((s) => (
            <tr key={s.name} className="border-b border-[var(--color-border)]">
              <td className="py-2 pr-4 text-[var(--color-on-surface)]">{s.name}</td>
              <td className="py-2 pr-4 text-[var(--color-on-surface-muted)]">{s.group}</td>
              <td className="py-2 font-semibold" style={{ color: color[s.state] }}>
                {s.state}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-caption text-[var(--color-on-surface-muted)]">
        エントリ {STATUS.length} 件中 {done} 件が移行済み/新規。
      </p>
    </div>
  );
}

const meta = {
  title: 'Stage 2/移行ステータス',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const 一覧: Story = { render: () => <StatusStory /> };
