import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '../components/combobox';
import { Label } from '../components/label';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
  { value: 'strawberry', label: 'Strawberry' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Form/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="space-y-1.5 w-60">
        <Label>Fruit</Label>
        <Combobox
          options={fruits}
          value={value}
          onValueChange={setValue}
          placeholder="Select a fruit..."
          aria-label="Fruit"
        />
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="space-y-1.5 w-60">
        <Label>Fruit</Label>
        <Combobox
          options={[
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana', disabled: true },
            { value: 'cherry', label: 'Cherry' },
          ]}
          value={value}
          onValueChange={setValue}
          aria-label="Fruit"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: fruits,
    disabled: true,
    placeholder: 'Disabled',
    'aria-label': 'Disabled',
  },
};
