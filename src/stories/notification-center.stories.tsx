import type { Meta, StoryObj } from '@storybook/react';
import {
  NotificationCenter,
  NotificationItem,
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

export const WithNotifications: Story = {
  render: () => (
    <NotificationCenter>
      <NotificationItem
        icon={<AtSign className="h-4 w-4" />}
        title="Mentioned you in a comment"
        description="Haruka mentioned you in Design Review #42"
        timestamp="5 minutes ago"
        unread
      />
      <NotificationItem
        icon={<GitPullRequest className="h-4 w-4" />}
        title="Pull request merged"
        description="feat/toggle-group was merged into main"
        timestamp="1 hour ago"
        unread
      />
      <NotificationItem
        icon={<UserPlus className="h-4 w-4" />}
        title="New team member"
        description="Kenji Yamamoto joined the Design team"
        timestamp="3 hours ago"
      />
      <NotificationItem
        icon={<AlertCircle className="h-4 w-4" />}
        title="Build failed"
        description="CI pipeline failed on commit a3f8c21"
        timestamp="Yesterday"
      />
    </NotificationCenter>
  ),
};

export const Empty: Story = {
  render: () => <NotificationCenter />,
};

export const ManyNotifications: Story = {
  render: () => (
    <NotificationCenter>
      <NotificationItem
        icon={<AtSign className="h-4 w-4" />}
        title="Mentioned in Design Review"
        description="Haruka tagged you in a comment on the color tokens discussion"
        timestamp="2 minutes ago"
        unread
      />
      <NotificationItem
        icon={<GitPullRequest className="h-4 w-4" />}
        title="PR review requested"
        description="Kenji requested your review on feat/slider component"
        timestamp="15 minutes ago"
        unread
      />
      <NotificationItem
        icon={<AlertCircle className="h-4 w-4" />}
        title="Deployment warning"
        description="Preview deployment is using 92% of memory limit"
        timestamp="30 minutes ago"
        unread
      />
      <NotificationItem
        icon={<UserPlus className="h-4 w-4" />}
        title="New collaborator"
        description="Yuki Sato was added to the Polastack project"
        timestamp="1 hour ago"
      />
      <NotificationItem
        icon={<GitPullRequest className="h-4 w-4" />}
        title="Pull request merged"
        description="fix/badge-contrast was merged into main"
        timestamp="2 hours ago"
      />
      <NotificationItem
        icon={<AtSign className="h-4 w-4" />}
        title="Comment reply"
        description="Haruka replied to your comment on the accordion spec"
        timestamp="4 hours ago"
      />
      <NotificationItem
        icon={<AlertCircle className="h-4 w-4" />}
        title="Build failed"
        description="CI pipeline failed for commit d7e2f91 on main"
        timestamp="Yesterday"
      />
      <NotificationItem
        icon={<UserPlus className="h-4 w-4" />}
        title="Team invitation accepted"
        description="Rina Nakamura accepted the invitation to join Engineering"
        timestamp="2 days ago"
      />
    </NotificationCenter>
  ),
};
