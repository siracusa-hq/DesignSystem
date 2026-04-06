import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EditableCell } from '../components/editable-cell';

const meta: Meta<typeof EditableCell> = {
  title: 'Components/EditableCell',
  component: EditableCell,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof EditableCell>;

export const Default: Story = {
  args: {
    value: 'Click to edit',
    type: 'text',
  },
};

export const Number: Story = {
  args: {
    value: '42',
    type: 'number',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Read only',
    disabled: true,
  },
};

export const WithCallback: Story = {
  render: () => {
    const [value, setValue] = React.useState('Editable value');
    return (
      <div className="space-y-2">
        <EditableCell value={value} onValueChange={setValue} />
        <p className="text-xs text-[var(--color-on-surface-muted)]">
          Current value: {value}
        </p>
      </div>
    );
  },
};
