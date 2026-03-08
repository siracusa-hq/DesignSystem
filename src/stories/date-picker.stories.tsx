import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '../components/date-picker';
import { Label } from '../components/label';

const meta: Meta<typeof DatePicker> = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => (
    <div className="space-y-1.5 w-60">
      <Label htmlFor="date">Date</Label>
      <DatePicker id="date" />
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <div className="space-y-1.5 w-60">
      <Label htmlFor="range">Date (2024)</Label>
      <DatePicker id="range" min="2024-01-01" max="2024-12-31" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-60">
      <DatePicker size="sm" aria-label="Small" />
      <DatePicker size="md" aria-label="Medium" />
      <DatePicker size="lg" aria-label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: '2024-06-15', 'aria-label': 'Disabled' },
};
