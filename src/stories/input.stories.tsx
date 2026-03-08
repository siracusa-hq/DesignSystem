import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/input';
import { Label } from '../components/label';

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Enter text...', 'aria-label': 'Text' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="md" placeholder="Medium (default)" aria-label="Medium" />
      <Input size="lg" placeholder="Large" aria-label="Large" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Input type="email" placeholder="email@example.com" aria-label="Email" />
      <Input type="password" placeholder="Password" aria-label="Password" />
      <Input type="url" placeholder="https://..." aria-label="URL" />
      <Input type="tel" placeholder="+81-xxx" aria-label="Phone" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-1.5 w-80">
      <Label htmlFor="err">Email</Label>
      <Input id="err" aria-invalid="true" defaultValue="invalid" />
      <p className="text-xs text-error-600">Please enter a valid email</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit', 'aria-label': 'Disabled' },
};

export const File: Story = {
  args: { type: 'file', 'aria-label': 'Upload' },
};
