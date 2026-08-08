import type { Meta, StoryObj } from '@storybook/react';
import { Page, PAGE_TONES } from '../../components/layout/page';
import { HeroSection } from '../../components/sections/hero-section';
import { FeatureGrid } from '../../components/sections/feature-grid';
import { StatsSection } from '../../components/sections/stats-section';
import { ModuleOverview } from '../../components/sections/module-overview';
import { TestimonialSection } from '../../components/sections/testimonial-section';
import { CTASection } from '../../components/sections/cta-section';

/**
 * Page — ページのリズム（面・トーン）を割り当てるコンテナ（Stage 3）。
 *
 * - セクションは自分では面を選ばない。Page が default ↔ muted を交互に割り当てる
 * - 自分で暗面を塗るセクション（ModuleOverview / CTASection 等）は
 *   リズムから除外され、直後は必ず default から再開する
 * - `brand`（誰の顔か）と `tone`（何を狙うページか）は直交する
 */
const meta = {
  title: 'Layout/Page',
  component: Page,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    brand: {
      control: 'select',
      options: ['corporate', 'polastack', 'peerdesk', 'peerdesk-taxpeer'],
    },
    tone: { control: 'select', options: [...PAGE_TONES] },
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = (
  <>
    <HeroSection
      title="現場の紙の山を、その日のうちにデータに。"
      subtitle="ピアデスクは、非IT企業の管理部門のための業務効率化シリーズです。導入前の面倒な設定は、すべて私たちが代行します。"
      actions={[
        { label: '資料をダウンロード', href: '#' },
        { label: '料金を見る', href: '#' },
      ]}
    />
    <StatsSection
      title="数字で見るピアデスク"
      stats={[
        { value: '1,200社', label: '導入企業' },
        { value: '98%', label: '継続率' },
        { value: '3日', label: '平均導入期間' },
      ]}
      asOf="※2026年7月末時点"
    />
    <FeatureGrid
      eyebrow="Features"
      title="管理部門の定型業務を、まとめて引き受ける"
      features={[
        { title: '請求書の自動読取', description: 'AI-OCRが紙の請求書を数秒でデータ化します。' },
        { title: '承認フローの整理', description: '社内の承認ルートをそのまま再現できます。' },
        { title: '会計ソフト連携', description: '主要な会計ソフトへワンクリックで連携します。' },
      ]}
    />
    <ModuleOverview
      eyebrow="Architecture"
      title="シリーズ構成"
      layers={[
        {
          name: 'Products',
          modules: [
            { name: 'タックスピア', label: 'tax', description: '税務書類の収集と整理' },
            { name: 'ピアデスク 経費', label: 'expense', description: '経費精算の自動化' },
          ],
        },
      ]}
    />
    <TestimonialSection
      title="導入企業の声"
      testimonials={[
        {
          quote: '月末の残業がなくなりました。紙の山と格闘していた時間が、まるごと戻ってきた感覚です。',
          author: '経理部長',
          company: '株式会社サンプル製作所',
        },
      ]}
    />
    <CTASection
      kicker="＼5分でわかる資料をプレゼント／"
      title="まずは資料からご覧ください"
      actions={[
        { label: '資料をダウンロード', href: '#' },
        { label: '料金を見る', href: '#' },
      ]}
      socialProof="1,200社が利用中"
    />
  </>
);

/**
 * 面リズムの確認: Hero(default) → Stats(muted) → Features(default) →
 * ModuleOverview(自己暗面・リズム除外) → Testimonial(default から再開) →
 * CTA(自己暗面)。muted の割り当てはすべて Page が行っており、
 * セクション側は無指定。
 */
export const リズム確認_ピアデスク: Story = {
  args: { brand: 'peerdesk', tone: 'product' },
  render: (args) => <Page {...args}>{sections.props.children}</Page>,
};

/** trust トーン: セクション余白が1段広くなる（コーポレート向け） */
export const トーン_trust: Story = {
  args: { brand: 'corporate', tone: 'trust' },
  render: (args) => <Page {...args}>{sections.props.children}</Page>,
};

/** campaign トーン: 余白を詰めてファーストビューに情報を寄せる（獲得LP向け） */
export const トーン_campaign: Story = {
  args: { brand: 'peerdesk-taxpeer', tone: 'campaign' },
  render: (args) => <Page {...args}>{sections.props.children}</Page>,
};

/** English content example (brand and tone are orthogonal) */
export const English_Polastack: Story = {
  args: { brand: 'polastack', tone: 'product' },
  render: (args) => (
    <Page {...args}>
      <HeroSection
        title="Scale your agent infrastructure, audit-ready."
        subtitle="Polastack is the enterprise agent stack. Deploy, observe, and govern AI agents without giving up compliance."
        actions={[
          { label: 'Read the docs', href: '#' },
          { label: 'Book a demo', href: '#' },
        ]}
      />
      <StatsSection
        title="Polastack in numbers"
        stats={[
          { value: '40ms', label: 'Median overhead' },
          { value: '99.9%', label: 'Uptime SLA' },
          { value: '12+', label: 'Framework integrations' },
        ]}
        asOf="As of July 2026"
      />
      <FeatureGrid
        eyebrow="Platform"
        title="Everything between your agents and production"
        features={[
          { title: 'Policy engine', description: 'Declarative guardrails enforced at runtime.' },
          { title: 'Audit trail', description: 'Every tool call, logged and searchable.' },
          { title: 'Zero retention', description: 'Your data never persists on our side.' },
        ]}
      />
      <CTASection
        title="Ready to ship agents you can trust?"
        actions={[
          { label: 'Book a demo', href: '#' },
          { label: 'Read the docs', href: '#' },
        ]}
      />
    </Page>
  ),
};
