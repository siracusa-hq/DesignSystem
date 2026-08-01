import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from '../../components/primitives/logo';

const meta: Meta<typeof Logo> = {
  title: 'Primitives/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-on-surface-muted)]">Full (primary)</p>
        <Logo variant="full" colorScheme="primary" height={40} />
      </div>
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-on-surface-muted)]">Mark only</p>
        <Logo variant="mark" height={48} />
      </div>
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-on-surface-muted)]">Type only</p>
        <Logo variant="type" height={32} />
      </div>
      <div className="space-y-2 rounded-lg bg-neutral-900 p-6">
        <p className="text-caption text-neutral-400">Full (reverse, on dark)</p>
        <Logo variant="full" colorScheme="reverse" height={40} />
      </div>
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-on-surface-muted)]">Full (mono)</p>
        <Logo variant="full" colorScheme="mono" height={40} />
      </div>
    </div>
  ),
};
