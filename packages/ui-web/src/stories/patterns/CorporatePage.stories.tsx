import type { Meta, StoryObj } from '@storybook/react';
import { defineLandingPage, LandingPage } from '../../patterns';

/**
 * コーポレートページ（`corporate-top` 型）。
 *
 * 読み手は投資家・採用候補・パートナーであって、製品の買い手ではない。
 * コンバージョン CTA を持たない唯一のランディング型なので、
 * 獲得目的の Patterns/LandingPage とは棚を分けている。
 * 部品を手で組んだ参照実装は Examples/CorporateTop（VRT 対象）を参照。
 */
const meta = {
  title: 'Patterns/CorporatePage',
  component: LandingPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;


/** コーポレートトップ（ビジョン型・trust トーン既定）。コンバージョン CTA を持たない */
export const コーポレートトップ: Story = {
  args: defineLandingPage({
    pattern: 'corporate-top',
    brand: 'corporate',
    hero: {
      title: '確かな業務の、確かな道具を。',
      subtitle: 'シラクサは、企業の業務とAIの間に立つソフトウェアをつくる会社です。',
    },
    services: {
      eyebrow: 'Business',
      title: '事業内容',
      services: [
        {
          brand: 'polastack',
          name: 'Polastack',
          tagline: 'エンタープライズ Agent 基盤',
          description: 'AI エージェントを監査可能なままスケールさせる。',
          href: '#polastack',
        },
        {
          brand: 'peerdesk',
          name: 'ピアデスク シリーズ',
          tagline: '管理部門の業務効率化',
          description: '非IT企業の管理部門のための業務効率化シリーズ。',
          href: '#peerdesk',
        },
      ],
    },
    stats: {
      stats: [
        { value: '2', suffix: '事業', label: 'プロダクトライン', numericValue: 2 },
        { value: '1,200', suffix: '社', label: '取引社数', numericValue: 1200 },
      ],
      asOf: '※2026年7月末時点',
    },
  }),
};
