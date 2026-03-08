import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../components/spinner';
import { Button } from '../components/button';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => <Spinner className="text-error-500" />,
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="text-white" />
      Loading...
    </Button>
  ),
};
