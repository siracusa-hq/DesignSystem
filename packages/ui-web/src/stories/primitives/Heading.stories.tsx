import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '../../components/primitives/heading';

const meta: Meta<typeof Heading> = {
  title: 'Primitives/Heading',
  component: Heading,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const AllSizes: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    const sizes = [
      'display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm',
      'heading-lg', 'heading-md', 'heading-sm',
    ] as const;

    return (
      <div className="space-y-6 p-8">
        {sizes.map((size) => (
          <div key={size}>
            <p className="mb-1 text-caption text-[var(--color-on-surface-muted)]">{size}</p>
            <Heading size={size} as="h2">
              {isJa
                ? 'Agent Coding時代の、消えない複雑性を解決する。'
                : 'Solve the irreducible complexity of the Agent Coding era.'}
            </Heading>
          </div>
        ))}
      </div>
    );
  },
};
