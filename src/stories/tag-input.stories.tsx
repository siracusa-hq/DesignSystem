import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TagInput, type TagInputOption } from '../components/tag-input';

const frameworks: TagInputOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

const meta: Meta<typeof TagInput> = {
  title: 'Components/TagInput',
  component: TagInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <TagInput
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select frameworks..."
      />
    );
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [value, setValue] = React.useState(['react', 'next']);
    return (
      <TagInput
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select frameworks..."
      />
    );
  },
};

export const Creatable: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <TagInput
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Type to create..."
        creatable
      />
    );
  },
};

export const WithMaxTags: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(['react']);
    return (
      <TagInput
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Max 3 tags..."
        maxTags={3}
      />
    );
  },
};

export const WithOverflow: Story = {
  render: () => {
    const [value, setValue] = React.useState([
      'react', 'vue', 'angular', 'svelte', 'next',
    ]);
    return (
      <TagInput
        options={frameworks}
        value={value}
        onValueChange={setValue}
        maxDisplayedTags={2}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <TagInput
      options={frameworks}
      value={['react', 'vue']}
      disabled
    />
  ),
};
