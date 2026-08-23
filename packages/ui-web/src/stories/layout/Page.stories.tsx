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
 * - セクションは自分では面を選ばない。既定では Page が default ↔ muted を交互に割り当てる
 * - 自分で暗面を塗るセクション（ModuleOverview / CTASection 等）は
 *   リズムから除外され、直後は必ず default から再開する
 * - `surfaces` を渡すと、パターン／ページ側が面を明示的に割り当てられる
 *   （LP はここで白 × ブランドティントの面を作る）
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
      title="管理部門の定型業務を、まとめて引き受ける"
      features={[
        { title: '請求書の自動読取', description: 'AI-OCRが紙の請求書を数秒でデータ化します。' },
        { title: '承認フローの整理', description: '社内の承認ルートをそのまま再現できます。' },
        { title: '会計ソフト連携', description: '主要な会計ソフトへワンクリックで連携します。' },
      ]}
    />
    <ModuleOverview
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
export const 面リズムの自動割当: Story = {
  args: { brand: 'peerdesk', tone: 'product' },
  render: (args) => <Page {...args}>{sections.props.children}</Page>,
};

/**
 * 自動割当の色をティントに（`autoSurface="tinted"`): `corporate-top` が使う形。
 *
 * 上の「面リズムの自動割当」と**沈む位置は同じ**で、色だけがニュートラルグレー
 * （#f4f4f5）からブランドのティント淡色に変わる。LP のように「どこで面が変わるか」
 * まで作り替えるのではなく、色だけをブランド寄りにしたいページ型のための口。
 *
 * 任意スロットの有無で崩れないのが `surfaces` との違い。どのスロットが沈むかは
 * 自動のままなので、途中のセクションが省かれてもティントが連続したり消えたりしない。
 */
export const 自動割当をティントに: Story = {
  args: { brand: 'corporate', tone: 'trust', autoSurface: 'tinted' },
  render: (args) => <Page {...args}>{sections.props.children}</Page>,
};

/**
 * 面の明示割当（`surfaces`）: LP の面シーケンス。
 *
 * 機械的な ABAB ゼブラをやめ、**白の連続の中に社会的証明（数値 / 導入企業の声）だけが
 * ブランドのティント淡色で浮かぶ**割当にしたもの。面交替は2回で、国内 BtoB SaaS
 * 実測の主流レンジ（1〜3回・対比 1.04〜1.12:1）に収まる
 * （docs/research/research-eyebrow.md §4-3）。
 *
 * 上の「面リズムの自動割当」と見比べること。違いはニュートラルグレー（#f4f4f5）か
 * ブランドティントか、そして**どこで面が変わるか**の2点。
 */
export const 面の明示割当_LP風: Story = {
  args: { brand: 'peerdesk', tone: 'product' },
  render: (args) => (
    /* hero=auto / 数値=tinted / 機能=default / ModuleOverview=auto（暗面を自己申告）/
       導入企業の声=tinted / CTA=配列の外（暗面を自己申告） */
    <Page {...args} surfaces={['auto', 'tinted', 'default', 'auto', 'tinted']}>
      {sections.props.children}
    </Page>
  ),
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
