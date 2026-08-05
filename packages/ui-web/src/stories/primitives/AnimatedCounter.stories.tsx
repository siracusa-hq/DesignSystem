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
        <div className="text-display-lg font-bold text-primary-500">
          <AnimatedCounter value={43} />
        </div>
        <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">Components</p>
      </div>
      <div>
        <div className="text-display-lg font-bold text-primary-500">
          <AnimatedCounter value={99.9} decimals={1} suffix="%" />
        </div>
        <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">Uptime</p>
      </div>
      <div>
        <div className="text-display-lg font-bold text-primary-500">
          <AnimatedCounter value={10000} prefix="¥" />
        </div>
        <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">MRR</p>
      </div>
    </div>
  ),
};
