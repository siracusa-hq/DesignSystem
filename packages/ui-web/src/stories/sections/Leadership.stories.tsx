import type { Meta, StoryObj } from '@storybook/react';
import { LeadershipSection } from '../../components/sections/leadership';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * LeadershipSection — 経営陣。
 *
 * TestimonialSection は顧客の声のための語彙なので流用できない
 * （役員紹介に使うと「お客様の声」の見た目になる）。
 * カードの意匠は CaseCard と揃えてあり、列数は件数から導出する。
 */
const meta: Meta<typeof LeadershipSection> = {
  title: 'Sections/LeadershipSection',
  component: LeadershipSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof LeadershipSection>;

/** 2名 → 2列。顔写真つき */
export const TwoMembers: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LeadershipSection
        title={isJa ? '経営陣' : 'Leadership'}
        members={
          isJa
            ? [
                {
                  role: '代表取締役 CEO',
                  name: '金子 卓也',
                  nameEn: 'KANEKO Takuya',
                  photo: {
                    src: photoPlaceholder('CEO', 'green', '1:1'),
                    alt: '代表取締役 CEO 金子 卓也のポートレート',
                  },
                  bio: '大手 SIer で製造業向けの基幹システム導入に10年従事したのち、SaaS スタートアップで事業開発を担当。2024年にシラクサを共同創業し、GTM 戦略とパートナーシップを統括。',
                },
                {
                  role: '取締役 CTO',
                  name: '立花 直人',
                  nameEn: 'TACHIBANA Naoto',
                  photo: {
                    src: photoPlaceholder('CTO', 'blue', '1:1'),
                    alt: '取締役 CTO 立花 直人のポートレート',
                  },
                  bio: '検索基盤とデータ基盤の設計を専門とし、国内外のプラットフォーム企業でバックエンド基盤の開発をリード。Polastack のアーキテクチャ全般を担当。',
                },
              ]
            : [
                {
                  role: 'Co-founder & CEO',
                  name: 'Takuya Kaneko',
                  photo: {
                    src: photoPlaceholder('CEO', 'green', '1:1'),
                    alt: 'Portrait of Takuya Kaneko, Co-founder and CEO',
                  },
                  bio: 'Ten years delivering core systems for manufacturers at a large SI firm, then business development at a SaaS startup. Leads GTM and partnerships.',
                },
                {
                  role: 'Co-founder & CTO',
                  name: 'Naoto Tachibana',
                  photo: {
                    src: photoPlaceholder('CTO', 'blue', '1:1'),
                    alt: 'Portrait of Naoto Tachibana, Co-founder and CTO',
                  },
                  bio: 'Specialist in search and data infrastructure. Led backend platform work at platform companies in Japan and abroad. Owns the Polastack architecture.',
                },
              ]
        }
      />
    );
  },
};

/** 担当1行 + 略歴の箇条書き（会社情報ページの正本形式。bio に配列を渡す） */
export const WithFocusAndBulletBio: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LeadershipSection
        title={isJa ? '経営陣' : 'Leadership'}
        focusLabel={isJa ? '担当' : 'Focus'}
        members={
          isJa
            ? [
                {
                  role: '代表取締役',
                  name: '金子 傑',
                  focus: 'GTM戦略・事業開発',
                  bio: [
                    '2019年4月 VMware株式会社 入社',
                    '2020年2月 エンタープライズ営業本部にて大手金融機関向け営業に従事',
                    '2023年12月 株式会社siracusa 創業',
                  ],
                },
                {
                  role: '取締役 CTO',
                  name: '立花 直人',
                  focus: 'プロダクト開発・技術アーキテクチャ',
                  bio: [
                    '国内外のプラットフォーム企業でバックエンド基盤の開発をリード',
                    '検索基盤・データ基盤の設計を専門とする',
                    'Polastack のアーキテクチャ全般を担当',
                  ],
                },
              ]
            : [
                {
                  role: 'CEO',
                  name: 'Suguru Kaneko',
                  focus: 'GTM strategy and business development',
                  bio: [
                    'Joined VMware in April 2019',
                    'Enterprise sales for major financial institutions from 2020',
                    'Founded siracusa Inc. in December 2023',
                  ],
                },
                {
                  role: 'CTO',
                  name: 'Naoto Tachibana',
                  focus: 'Product and architecture',
                  bio: [
                    'Led backend platform work at platform companies',
                    'Specialist in search and data infrastructure',
                    'Owns the Polastack architecture',
                  ],
                },
              ]
        }
      />
    );
  },
};

/** 3名以上 → 3列。写真を渡さない場合はイニシャルで枠を保つ（カードの高さを揃えるため） */
export const ThreeMembers: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LeadershipSection
        title={isJa ? '経営陣' : 'Leadership'}
        subtitle={
          isJa ? '事業と技術の両輪で意思決定しています。' : 'Business and engineering, in step.'
        }
        members={
          isJa
            ? [
                { role: '代表取締役 CEO', name: '金子 卓也', bio: 'GTM 戦略とパートナーシップを統括。' },
                { role: '取締役 CTO', name: '立花 直人', bio: 'Polastack のアーキテクチャを担当。' },
                { role: '取締役 CFO', name: '佐倉 美咲', bio: '財務・法務・コーポレートを担当。' },
              ]
            : [
                { role: 'CEO', name: 'Takuya Kaneko', bio: 'Leads GTM and partnerships.' },
                { role: 'CTO', name: 'Naoto Tachibana', bio: 'Owns the Polastack architecture.' },
                { role: 'CFO', name: 'Misaki Sakura', bio: 'Finance, legal and corporate.' },
              ]
        }
      />
    );
  },
};
