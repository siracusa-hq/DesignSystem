import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker, type DateRange } from '../components/date-picker';
import { Label } from '../components/label';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Form/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: () => (
    <div className="space-y-1.5 w-72">
      <Label htmlFor="range">期間</Label>
      <DateRangePicker id="range" />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="space-y-1.5 w-72">
      <Label htmlFor="range-val">期間</Label>
      <DateRangePicker
        id="range-val"
        defaultValue={{ from: '2024-06-10', to: '2024-06-20' }}
      />
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <div className="space-y-1.5 w-72">
      <Label htmlFor="range-minmax">期間 (2024年内)</Label>
      <DateRangePicker
        id="range-minmax"
        defaultValue={{ from: '2024-06-01', to: '2024-06-30' }}
        min="2024-01-01"
        max="2024-12-31"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <DateRangePicker
        size="sm"
        aria-label="Small"
        defaultValue={{ from: '2024-06-10', to: '2024-06-20' }}
      />
      <DateRangePicker
        size="md"
        aria-label="Medium"
        defaultValue={{ from: '2024-06-10', to: '2024-06-20' }}
      />
      <DateRangePicker
        size="lg"
        aria-label="Large"
        defaultValue={{ from: '2024-06-10', to: '2024-06-20' }}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-1.5 w-72">
      <Label htmlFor="range-disabled">期間</Label>
      <DateRangePicker
        id="range-disabled"
        value={{ from: '2024-06-10', to: '2024-06-20' }}
        disabled
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = React.useState<DateRange>({
      from: '2024-06-10',
      to: '2024-06-20',
    });
    return (
      <div className="space-y-3 w-72">
        <div className="space-y-1.5">
          <Label htmlFor="ctrl-range">期間</Label>
          <DateRangePicker
            id="ctrl-range"
            value={value}
            onValueChange={setValue}
          />
        </div>
        <p className="text-sm text-[var(--color-on-surface-muted)]">
          開始: {value.from || '(未選択)'} / 終了: {value.to || '(未選択)'}
        </p>
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => (
    <div className="space-y-1.5 w-72">
      <Label htmlFor="custom-range">滞在期間</Label>
      <DateRangePicker
        id="custom-range"
        placeholder="チェックイン - チェックアウト"
      />
    </div>
  ),
};
