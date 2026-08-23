import type { Meta, StoryObj } from '@storybook/react';
import { CompanyProfileSection } from '../../components/sections/company-profile';

/**
 * CompanyProfileSection — 会社概要表。
 *
 * 国内 BtoB のコーポレートサイトの標準語彙。各プロダクトサイトの
 * 「運営会社情報」でも同じものを使うため、セクション部品として持つ。
 *
 * ラベル列は `--color-text-brand-strong`、値は本文色。
 * 事例記事の会社プロフィールと同じ配色にしてある。
 */
const meta: Meta<typeof CompanyProfileSection> = {
  title: 'Sections/CompanyProfileSection',
  component: CompanyProfileSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof CompanyProfileSection>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <CompanyProfileSection
        title={isJa ? '会社概要' : 'Company profile'}
        items={
          isJa
            ? [
                { label: '商号', value: 'シラクサ株式会社（Siracusa, Inc.）' },
                { label: '設立', value: '2024年4月' },
                { label: '代表者', value: '代表取締役 CEO　金子 卓也' },
                { label: '所在地', value: '〒150-0002　東京都渋谷区渋谷 1-2-3　渋谷サウスビル 8F' },
                { label: '資本金', value: '5,000万円（資本準備金を含む）' },
                {
                  label: '事業内容',
                  value: [
                    'エンタープライズ向けエージェント基盤「Polastack」の開発・提供',
                    '社内ヘルプデスク SaaS「ピアデスク」の開発・提供',
                    '業務プロセス設計・導入支援',
                  ],
                },
                // 時点を伴う数値は、時点を値の中に含めて書く（GUIDELINES §3）
                { label: '従業員数', value: '12名（2026年7月末時点・業務委託を含む）' },
              ]
            : [
                { label: 'Legal name', value: 'Siracusa, Inc.' },
                { label: 'Founded', value: 'April 2024' },
                { label: 'CEO', value: 'Takuya Kaneko' },
                { label: 'Address', value: '8F Shibuya South Bldg, 1-2-3 Shibuya, Tokyo 150-0002' },
                {
                  label: 'Business',
                  value: [
                    'Polastack — an enterprise agent platform',
                    'Peerdesk — internal help desk SaaS',
                    'Process design and implementation support',
                  ],
                },
                { label: 'Headcount', value: '12 (as of July 2026, including contractors)' },
              ]
        }
      />
    );
  },
};

/** href を持つ値はリンクで組む — 窓口一覧の mailto、会社概要の公式サイト行など */
export const WithLinks: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <CompanyProfileSection
        title={isJa ? 'お問い合わせ窓口' : 'Contact points'}
        subtitle={
          isJa
            ? '内容に応じて、以下の窓口までご連絡ください。'
            : 'Reach the right inbox for your inquiry.'
        }
        items={
          isJa
            ? [
                {
                  label: '営業に関するお問い合わせ',
                  value: { text: 'sales@siracusa.jp', href: 'mailto:sales@siracusa.jp' },
                },
                {
                  label: 'パートナーシップ',
                  value: { text: 'partners@siracusa.jp', href: 'mailto:partners@siracusa.jp' },
                },
                {
                  label: '取材・メディア',
                  value: { text: 'press@siracusa.jp', href: 'mailto:press@siracusa.jp' },
                },
                {
                  // 配列の中で文字列とリンクを混在できる
                  label: '公式サイト',
                  value: [
                    { text: 'https://siracusa.jp', href: 'https://siracusa.jp' },
                    '受付時間: 平日 10:00–18:00',
                  ],
                },
              ]
            : [
                {
                  label: 'Sales',
                  value: { text: 'sales@siracusa.jp', href: 'mailto:sales@siracusa.jp' },
                },
                {
                  label: 'Partnerships',
                  value: { text: 'partners@siracusa.jp', href: 'mailto:partners@siracusa.jp' },
                },
                {
                  label: 'Press',
                  value: { text: 'press@siracusa.jp', href: 'mailto:press@siracusa.jp' },
                },
              ]
        }
      />
    );
  },
};
