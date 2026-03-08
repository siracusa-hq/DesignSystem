import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../components/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Enter description...', 'aria-label': 'Description' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Textarea size="sm" placeholder="Small" aria-label="Small" />
      <Textarea size="md" placeholder="Medium" aria-label="Medium" />
      <Textarea size="lg" placeholder="Large" aria-label="Large" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <Textarea aria-invalid="true" aria-label="Error" defaultValue="Invalid input" className="w-80" />
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Read only content', 'aria-label': 'Disabled' },
};
