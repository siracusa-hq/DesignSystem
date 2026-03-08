import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://api.dicebear.com/7.x/initials/svg?seed=AB"
        alt="User avatar"
      />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const BrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.test/img.jpg" alt="Broken" />
      <AvatarFallback>FB</AvatarFallback>
    </Avatar>
  ),
};
