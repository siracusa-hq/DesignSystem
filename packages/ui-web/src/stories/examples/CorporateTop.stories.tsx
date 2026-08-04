import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from '../../components/layout/page-layout';
import { HeroSection } from '../../components/sections/hero-section';
import { ServicePortfolio } from '../../components/sections/service-portfolio';
import { StatsSection } from '../../components/sections/stats-section';
import { SecurityBadges } from '../../components/sections/security-badges';
import { CTASection } from '../../components/sections/cta-section';

/**
 * 検証関門（stage2-workorder.md Slice 3）— コーポレートトップ（product-portfolio-top 型）。
 *
 * ここで検証していること:
 * - ServicePortfolio のカードが data-brand だけで各ブランド色になる（React側に分岐なし）
 * - 数値訴求4スロット + 時点注記 / 信頼バッジ3系統 / kicker付き2オファーCTA
 *   （LP調査 [LP] の必須要素がすべて部品として存在する）
 * - 削除済み props（background / spacing / eyebrowStyle / variant）なしでページが成立する
 */

const page = (
  <PageLayout
    headerProps={{
      navItems: [
        {
          label: 'サービス',
          href: '#services',
          children: [
            { label: 'Polastack', href: '#polastack' },
            { label: 'タックスピア', href: '#taxpeer' },
          ],
        },
        { label: '導入事例', href: '#cases' },
        { label: '会社情報', href: '#company' },
      ],
      actions: [
        { label: '採用情報', href: '#recruit' },
        { label: 'お問い合わせ', href: '#contact' },
      ],
    }}
    footerProps={{
      description: '業務の現場に、監査に耐えるソフトウェアを。',
      linkGroups: [
        {
          title: 'サービス',
          links: [
            { label: 'Polastack', href: '#' },
            { label: 'タックスピア', href: '#' },
          ],
        },
        {
          title: '会社情報',
          links: [
            { label: '会社概要', href: '#' },
            { label: '採用情報', href: '#' },
          ],
        },
        {
          title: 'サポート',
          links: [
            { label: 'お問い合わせ', href: '#' },
            { label: 'ニュース', href: '#' },
          ],
        },
      ],
      legalLinks: [
        { label: 'プライバシーポリシー', href: '#' },
        { label: '特定商取引法に基づく表記', href: '#' },
      ],
      copyright: '© 2026 Siracusa Inc.',
    }}
  >
    <HeroSection
      badge="コーポレート"
      title={
        <>
          業務の現場に、
          <br />
          監査に耐えるソフトウェアを。
        </>
      }
      subtitle="エンタープライズ Agent 基盤の Polastack と、バックオフィスの専門業務をつなぐ ピアデスク シリーズ。2つのサービスラインで、企業の中枢業務を支えます。"
      actions={[
        { label: '会社紹介資料をダウンロード', href: '#download' },
        { label: '採用情報を見る', href: '#recruit' },
      ]}
    />
    <ServicePortfolio
      eyebrow="サービス"
      title="2つのサービスライン"
      subtitle="技術者向けの基盤と、非技術者向けの業務シリーズ。色が違っても、同じ会社のトーンで。"
      services={[
        {
          brand: 'polastack',
          name: 'Polastack',
          tagline: 'Enterprise Agent Stack',
          description:
            '監査ログ・権限管理・ゼロ保持を備えた、エンタープライズ向けエージェント基盤。技術チームが安心して本番投入できる裏側を引き受けます。',
          href: '#polastack',
        },
        {
          brand: 'peerdesk',
          name: 'ピアデスク',
          tagline: 'バックオフィス業務シリーズ',
          description:
            '現場と専門家をつなぐ業務シリーズ。税務からはじまり、労務・法務へ。ひとつのデスクで、順番に。',
          href: '#peerdesk',
        },
        {
          brand: 'peerdesk-taxpeer',
          name: 'タックスピア',
          tagline: 'ピアデスク シリーズ第一弾',
          description:
            '税務のやりとりを、ひとつのデスクに。顧問税理士との協働を前提にした税務業務ハブ。',
          href: '#taxpeer',
        },
      ]}
    />
    <StatsSection
      eyebrow="実績"
      title="数字で見る Siracusa"
      stats={[
        { value: '120社', numericValue: 120, suffix: '社', label: '導入企業数' },
        { value: '99.9%', numericValue: 99.9, suffix: '%', label: '継続率' },
        { value: '38%', numericValue: 38, suffix: '%', label: '経理業務の削減率' },
        { value: 'No.1', label: 'Agent基盤 満足度', description: '※ ITreview 2026 上期' },
      ]}
      note="※ 2026年7月末時点。No.1 表記は ITreview カテゴリーレポート 2026 上期による。"
    />
    <SecurityBadges
      title="セキュリティと信頼への取り組み"
      badges={[
        {
          name: 'ISMS (ISO 27001)',
          description: '情報セキュリティ管理',
          category: 'certification',
        },
        { name: 'プライバシーマーク', description: '個人情報保護', category: 'certification' },
        { name: 'ITreview High Performer', description: '2026 上期', category: 'award' },
        { name: '電子帳簿保存法 対応', description: 'JIIMA 認証', category: 'legal' },
      ]}
    />
    <CTASection
      kicker="＼ 5分でわかる会社紹介資料 ／"
      title="まずは、資料からご覧ください。"
      subtitle="サービスの詳細、導入の流れ、料金の考え方をまとめています。"
      actions={[
        { label: '資料をダウンロード', href: '#download' },
        { label: '導入の相談をする', href: '#contact' },
      ]}
      socialProof="スタートアップから上場企業まで 120社が導入"
      note="※ ご入力いただいたメールアドレスに自動送付します。営業のお電話はいたしません。"
    />
  </PageLayout>
);

const meta = {
  title: 'Examples/CorporateTop（コーポレートトップ）',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const 検証関門: Story = { render: () => page };
