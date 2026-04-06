import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../components/slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-80">
      <Slider
        defaultValue={[25, 75]}
        max={100}
        step={1}
        aria-label="Price range"
      />
    </div>
  ),
};

export const WithSteps: Story = {
  render: () => (
    <div className="w-80">
      <Slider
        defaultValue={[50]}
        max={100}
        step={10}
        aria-label="Brightness"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Slider
        defaultValue={[40]}
        max={100}
        step={1}
        disabled
        aria-label="Disabled slider"
      />
    </div>
  ),
};
