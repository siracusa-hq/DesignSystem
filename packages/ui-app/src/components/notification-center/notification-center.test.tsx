import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { NotificationCenter, type NotificationItem } from './notification-center';

const sampleNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New message',
    description: 'You have a new message from Alice',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'Update available',
    description: 'Version 2.0 is ready',
    timestamp: '1 hour ago',
    read: true,
  },
];

function renderCenter(opts?: {
  notifications?: NotificationItem[];
  onNotificationClick?: (n: NotificationItem) => void;
  onMarkAllAsRead?: () => void;
}) {
  return render(
    <NotificationCenter
      notifications={opts?.notifications ?? sampleNotifications}
      onNotificationClick={opts?.onNotificationClick}
      onMarkAllAsRead={opts?.onMarkAllAsRead}
    />,
  );
}

describe('NotificationCenter', () => {
  it('renders bell button', () => {
    renderCenter();
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
  });

  it('shows unread badge', () => {
    renderCenter();
    // 1 unread notification => badge with "1"
    const button = screen.getByRole('button', { name: /1 unread/i });
    expect(button).toBeInTheDocument();
  });

  it('opens on click showing notifications', async () => {
    const user = userEvent.setup();
    renderCenter();

    await user.click(screen.getByRole('button', { name: /notifications/i }));
    expect(await screen.findByText('New message')).toBeInTheDocument();
    expect(screen.getByText('Update available')).toBeInTheDocument();
  });

  it('shows empty state when no notifications', async () => {
    const user = userEvent.setup();
    renderCenter({ notifications: [] });

    await user.click(screen.getByRole('button', { name: /notifications/i }));
    expect(await screen.findByText('No notifications')).toBeInTheDocument();
  });

  it('calls onNotificationClick when notification is clicked', async () => {
    const user = userEvent.setup();
    const onNotificationClick = vi.fn();
    renderCenter({ onNotificationClick });

    await user.click(screen.getByRole('button', { name: /notifications/i }));
    await screen.findByText('New message');
    await user.click(screen.getByText('New message'));
    expect(onNotificationClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', title: 'New message' }),
    );
  });

  it('calls onMarkAllAsRead', async () => {
    const user = userEvent.setup();
    const onMarkAllAsRead = vi.fn();
    renderCenter({ onMarkAllAsRead });

    await user.click(screen.getByRole('button', { name: /notifications/i }));
    await screen.findByText('Mark all as read');
    await user.click(screen.getByText('Mark all as read'));
    expect(onMarkAllAsRead).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderCenter();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
