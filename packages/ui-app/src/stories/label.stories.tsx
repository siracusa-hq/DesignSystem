import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../components/label';

const meta: Meta<typeof Label> = {
  title: 'Form/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: 'Email address' },
};

export const Required: Story = {
  args: { children: 'Email address', required: true },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-1.5">
      <Label htmlFor="email" required>
        Email
      </Label>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
      />
    </div>
  ),
};
