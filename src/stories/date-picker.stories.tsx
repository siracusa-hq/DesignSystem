import * as React from 'react';
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
      <Label htmlFor="date">日付</Label>
      <DatePicker id="date" />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="space-y-1.5 w-60">
      <Label htmlFor="date-val">日付</Label>
      <DatePicker id="date-val" defaultValue="2024-06-15" />
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <div className="space-y-1.5 w-60">
      <Label htmlFor="range">日付 (2024年内)</Label>
      <DatePicker
        id="range"
        defaultValue="2024-06-15"
        min="2024-01-01"
        max="2024-12-31"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-60">
      <DatePicker size="sm" aria-label="Small" defaultValue="2024-06-15" />
      <DatePicker size="md" aria-label="Medium" defaultValue="2024-06-15" />
      <DatePicker size="lg" aria-label="Large" defaultValue="2024-06-15" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-1.5 w-60">
      <Label htmlFor="disabled-date">日付</Label>
      <DatePicker id="disabled-date" value="2024-06-15" disabled />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = React.useState('2024-06-15');
    return (
      <div className="space-y-3 w-60">
        <div className="space-y-1.5">
          <Label htmlFor="ctrl-date">日付</Label>
          <DatePicker
            id="ctrl-date"
            value={value}
            onValueChange={setValue}
          />
        </div>
        <p className="text-sm text-[var(--color-on-surface-muted)]">
          選択中: {value || '(なし)'}
        </p>
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => (
    <div className="space-y-1.5 w-60">
      <Label htmlFor="custom">開始日</Label>
      <DatePicker id="custom" placeholder="開始日を選択してください" />
    </div>
  ),
};
