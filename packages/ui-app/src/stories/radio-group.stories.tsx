import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '../components/radio-group';
import { Label } from '../components/label';

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="md" aria-label="Size">
      {['sm', 'md', 'lg'].map((size) => (
        <div key={size} className="flex items-center gap-2">
          <RadioGroupItem value={size} id={`size-${size}`} />
          <Label htmlFor={`size-${size}`} className="font-normal capitalize">
            {size}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="apple" aria-label="Fruit" className="flex-row gap-4">
      {['apple', 'banana', 'cherry'].map((fruit) => (
        <div key={fruit} className="flex items-center gap-2">
          <RadioGroupItem value={fruit} id={`fruit-${fruit}`} />
          <Label htmlFor={`fruit-${fruit}`} className="font-normal capitalize">
            {fruit}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a" disabled aria-label="Options">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="da" />
        <Label htmlFor="da" className="font-normal">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="db" />
        <Label htmlFor="db" className="font-normal">Option B</Label>
      </div>
    </RadioGroup>
  ),
};
