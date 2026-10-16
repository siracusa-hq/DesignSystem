import type { Meta, StoryObj } from '@storybook/react';
import { InfoTip } from '../components/info-tip';
import { Input } from '../components/input';
import { Label } from '../components/label';

const meta: Meta<typeof InfoTip> = {
  title: 'Components/InfoTip',
  component: InfoTip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    label: '締め日について',
    content: '締め日を過ぎた請求は翌月扱いになります',
  },
  argTypes: {
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
};
export default meta;
type Story = StoryObj<typeof InfoTip>;

export const Default: Story = {};

export const WithFormLabel: Story = {
  render: (args) => (
    <div className="grid w-72 gap-1.5">
      <div className="flex items-center gap-1">
        <Label htmlFor="closing-day">締め日</Label>
        <InfoTip {...args} size="sm" />
      </div>
      <Input id="closing-day" placeholder="毎月末日" />
    </div>
  ),
};

export const InlineText: Story = {
  render: (args) => (
    <p className="text-sm text-[var(--color-on-surface)]">
      今月の稼働率 <span className="font-semibold">87%</span>{' '}
      <InfoTip
        {...args}
        label="稼働率の算出方法"
        content="稼働時間 ÷ 所定労働時間。有給休暇は所定労働時間から除外しています"
        size="sm"
      />
    </p>
  ),
};

export const LongContent: Story = {
  args: {
    label: '源泉徴収について',
    content:
      '個人の取引先への報酬は、支払額が100万円以下の部分に10.21%、100万円を超える部分に20.42%の源泉徴収が必要です。法人の取引先には適用されません。',
  },
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex items-center gap-12 p-12">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <div key={side} className="flex items-center gap-1 text-sm">
          {side}
          <InfoTip {...args} side={side} label={`${side} の説明`} content={`side="${side}"`} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6 text-sm">
      <span className="flex items-center gap-1">
        sm <InfoTip {...args} size="sm" />
      </span>
      <span className="flex items-center gap-1">
        md <InfoTip {...args} size="md" />
      </span>
    </div>
  ),
};
