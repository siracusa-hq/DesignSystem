import type { Meta, StoryObj } from '@storybook/react';
import { OfflineIndicator } from '../components/offline-indicator';

const meta: Meta<typeof OfflineIndicator> = {
  title: 'PWA/OfflineIndicator',
  component: OfflineIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof OfflineIndicator>;

export const Offline: Story = {
  args: { isOffline: true },
};

export const Online: Story = {
  args: { isOffline: false },
};

export const CustomMessage: Story = {
  args: {
    isOffline: true,
    message: 'No internet connection. Please check your network.',
  },
};
