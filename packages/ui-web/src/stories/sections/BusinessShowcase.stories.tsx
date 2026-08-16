import type { Meta, StoryObj } from '@storybook/react';
import { BusinessShowcase } from '../../components/sections/business-showcase';
import { MediaFrame } from '../../components/primitives/media-frame';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * BusinessShowcase — 事業内容（corporate-top）の主役セクション。
 *
 * 「事業内容」というひとまとまりの中に事業の小見出し（h3）がぶら下がり、
 * その下にプロダクト（h4）が「文 + ビジュアル」の交互配置で並ぶ2階層。
 * ServicePortfolio では階層が出ず、FeatureShowcase では
 * プロダクトごとの導線が置けない、という隙間を埋める部品。
 */
const meta: Meta<typeof BusinessShowcase> = {
  title: 'Sections/BusinessShowcase',
  component: BusinessShowcase,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BusinessShowcase>;

/** 3事業・4プロダクト（コーポレートサイトの実構成）。ビジュアルは MediaFrame で注入 */
export const ThreeBusinesses: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return isJa ? (
      <BusinessShowcase
        title="事業内容"
        subtitle="プラットフォーム事業を中核に、お客様の社内DX・ソフトウェア商材開発（OEM）を支援します"
        businesses={[
          {
            name: 'プラットフォーム事業',
            lead: '企業がシステムを安全かつスピーディにリリースするためのプラットフォームを開発・提供しています',
            products: [
              {
                brand: 'polastack',
                name: 'Polastack',
                description:
                  '企業品質の堅牢な基盤に API ひとつで繋がる Enterprise Backend Platform。',
                audience: '受託開発企業・SaaS 運営者・社内開発チーム',
                cta: { label: 'Polastack を見る', href: 'https://polastack.com' },
                image: (
                  <MediaFrame
                    src={photoPlaceholder('Polastack', 'green')}
                    alt="Polastack の管理コンソール"
                  />
                ),
              },
            ],
          },
          {
            name: '社内DX事業',
            lead: '中小企業向けの業務支援パッケージと DX 伴走支援で生産性の向上・コストの劇的な削減を支援します',
            products: [
              {
                brand: 'peerdesk',
                name: 'ピアデスク',
                description:
                  'AI スタッフが雑務を引き受ける。データが溜まって経営に活かせる。すぐに使える中小企業向けの業務システムパッケージ。',
                audience: '中小企業の経営層・現場',
                cta: { label: 'ピアデスクを見る', href: 'https://peerdesk.jp' },
                image: (
                  <MediaFrame
                    src={photoPlaceholder('ピアデスク', 'blue')}
                    alt="ピアデスクのダッシュボード"
                  />
                ),
              },
              {
                name: '顧問エンジニア',
                description:
                  '各企業様固有のニーズに応じたシステムの開発・運営をお客様に代わって実行いたします。開発だけで終わらず顧問として継続的な改善にも伴走いたします。',
                audience: '先端領域の IT 人材を置けない企業',
                cta: { label: '1 時間の無料相談', href: '/contact' },
                image: (
                  <MediaFrame
                    src={photoPlaceholder('顧問エンジニア', 'sand')}
                    alt="顧問エンジニアとの定例ミーティング"
                  />
                ),
              },
            ],
          },
          {
            name: 'ソフトウェアOEM事業',
            lead: 'パートナー企業様の新規商材として SaaS の企画・開発・運用を担い、売上向上をお手伝いします',
            products: [
              {
                name: 'SaaS OEM開発',
                description:
                  '新たな商材となる AI エージェント・SaaS の企画・開発・運用を、お客様に代わって担います。レベニューシェア型のため、初期費用は 50 万円から。',
                audience: '新規事業を考えている経営者／企業の新規事業担当者',
                cta: { label: '30 分の無料相談', href: '/contact' },
                image: (
                  <MediaFrame
                    src={photoPlaceholder('SaaS OEM', 'green')}
                    alt="OEM 開発のプロダクト検討ボード"
                  />
                ),
              },
            ],
          },
        ]}
      />
    ) : (
      <BusinessShowcase
        title="What we do"
        subtitle="Platform business at the core, supporting in-house DX and OEM software development."
        audienceLabel="For"
        businesses={[
          {
            name: 'Platform',
            lead: 'We build and operate the platform that lets companies ship systems safely and fast.',
            products: [
              {
                brand: 'polastack',
                name: 'Polastack',
                description:
                  'An enterprise backend platform — one API away from a hardened, enterprise-grade foundation.',
                audience: 'Software agencies, SaaS operators, in-house teams',
                cta: { label: 'Explore Polastack', href: 'https://polastack.com' },
                image: (
                  <MediaFrame
                    src={photoPlaceholder('Polastack', 'green')}
                    alt="Polastack admin console"
                  />
                ),
              },
            ],
          },
          {
            name: 'In-house DX',
            lead: 'Business packages and hands-on DX support for small and mid-sized companies.',
            products: [
              {
                brand: 'peerdesk',
                name: 'PeerDesk',
                description:
                  'AI staff take over the busywork. Data accumulates and feeds management decisions.',
                audience: 'SMB executives and operations teams',
                cta: { label: 'Explore PeerDesk', href: 'https://peerdesk.jp' },
                image: (
                  <MediaFrame src={photoPlaceholder('PeerDesk', 'blue')} alt="PeerDesk dashboard" />
                ),
              },
            ],
          },
        ]}
      />
    );
  },
};

/** ビジュアル素材が未定でも、MediaFrame のプレースホルダで枠を保って構成を組める */
export const WithoutImages: Story = {
  render: () => (
    <BusinessShowcase
      title="事業内容"
      businesses={[
        {
          name: 'プラットフォーム事業',
          lead: '企業がシステムを安全かつスピーディにリリースするためのプラットフォームを開発・提供しています',
          products: [
            {
              brand: 'polastack',
              name: 'Polastack',
              description:
                '企業品質の堅牢な基盤に API ひとつで繋がる Enterprise Backend Platform。',
              audience: '受託開発企業・SaaS 運営者・社内開発チーム',
              cta: { label: 'Polastack を見る', href: 'https://polastack.com' },
            },
          ],
        },
      ]}
    />
  ),
};
