import type { Meta, StoryObj } from '@storybook/react';
import { StatsSection } from '../../components/sections/stats-section';

const meta: Meta<typeof StatsSection> = {
  title: 'Sections/StatsSection',
  component: StatsSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <StatsSection
        eyebrow={isJa ? '実績' : 'BY THE NUMBERS'}
        title={isJa ? 'Polastackの効果' : 'Polastack impact'}
        stats={
          isJa
            ? [
                { value: '70%', label: '開発時間短縮', description: '非機能要件の実装時間を削減' },
                { value: '11', label: '統合モジュール', description: '認証からホスティングまで' },
                { value: '99.9%', label: 'SLA保証', description: 'Corporate Plan以上' },
                { value: '3-5週間', label: '本番デプロイ', description: '従来13-26週間から短縮' },
              ]
            : [
                { value: '70%', label: 'Dev time saved', description: 'Reduction in non-functional implementation' },
                { value: '11', label: 'Integrated modules', description: 'From auth to hosting' },
                { value: '99.9%', label: 'SLA guaranteed', description: 'Corporate Plan and above' },
                { value: '3-5 wks', label: 'To production', description: 'Down from 13-26 weeks' },
              ]
        }
      />
    );
  },
};

export const Animated: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <StatsSection
        eyebrow={isJa ? '実績' : 'BY THE NUMBERS'}
        title={isJa ? 'Polastackの効果' : 'Polastack impact'}
        animated
        stats={
          isJa
            ? [
                { value: '70%', numericValue: 70, suffix: '%', label: '開発時間短縮', description: '非機能要件の実装時間を削減' },
                { value: '11', numericValue: 11, label: '統合モジュール', description: '認証からホスティングまで' },
                { value: '99.9%', numericValue: 99.9, suffix: '%', label: 'SLA保証', description: 'Corporate Plan以上' },
                { value: '3,000+', numericValue: 3000, suffix: '+', label: '導入企業数', description: 'スタートアップからエンタープライズまで' },
              ]
            : [
                { value: '70%', numericValue: 70, suffix: '%', label: 'Dev time saved', description: 'Reduction in non-functional implementation' },
                { value: '11', numericValue: 11, label: 'Integrated modules', description: 'From auth to hosting' },
                { value: '99.9%', numericValue: 99.9, suffix: '%', label: 'SLA guaranteed', description: 'Corporate Plan and above' },
                { value: '3,000+', numericValue: 3000, suffix: '+', label: 'Companies', description: 'From startups to enterprises' },
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
      <StatsSection
        title={isJa ? '数字で見るPolastack' : 'Polastack in numbers'}
        stats={
          isJa
            ? [
                { value: '100万+', label: '対応レコード数' },
                { value: '<50ms', label: '検索レスポンス' },
                { value: '0行', label: '認証コード記述量' },
              ]
            : [
                { value: '1M+', label: 'Records supported' },
                { value: '<50ms', label: 'Search response' },
                { value: '0 lines', label: 'Auth code needed' },
              ]
        }
        background="dark"
      />
    );
  },
};
