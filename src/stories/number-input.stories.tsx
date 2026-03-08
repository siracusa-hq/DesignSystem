import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from '../components/number-input';
import { Label } from '../components/label';

const meta: Meta<typeof NumberInput> = {
  title: 'Form/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(0);
    return (
      <div className="w-40">
        <Label>Quantity</Label>
        <NumberInput value={value} onChange={setValue} aria-label="Quantity" />
      </div>
    );
  },
};

export const WithMinMax: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(5);
    return (
      <div className="w-40">
        <Label>Rating (1-10)</Label>
        <NumberInput value={value} onChange={setValue} min={1} max={10} aria-label="Rating" />
      </div>
    );
  },
};

export const WithPrecision: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(0.0);
    return (
      <div className="w-40">
        <Label>Price</Label>
        <NumberInput value={value} onChange={setValue} step={0.01} precision={2} aria-label="Price" />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { value: 42, disabled: true, 'aria-label': 'Disabled' },
};
