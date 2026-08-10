import type { Meta, StoryObj } from '@storybook/react';
import { LogoMark } from '../../components/primitives/logo-mark';

const meta = {
  title: 'Primitives/LogoMark',
  component: LogoMark,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LogoMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 縦横比の違うロゴ（横長・正方形・縦長）が同じ高さ・彩度で揃うことの確認 */
const DemoLogo = ({ w, label }: { w: number; label: string }) => (
  <svg viewBox={`0 0 ${w} 32`} width={w} height={32} role="img" aria-label={label}>
    <rect width={w} height={32} rx="6" fill="var(--color-decor-brand)" />
    <text x={w / 2} y="21" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">
      {label}
    </text>
  </svg>
);

/** 縦横比の異なるロゴが同じ高さ・彩度に揃うこと（LogoCloud / 事例カードの前提） */
export const 高さの正規化: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <LogoMark>
        <DemoLogo w={120} label="よこなが" />
      </LogoMark>
      <LogoMark>
        <DemoLogo w={32} label="□" />
      </LogoMark>
      <LogoMark>
        <DemoLogo w={64} label="中間" />
      </LogoMark>
    </div>
  ),
};

export const グレースケール帯: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
      {['ACME', 'テック商事', 'North K.K.', '山田製作所'].map((name, i) => (
        <LogoMark key={name} grayscale>
          <DemoLogo w={80 + i * 16} label={name} />
        </LogoMark>
      ))}
    </div>
  ),
};
