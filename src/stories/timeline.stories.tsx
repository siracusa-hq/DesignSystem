import type { Meta, StoryObj } from '@storybook/react';
import {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
} from '../components/timeline';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  GitCommit,
  MessageSquare,
} from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Timeline>;

export const ActivityLog: Story = {
  render: () => (
    <Timeline className="max-w-md">
      <TimelineItem>
        <TimelineIcon variant="success">
          <CheckCircle2 />
        </TimelineIcon>
        <TimelineConnector />
        <TimelineContent>
          <p className="font-medium">Project created</p>
          <p className="text-[var(--color-on-surface-muted)]">
            A new project &quot;Design System&quot; was created.
          </p>
          <TimelineTime>2 hours ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIcon variant="info">
          <MessageSquare />
        </TimelineIcon>
        <TimelineConnector />
        <TimelineContent>
          <p className="font-medium">New comment</p>
          <p className="text-[var(--color-on-surface-muted)]">
            Alice left a comment: &quot;Looks great, let&apos;s ship it!&quot;
          </p>
          <TimelineTime>1 hour ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIcon variant="warning">
          <AlertCircle />
        </TimelineIcon>
        <TimelineConnector />
        <TimelineContent>
          <p className="font-medium">Status changed</p>
          <p className="text-[var(--color-on-surface-muted)]">
            Status updated from &quot;In Review&quot; to &quot;Changes Requested&quot;.
          </p>
          <TimelineTime>45 minutes ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIcon variant="default">
          <GitCommit />
        </TimelineIcon>
        <TimelineConnector />
        <TimelineContent>
          <p className="font-medium">Commit pushed</p>
          <p className="text-[var(--color-on-surface-muted)]">
            Bob pushed commit <code className="text-xs">a3f8d2e</code> to main.
          </p>
          <TimelineTime>30 minutes ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIcon variant="error">
          <Clock />
        </TimelineIcon>
        <TimelineContent>
          <p className="font-medium">Issue resolved</p>
          <p className="text-[var(--color-on-surface-muted)]">
            Bug #142 was marked as resolved.
          </p>
          <TimelineTime>5 minutes ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const Simple: Story = {
  render: () => (
    <Timeline className="max-w-md">
      <TimelineItem>
        <TimelineIcon />
        <TimelineConnector />
        <TimelineContent>
          <p className="font-medium">Order placed</p>
          <TimelineTime>Jan 1, 2025</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIcon />
        <TimelineConnector />
        <TimelineContent>
          <p className="font-medium">Payment confirmed</p>
          <TimelineTime>Jan 2, 2025</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIcon />
        <TimelineContent>
          <p className="font-medium">Shipped</p>
          <TimelineTime>Jan 3, 2025</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};
