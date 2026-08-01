import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../components/switch';
import { Label } from '../components/label';

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications" className="font-normal">
        Enable notifications
      </Label>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <Switch size={size} id={`switch-${size}`} />
          <Label htmlFor={`switch-${size}`} className="font-normal capitalize">
            {size}
          </Label>
        </div>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <Switch checked={checked} onCheckedChange={setChecked} id="ctrl" />
        <Label htmlFor="ctrl" className="font-normal">
          {checked ? 'On' : 'Off'}
        </Label>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch disabled />
        <Label className="font-normal">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled checked />
        <Label className="font-normal">Disabled on</Label>
      </div>
    </div>
  ),
};
