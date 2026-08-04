import type { Meta, StoryObj } from '@storybook/react';
import { Eyebrow } from '../../components/primitives/eyebrow';

const meta = {
  title: 'Primitives/Eyebrow',
  component: Eyebrow,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 日本語: Story = { args: { children: '導入事例' } };
export const English: Story = { args: { children: 'CASE STUDIES' } };

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
