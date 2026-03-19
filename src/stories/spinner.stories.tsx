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
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-[var(--color-on-surface-secondary)]">sm (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-xs text-[var(--color-on-surface-secondary)]">md (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-[var(--color-on-surface-secondary)]">lg (32px)</span>
      </div>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="text-primary-500" />
      <Spinner className="text-error-500" />
      <Spinner className="text-info-500" />
      <Spinner className="text-warning-500" />
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>
        <Spinner size="sm" className="text-current" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Spinner size="sm" />
        Processing...
      </Button>
    </div>
  ),
};

export const OnSurface: Story = {
  name: 'On Different Surfaces',
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-[var(--color-surface)]">
        <Spinner />
      </div>
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-[var(--color-surface-raised)]">
        <Spinner />
      </div>
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-[var(--color-surface-sunken)]">
        <Spinner />
      </div>
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary-500">
        <Spinner className="text-white" />
      </div>
    </div>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <div className="flex flex-col gap-4 text-sm text-[var(--color-on-surface)]">
      <p className="flex items-center gap-2">
        <Spinner size="sm" /> Loading data...
      </p>
      <p className="flex items-center gap-2 text-[var(--color-on-surface-secondary)]">
        <Spinner size="sm" /> Syncing changes...
      </p>
    </div>
  ),
};
