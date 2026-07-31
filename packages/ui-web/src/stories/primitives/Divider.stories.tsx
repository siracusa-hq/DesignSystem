import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '../../components/primitives/divider';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-2 p-8">
      {(['solid', 'gradient', 'brand', 'dashed'] as const).map((v) => (
        <div key={v}>
          <p className="mb-2 text-caption text-[var(--color-on-surface-muted)]">variant=&quot;{v}&quot;</p>
          <Divider variant={v} spacing="sm" />
        </div>
      ))}
    </div>
  ),
};
