import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../components/checkbox';
import { Label } from '../components/label';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="font-normal">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checked" checked={checked} onCheckedChange={(v) => setChecked(v as boolean)} />
        <Label htmlFor="checked" className="font-normal">Checked</Label>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox disabled />
        <Label className="font-normal">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled checked />
        <Label className="font-normal">Disabled checked</Label>
      </div>
    </div>
  ),
};
