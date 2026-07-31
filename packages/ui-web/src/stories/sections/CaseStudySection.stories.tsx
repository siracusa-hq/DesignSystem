import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudySection } from '../../components/sections/case-study-card';

const meta: Meta<typeof CaseStudySection> = {
  title: 'Sections/CaseStudySection',
  component: CaseStudySection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof CaseStudySection>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <CaseStudySection
        eyebrow={isJa ? '導入事例' : 'CASE STUDIES'}
        title={isJa ? 'お客様の成功事例' : 'Customer success stories'}
        subtitle={
          isJa
            ? 'Polastackを導入した企業の成果をご紹介します。'
            : 'See how companies achieve results with Polastack.'
        }
        cases={
          isJa
            ? [
                {
                  companyName: 'テックスタートアップ株式会社',
                  quote: '認証基盤を3週間で構築できた。以前はSaaS連携だけで2ヶ月かかっていた。',
                  metrics: [
                    { label: '開発期間短縮', value: '80%' },
                    { label: '認証コード削減', value: '0行' },
                  ],
                  href: '/case-studies/tech-startup',
                  linkLabel: '事例を見る',
                },
                {
                  companyName: '人材サービス株式会社',
                  quote: '100万件超のレコードでもPolaFindなら検索がミリ秒。業務効率が劇的に改善した。',
                  metrics: [
                    { label: '検索速度', value: '<50ms' },
                    { label: '対応レコード数', value: '100万+' },
                  ],
                  href: '/case-studies/hr-services',
                  linkLabel: '事例を見る',
                },
              ]
            : [
                {
                  companyName: 'Tech Startup Inc.',
                  quote: 'We built our auth infrastructure in 3 weeks. Previously, SaaS integration alone took 2 months.',
                  metrics: [
                    { label: 'Dev time reduced', value: '80%' },
                    { label: 'Auth code written', value: '0 lines' },
                  ],
                  href: '/case-studies/tech-startup',
                  linkLabel: 'Read case study',
                },
                {
                  companyName: 'HR Services Inc.',
                  quote: 'PolaFind delivers millisecond search even with 1M+ records. Dramatically improved operations.',
                  metrics: [
                    { label: 'Search speed', value: '<50ms' },
                    { label: 'Records handled', value: '1M+' },
                  ],
                  href: '/case-studies/hr-services',
                  linkLabel: 'Read case study',
                },
              ]
        }
      />
    );
  },
};

export const DarkBackground: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <CaseStudySection
        title={isJa ? '導入企業の声' : 'What customers say'}
        background="dark"
        columns={3}
        cases={
          isJa
            ? [
                {
                  companyName: 'A社',
                  quote: '認証実装の工数がゼロになった。',
                  metrics: [{ label: '工数削減', value: '100%' }],
                },
                {
                  companyName: 'B社',
                  quote: '検索レスポンスが100倍速くなった。',
                  metrics: [{ label: '速度改善', value: '100x' }],
                },
                {
                  companyName: 'C社',
                  quote: 'デプロイまでの期間が1/5に短縮。',
                  metrics: [{ label: '期間短縮', value: '80%' }],
                },
              ]
            : [
                {
                  companyName: 'Company A',
                  quote: 'Zero auth implementation effort.',
                  metrics: [{ label: 'Effort reduced', value: '100%' }],
                },
                {
                  companyName: 'Company B',
                  quote: 'Search response 100x faster.',
                  metrics: [{ label: 'Speed improvement', value: '100x' }],
                },
                {
                  companyName: 'Company C',
                  quote: 'Time to deploy reduced to 1/5.',
                  metrics: [{ label: 'Time reduction', value: '80%' }],
                },
              ]
        }
      />
    );
  },
};
