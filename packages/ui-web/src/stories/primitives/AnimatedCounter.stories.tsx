import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedCounter } from '../../components/primitives/animated-counter';

const meta: Meta<typeof AnimatedCounter> = {
  title: 'Primitives/AnimatedCounter',
  component: AnimatedCounter,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {
  render: () => (
    <div className="flex gap-12 text-center">
      <div>
        <AnimatedCounter
          value={43}
          className="text-display-lg font-bold text-primary-500"
        />
        <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">Components</p>
      </div>
      <div>
        <AnimatedCounter
          value={99.9}
          decimals={1}
          suffix="%"
          className="text-display-lg font-bold text-primary-500"
        />
        <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">Uptime</p>
      </div>
      <div>
        <AnimatedCounter
          value={10000}
          prefix="¥"
          className="text-display-lg font-bold text-primary-500"
        />
        <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">MRR</p>
      </div>
    </div>
  ),
};
