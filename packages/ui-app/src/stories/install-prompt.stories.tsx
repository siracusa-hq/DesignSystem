import type { Meta, StoryObj } from '@storybook/react';
import { InstallPrompt } from '../components/install-prompt';

const meta: Meta<typeof InstallPrompt> = {
  title: 'PWA/InstallPrompt',
  component: InstallPrompt,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof InstallPrompt>;

export const Default: Story = {
  args: {
    canInstall: true,
    onInstall: () => alert('Install clicked'),
    onDismiss: () => alert('Dismiss clicked'),
  },
};

export const CustomLabels: Story = {
  args: {
    canInstall: true,
    onInstall: () => {},
    onDismiss: () => {},
    title: 'Install Our App',
    description: 'Get a better experience by installing the app.',
    installLabel: 'Install Now',
    dismissLabel: 'Maybe Later',
  },
};
