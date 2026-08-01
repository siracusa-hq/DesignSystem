import type { Meta, StoryObj } from '@storybook/react';
import { GradientText } from '../../components/primitives/gradient-text';

const meta: Meta<typeof GradientText> = {
  title: 'Primitives/GradientText',
  component: GradientText,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof GradientText>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4 text-center">
      <GradientText as="h1" className="text-display-xl font-extrabold" gradient="brand">
        Enterprise Agent Stack
      </GradientText>
      <GradientText as="h2" className="text-display-md font-bold" gradient="neutral">
        Polastack
      </GradientText>
    </div>
  ),
};
