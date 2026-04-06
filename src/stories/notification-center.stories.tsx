import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NotificationCenter,
  type NotificationItem as NotificationItemType,
} from '../components/notification-center';
import { AtSign, GitPullRequest, AlertCircle, UserPlus } from 'lucide-react';

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/NotificationCenter',
  component: NotificationCenter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof NotificationCenter>;

const sampleNotifications: NotificationItemType[] = [
  {
    id: '1',
    title: 'Mentioned you in a comment',
    description: 'Haruka mentioned you in Design Review #42',
    icon: <AtSign className="size-4" />,
    timestamp: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'Pull request merged',
    description: 'feat/toggle-group was merged into main',
    icon: <GitPullRequest className="size-4" />,
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'New team member',
    description: 'Kenji Yamamoto joined the Design team',
    icon: <UserPlus className="size-4" />,
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    title: 'Build failed',
    description: 'CI pipeline failed on commit a3f8c21',
    icon: <AlertCircle className="size-4" />,
    timestamp: 'Yesterday',
    read: true,
  },
];

export const WithNotifications: Story = {
  render: () => (
    <NotificationCenter
      notifications={sampleNotifications}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
      onNotificationClick={(n) => console.log('Clicked:', n.title)}
    />
  ),
};

export const Empty: Story = {
  render: () => <NotificationCenter notifications={[]} />,
};

export const ManyNotifications: Story = {
  render: () => {
    const many: NotificationItemType[] = [
      ...sampleNotifications.map((n) => ({ ...n, read: false })),
      {
        id: '5',
        title: 'PR review requested',
        description: 'Kenji requested your review on feat/slider',
        icon: <GitPullRequest className="size-4" />,
        timestamp: '15 minutes ago',
        read: false,
      },
      {
        id: '6',
        title: 'Deployment warning',
        description: 'Preview deployment using 92% memory',
        icon: <AlertCircle className="size-4" />,
        timestamp: '30 minutes ago',
        read: true,
      },
      {
        id: '7',
        title: 'Comment reply',
        description: 'Haruka replied to your accordion spec comment',
        icon: <AtSign className="size-4" />,
        timestamp: '4 hours ago',
        read: true,
      },
      {
        id: '8',
        title: 'Invitation accepted',
        description: 'Rina Nakamura joined Engineering',
        icon: <UserPlus className="size-4" />,
        timestamp: '2 days ago',
        read: true,
      },
    ];
    return (
      <NotificationCenter
        notifications={many}
        onMarkAsRead={(id) => console.log('Mark as read:', id)}
        onMarkAllAsRead={() => console.log('Mark all as read')}
      />
    );
  },
};
