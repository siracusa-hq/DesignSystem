import type { Meta, StoryObj } from '@storybook/react';
import { LogoCloud } from '../../components/sections/logo-cloud';

const meta: Meta<typeof LogoCloud> = {
  title: 'Sections/LogoCloud',
  component: LogoCloud,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof LogoCloud>;

/** ロゴ素材の代わり。実運用では src に画像 URL を渡す */
const PlaceholderLogo: React.FC<{ name: string }> = ({ name }) => (
  <svg width="128" height="32" viewBox="0 0 128 32" role="img" aria-label={name}>
    <rect width="128" height="32" rx="4" fill="var(--color-surface-sunken)" />
    <text
      x="64"
      y="20"
      textAnchor="middle"
      fontSize="11"
      fontWeight="500"
      fill="var(--color-on-surface-muted)"
    >
      {name}
    </text>
  </svg>
);

const names = [
  'Company A',
  'Company B',
  'Company C',
  'Company D',
  'Company E',
  'Company F',
  'Company G',
  'Company H',
  'Company I',
];

const toLogos = (count: number) =>
  names.slice(0, count).map((name) => ({ name, node: <PlaceholderLogo name={name} /> }));

/** 6件。静的な帯で並ぶ（6社未満なら StatsSection の数値バッジを使うこと） */
export const Static: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LogoCloud
        eyebrow={isJa ? '導入企業' : 'TRUSTED BY'}
        title={isJa ? '先進企業に選ばれています' : 'Trusted by leading companies'}
        logos={toLogos(6)}
      />
    );
  },
};

/** 9件。8件以上なので自動でスクロール表示になる（scrolling prop は削除済み） */
export const AutoScrolling: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LogoCloud
        title={isJa ? '導入企業' : 'Our customers'}
        logos={toLogos(9)}
      />
    );
  },
};
