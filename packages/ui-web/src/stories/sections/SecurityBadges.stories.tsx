import type { Meta, StoryObj } from '@storybook/react';
import { SecurityBadges } from '../../components/sections/security-badges';
import { ShieldCheck, Lock, FileCheck, Award } from 'lucide-react';

const meta: Meta<typeof SecurityBadges> = {
  title: 'Sections/SecurityBadges',
  component: SecurityBadges,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof SecurityBadges>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <SecurityBadges
        eyebrow={isJa ? 'セキュリティ' : 'SECURITY'}
        title={isJa ? 'エンタープライズグレードのセキュリティ' : 'Enterprise-grade security'}
        subtitle={
          isJa
            ? '国際基準の認証を取得し、お客様のデータを安全に保護します。'
            : 'Certified to international standards, keeping your data safe.'
        }
        badges={
          isJa
            ? [
                { name: 'ISMS (ISO 27001)', icon: <ShieldCheck className="h-7 w-7 text-primary-500" />, description: '情報セキュリティ管理' },
                { name: 'SOC 2 Type II', icon: <Lock className="h-7 w-7 text-primary-500" />, description: 'セキュリティ監査' },
                { name: 'プライバシーマーク', icon: <FileCheck className="h-7 w-7 text-primary-500" />, description: '個人情報保護' },
                { name: 'ISMAP', icon: <Award className="h-7 w-7 text-primary-500" />, description: '政府クラウド認定' },
              ]
            : [
                { name: 'ISMS (ISO 27001)', icon: <ShieldCheck className="h-7 w-7 text-primary-500" />, description: 'InfoSec management' },
                { name: 'SOC 2 Type II', icon: <Lock className="h-7 w-7 text-primary-500" />, description: 'Security audit' },
                { name: 'GDPR', icon: <FileCheck className="h-7 w-7 text-primary-500" />, description: 'Data protection' },
                { name: 'HIPAA', icon: <Award className="h-7 w-7 text-primary-500" />, description: 'Healthcare compliance' },
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
      <SecurityBadges
        title={isJa ? 'セキュリティ認証' : 'Security Certifications'}
        background="dark"
        badges={[
          { name: 'ISMS (ISO 27001)' },
          { name: 'SOC 2 Type II' },
          { name: isJa ? 'プライバシーマーク' : 'GDPR' },
          { name: 'ISMAP' },
        ]}
      />
    );
  },
};
