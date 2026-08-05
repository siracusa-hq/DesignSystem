import type { Meta, StoryObj } from '@storybook/react';
import { CTABand } from '../../components/sections/cta-band';
import { Page } from '../../components/layout/page';
import { HeroSection } from '../../components/sections/hero-section';
import { FeatureGrid } from '../../components/sections/feature-grid';
import { TestimonialSection } from '../../components/sections/testimonial-section';
import { CTASection } from '../../components/sections/cta-section';

/**
 * CTABand — セクション区切りに**繰り返し置く**コンバージョン帯。
 *
 * LP 実測（19ページ）の標準形は「同じ2種の CTA ラベルをセクション区切りごとに
 * 4〜6回反復する」。CTABand はその反復のための部品で、ページ末尾の締めは
 * 従来どおり CTASection（暗面）が担う。
 *
 * 規範はラベルの種類だけ: **プライマリ CTA のラベルは2種類まで**。
 * Page 配下で3種類目を置くと dev 警告が出る（回数は数えない）。
 */
const meta = {
  title: 'Sections/CTABand',
  component: CTABand,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CTABand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 日本語: Story = {
  args: {
    title: 'まずは資料からご覧ください',
    note: '無料・1分で完了',
    actions: [
      { label: '資料をダウンロード', href: '#' },
      { label: '料金を見る', href: '#' },
    ],
  },
};

export const English: Story = {
  args: {
    title: 'See Polastack in action',
    note: 'Free — takes one minute',
    actions: [
      { label: 'Book a demo', href: '#' },
      { label: 'Read the docs', href: '#' },
    ],
  },
};

export const オファー1つ: Story = {
  args: {
    title: '料金プランは3分で診断できます',
    actions: [{ label: '料金を見る', href: '#' }],
  },
};

/**
 * 実際の使い方: 同じ2種のラベルをセクション区切りごとに反復する。
 * CTABand は淡いブランド面（accent）なので Page の交互リズムから除外され、
 * 前後のセクションのリズムを乱さない。末尾の締めだけ CTASection。
 */
export const ページ内での反復_ピアデスク: Story = {
  args: 日本語.args,
  render: () => {
    const offers: [{ label: string; href: string }, { label: string; href: string }] = [
      { label: '資料をダウンロード', href: '#' },
      { label: '料金を見る', href: '#' },
    ];
    return (
      <Page brand="peerdesk" tone="product">
        <HeroSection
          title="現場の紙の山を、その日のうちにデータに。"
          subtitle="ピアデスクは、非IT企業の管理部門のための業務効率化シリーズです。"
          actions={offers}
        />
        <FeatureGrid
          title="管理部門の定型業務を、まとめて引き受ける"
          features={[
            { title: '請求書の自動読取', description: 'AI-OCRが紙の請求書を数秒でデータ化します。' },
            { title: '承認フローの整理', description: '社内の承認ルートをそのまま再現できます。' },
            { title: '会計ソフト連携', description: '主要な会計ソフトへワンクリックで連携します。' },
          ]}
        />
        <CTABand title="まずは資料からご覧ください" note="無料・1分で完了" actions={offers} />
        <TestimonialSection
          title="導入企業の声"
          testimonials={[
            {
              quote: '月末の残業がなくなりました。',
              author: '経理部長',
              company: '株式会社サンプル製作所',
            },
          ]}
        />
        <CTABand title="貴社の業務でも試せます" note="無料・1分で完了" actions={offers} />
        <CTASection
          kicker="＼5分でわかる資料をプレゼント／"
          title="まずは資料からご覧ください"
          actions={offers}
          socialProof="1,200社が利用中"
        />
      </Page>
    );
  },
};
