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
      {/* 文字サイズ・ウェイトはラッパーが持つ（GradientText は className を受け取らない） */}
      <div className="text-display-xl font-extrabold">
        <GradientText as="h1" gradient="brand">
          Enterprise Agent Stack
        </GradientText>
      </div>
      <div className="text-display-md font-bold">
        <GradientText as="h2" gradient="neutral">
          Polastack
        </GradientText>
      </div>
    </div>
  ),
};
