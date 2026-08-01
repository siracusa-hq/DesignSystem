import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialSection } from '../../components/sections/testimonial-section';

const meta: Meta<typeof TestimonialSection> = {
  title: 'Sections/TestimonialSection',
  component: TestimonialSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof TestimonialSection>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <TestimonialSection
        eyebrow={isJa ? 'お客様の声' : 'TESTIMONIALS'}
        title={isJa ? '導入企業の評価' : 'What our customers say'}
        testimonials={
          isJa
            ? [
                {
                  quote: '認証実装に3週間かけていたのが、PolaAuthで初日から本番レベルのSSO/SAMLが使えるようになった。',
                  author: '鈴木一郎',
                  role: 'CTO',
                  company: 'テックスタートアップ株式会社',
                },
                {
                  quote: 'kintoneでは10万件を超えると検索が使い物にならなかったが、PolaFindなら100万件でもミリ秒。',
                  author: '佐藤花子',
                  role: '開発リード',
                  company: '人材サービス株式会社',
                },
                {
                  quote: '11モジュール統合で、これまで個別に組み合わせていたSaaSの連携コストがゼロになった。',
                  author: '高橋健太',
                  role: 'VPoE',
                  company: 'エンタープライズSaaS株式会社',
                },
              ]
            : [
                {
                  quote: 'Authentication that used to take 3 weeks now works from day one with PolaAuth — production-grade SSO/SAML.',
                  author: 'Ichiro Suzuki',
                  role: 'CTO',
                  company: 'Tech Startup Inc.',
                },
                {
                  quote: 'Search was unusable with kintone past 100K records. PolaFind handles 1M+ in milliseconds.',
                  author: 'Hanako Sato',
                  role: 'Dev Lead',
                  company: 'HR Services Inc.',
                },
                {
                  quote: '11 integrated modules eliminated the integration costs of combining separate SaaS tools.',
                  author: 'Kenta Takahashi',
                  role: 'VPoE',
                  company: 'Enterprise SaaS Inc.',
                },
              ]
        }
      />
    );
  },
};

export const WithRatings: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <TestimonialSection
        eyebrow={isJa ? 'お客様の声' : 'TESTIMONIALS'}
        title={isJa ? '星評価付きテスティモニアル' : 'Testimonials with star ratings'}
        testimonials={
          isJa
            ? [
                {
                  quote: '認証実装に3週間かけていたのが、PolaAuthで初日から本番レベルのSSO/SAMLが使えるようになった。',
                  author: '鈴木一郎',
                  role: 'CTO',
                  company: 'テックスタートアップ株式会社',
                  rating: 5,
                },
                {
                  quote: 'kintoneでは10万件を超えると検索が使い物にならなかったが、PolaFindなら100万件でもミリ秒。',
                  author: '佐藤花子',
                  role: '開発リード',
                  company: '人材サービス株式会社',
                  rating: 5,
                },
                {
                  quote: '11モジュール統合で、これまで個別に組み合わせていたSaaSの連携コストがゼロになった。',
                  author: '高橋健太',
                  role: 'VPoE',
                  company: 'エンタープライズSaaS株式会社',
                  rating: 4,
                },
              ]
            : [
                {
                  quote: 'Authentication that used to take 3 weeks now works from day one with PolaAuth.',
                  author: 'Ichiro Suzuki',
                  role: 'CTO',
                  company: 'Tech Startup Inc.',
                  rating: 5,
                },
                {
                  quote: 'Search was unusable past 100K records. PolaFind handles 1M+ in milliseconds.',
                  author: 'Hanako Sato',
                  role: 'Dev Lead',
                  company: 'HR Services Inc.',
                  rating: 5,
                },
                {
                  quote: '11 integrated modules eliminated the integration costs of combining separate SaaS tools.',
                  author: 'Kenta Takahashi',
                  role: 'VPoE',
                  company: 'Enterprise SaaS Inc.',
                  rating: 4,
                },
              ]
        }
      />
    );
  },
};
