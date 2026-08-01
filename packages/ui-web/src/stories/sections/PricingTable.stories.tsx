import type { Meta, StoryObj } from '@storybook/react';
import { PricingTable } from '../../components/sections/pricing';

const meta: Meta<typeof PricingTable> = {
  title: 'Sections/PricingTable',
  component: PricingTable,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PricingTable>;

export const FourPlans: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <PricingTable
        eyebrow={isJa ? '料金プラン' : 'PRICING'}
        title={isJa ? 'シンプルで透明な料金体系' : 'Simple, transparent pricing'}
        subtitle={
          isJa
            ? 'すべてのプランで全11モジュールが利用可能。規模に合わせてスケール。'
            : 'All 11 modules available on every plan. Scale as you grow.'
        }
        plans={[
          {
            name: 'Sandbox',
            description: isJa ? '技術検証・学習専用' : 'Technical evaluation & learning',
            price: (
              <span className="text-display-sm font-bold tracking-tight md:text-display-md">
                ¥0
              </span>
            ),
            priceNote: isJa ? '本番運用不可' : 'Not for production use',
            features: [
              { text: isJa ? '全11モジュール利用可能' : 'All 11 modules', included: true },
              { text: isJa ? '1ユーザー' : '1 user', included: true },
              { text: isJa ? 'リソース制限あり' : 'Resource limits apply', included: true },
              { text: isJa ? 'コミュニティサポート' : 'Community support', included: true },
              { text: isJa ? '本番環境' : 'Production environment', included: false },
              { text: isJa ? 'SSO/SAML' : 'SSO/SAML', included: false },
            ],
            action: {
              label: isJa ? '無料で始める' : 'Start Free',
              href: '/signup',
              variant: 'secondary',
            },
          },
          {
            name: 'Growth',
            description: isJa ? '全利用者向け統一プラン' : 'Unified plan for all users',
            badge: isJa ? 'おすすめ' : 'Recommended',
            highlighted: true,
            price: (
              <span className="text-display-sm font-bold tracking-tight md:text-display-md">
                ¥30,000
                <span className="text-body-md font-normal text-neutral-500">{isJa ? '/月' : '/mo'}</span>
              </span>
            ),
            priceNote: isJa ? '税別・ユーザー枠¥10,000分 + アプリ枠¥20,000分含む' : 'excl. tax, includes ¥10K user + ¥20K app credits',
            features: [
              { text: isJa ? '全11モジュール統合' : 'All 11 modules integrated', included: true },
              { text: isJa ? 'メール + チャットサポート' : 'Email + chat support', included: true },
              { text: isJa ? 'ストレージ 30GB 含む' : '30GB storage included', included: true },
              { text: isJa ? 'APIリクエスト 130万回/月' : '1.3M API requests/mo', included: true },
              { text: isJa ? 'マルチテナント対応' : 'Multi-tenant support', included: true },
              { text: isJa ? 'SSO/SAML（¥50,000/接続/月）' : 'SSO/SAML (¥50,000/connection/mo)', included: true },
            ],
            action: {
              label: isJa ? '申し込む' : 'Get Started',
              href: '/signup/growth',
              variant: 'primary',
            },
          },
          {
            name: 'Partner',
            description: isJa ? 'ISV/受託開発会社向け（承認制）' : 'For ISVs & dev agencies (approval required)',
            price: (
              <span className="text-display-sm font-bold tracking-tight md:text-display-md">
                ¥50,000
                <span className="text-body-md font-normal text-neutral-500">{isJa ? '/月' : '/mo'}</span>
              </span>
            ),
            priceNote: isJa ? '税別・Builder 3名 + End User 50名含む' : 'excl. tax, includes 3 Builders + 50 End Users',
            features: [
              { text: isJa ? '全11モジュール統合' : 'All 11 modules integrated', included: true },
              { text: isJa ? '顧客テナント作成可能' : 'Create customer tenants', included: true },
              { text: isJa ? 'End User課金（¥300/人〜）' : 'End User billing (¥300/user~)', included: true },
              { text: isJa ? 'ティア昇格で割引' : 'Tier upgrades for discounts', included: true },
              { text: isJa ? 'テクニカルサポート優先' : 'Priority technical support', included: true },
              { text: isJa ? 'パートナーロゴ使用権' : 'Partner logo usage rights', included: true },
            ],
            action: {
              label: isJa ? 'パートナー申請' : 'Apply for Partner',
              href: '/partner',
              variant: 'secondary',
            },
          },
          {
            name: 'Self-Hosted',
            description: isJa ? '顧客インフラにデプロイ' : 'Deploy to your infrastructure',
            price: (
              <span className="text-display-sm font-bold tracking-tight md:text-display-md">
                {isJa ? 'カスタム' : 'Custom'}
              </span>
            ),
            priceNote: isJa ? 'データ主権・コンプライアンス要件向け' : 'For data sovereignty & compliance',
            features: [
              { text: isJa ? '全11モジュール統合' : 'All 11 modules integrated', included: true },
              { text: isJa ? 'SLA保証' : 'SLA guaranteed', included: true },
              { text: isJa ? 'SSO/SCIM 込み' : 'SSO/SCIM included', included: true },
              { text: isJa ? 'CTO直接Slackチャネル' : 'Direct CTO Slack channel', included: true },
              { text: isJa ? 'オンプレミス/VPC配置' : 'On-premise / VPC deployment', included: true },
              { text: isJa ? '請求書払い対応' : 'Invoice billing', included: true },
            ],
            action: {
              label: isJa ? 'お問い合わせ' : 'Contact Sales',
              href: '/contact',
              variant: 'secondary',
            },
          },
        ]}
      />
    );
  },
};
