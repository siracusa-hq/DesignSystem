import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Bell, BellOff, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/button';

/* ---------------------------------------------------------------
   Types
   --------------------------------------------------------------- */

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  timestamp: string;
  read: boolean;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  unreadCount?: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  emptyMessage?: string;
  className?: string;
}

/* ---------------------------------------------------------------
   NotificationCenter
   --------------------------------------------------------------- */

export const NotificationCenter = React.forwardRef<
  HTMLButtonElement,
  NotificationCenterProps
>(
  (
    {
      notifications,
      unreadCount,
      onMarkAsRead,
      onMarkAllAsRead,
      onNotificationClick,
      emptyMessage = 'No notifications',
      className,
    },
    ref,
  ) => {
    const count = unreadCount ?? notifications.filter((n) => !n.read).length;

    return (
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger
          ref={ref}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'relative size-9 p-0',
            className,
          )}
          aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
        >
          <Bell className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-medium text-white">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={cn(
              'z-popover w-[380px] max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-lg',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            )}
            sideOffset={8}
            align="end"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">
                Notifications
              </h3>
              {count > 0 && onMarkAllAsRead && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 touch:min-h-[--touch-target-min] touch:px-2"
                >
                  <Check className="size-3" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--color-on-surface-muted)]">
                  <BellOff className="mb-2 size-8" />
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      onNotificationClick?.(notification);
                      if (!notification.read) onMarkAsRead?.(notification.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onNotificationClick?.(notification);
                        if (!notification.read) onMarkAsRead?.(notification.id);
                      }
                    }}
                    className={cn(
                      'flex cursor-pointer gap-3 px-4 py-3 text-sm transition-colors touch:min-h-[--touch-target-min]',
                      'hover:bg-[var(--color-surface-muted)]',
                      !notification.read && 'bg-primary-50/50 dark:bg-primary-950/20',
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-sunken)]">
                      {notification.icon ?? (
                        <Bell className="size-4 text-[var(--color-on-surface-muted)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate',
                          !notification.read
                            ? 'font-medium text-[var(--color-on-surface)]'
                            : 'text-[var(--color-on-surface-muted)]',
                        )}
                      >
                        {notification.title}
                      </p>
                      {notification.description && (
                        <p className="mt-0.5 line-clamp-2 text-[var(--color-on-surface-muted)]">
                          {notification.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-2 size-2 shrink-0 rounded-full bg-primary-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
NotificationCenter.displayName = 'NotificationCenter';
