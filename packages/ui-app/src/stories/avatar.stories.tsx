import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from '../components/avatar';
import { AvatarGroup } from '../components/avatar-group';

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
    shape: {
      control: 'select',
      options: ['circle', 'square'],
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
        <AvatarFallback colorSeed="small">S</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback colorSeed="medium">MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback colorSeed="large">LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const ColorfulFallbacks: Story = {
  name: 'Colorful Fallbacks',
  render: () => (
    <div className="flex items-center gap-3">
      {['alice@co.jp', 'bob@co.jp', 'carol@co.jp', 'dave@co.jp', 'eve@co.jp', 'frank@co.jp', 'grace@co.jp', 'heidi@co.jp'].map((email) => (
        <Avatar key={email}>
          <AvatarFallback colorSeed={email}>
            {email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="circle">
          <AvatarFallback colorSeed="user">TK</AvatarFallback>
        </Avatar>
        <span className="text-xs text-[var(--color-on-surface-muted)]">User</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square">
          <AvatarFallback colorSeed="team">PS</AvatarFallback>
        </Avatar>
        <span className="text-xs text-[var(--color-on-surface-muted)]">Team</span>
      </div>
    </div>
  ),
};

export const StatusIndicators: Story = {
  name: 'Status Indicators',
  render: () => (
    <div className="flex items-center gap-4">
      {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarFallback colorSeed={status}>
              {status[0].toUpperCase()}
            </AvatarFallback>
            <AvatarStatus status={status} />
          </Avatar>
          <span className="text-xs text-[var(--color-on-surface-muted)] capitalize">
            {status}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Group: Story = {
  name: 'Avatar Group',
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[var(--color-on-surface-muted)] mb-2">max=3, 5 members</p>
        <AvatarGroup max={3} size="md">
          <Avatar><AvatarFallback colorSeed="alice">A</AvatarFallback></Avatar>
          <Avatar><AvatarFallback colorSeed="bob">B</AvatarFallback></Avatar>
          <Avatar><AvatarFallback colorSeed="carol">C</AvatarFallback></Avatar>
          <Avatar><AvatarFallback colorSeed="dave">D</AvatarFallback></Avatar>
          <Avatar><AvatarFallback colorSeed="eve">E</AvatarFallback></Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-xs text-[var(--color-on-surface-muted)] mb-2">max=5, 3 members (no overflow)</p>
        <AvatarGroup max={5} size="sm">
          <Avatar size="sm"><AvatarFallback colorSeed="x">X</AvatarFallback></Avatar>
          <Avatar size="sm"><AvatarFallback colorSeed="y">Y</AvatarFallback></Avatar>
          <Avatar size="sm"><AvatarFallback colorSeed="z">Z</AvatarFallback></Avatar>
        </AvatarGroup>
      </div>
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
