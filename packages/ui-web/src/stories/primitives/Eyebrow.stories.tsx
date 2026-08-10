import type { Meta, StoryObj } from '@storybook/react';
import { Eyebrow } from '../../components/primitives/eyebrow';

/**
 * Eyebrow は **opt-in** の小ラベル。区切りの既定は SectionHeader の飾り線で、
 * eyebrow を置くのは「見出しから内容が読み取れない」ときだけ・日本語で
 * （実測: ピル型 0/41・一律採用 3/13。docs/research/research-eyebrow.md 案B）。
 */
const meta = {
  title: 'Primitives/Eyebrow',
  component: Eyebrow,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 日本語: Story = { args: { children: '導入事例' } };
export const English: Story = { args: { children: 'Case Studies' } };

export const ブランド追従: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <span>
        <Eyebrow>コーポレート</Eyebrow>
      </span>
      <span data-brand="polastack">
        <Eyebrow>Polastack</Eyebrow>
      </span>
      <span data-brand="peerdesk">
        <Eyebrow>ピアデスク</Eyebrow>
      </span>
      <span data-brand="peerdesk-taxpeer">
        <Eyebrow>タックスピア</Eyebrow>
      </span>
    </div>
  ),
};
