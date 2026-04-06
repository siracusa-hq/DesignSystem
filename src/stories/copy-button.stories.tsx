import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from '../components/copy-button';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: 'https://polastack.dev/docs/getting-started',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-md border border-[var(--color-outline)] px-3 py-2">
      <span className="text-sm text-[var(--color-on-surface)]">
        https://polastack.dev/docs/getting-started
      </span>
      <CopyButton value="https://polastack.dev/docs/getting-started" />
    </div>
  ),
};

export const InCode: Story = {
  render: () => (
    <div className="flex items-center justify-between gap-4 rounded-md bg-[var(--color-surface-variant)] px-4 py-3">
      <code className="font-mono text-sm text-[var(--color-on-surface)]">
        pnpm add @polastack/design-system
      </code>
      <CopyButton value="pnpm add @polastack/design-system" />
    </div>
  ),
};
