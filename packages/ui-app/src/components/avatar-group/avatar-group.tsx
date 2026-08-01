import * as React from 'react';
import { cn } from '@/lib/cn';
import { Avatar, AvatarFallback } from '@/components/avatar';

const SPACING: Record<string, string> = {
  sm: '-space-x-2',
  md: '-space-x-3',
  lg: '-space-x-3',
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show before "+N" overflow. Default: 3 */
  max?: number;
  /** Size passed to overflow indicator. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 3, size = 'md', children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visible = items.slice(0, max);
    const overflow = items.length - max;

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'flex items-center',
          SPACING[size],
          className,
        )}
        {...props}
      >
        {visible.map((child, i) => (
          <span
            key={i}
            className="relative ring-2 ring-[var(--color-surface)] rounded-full"
            style={{ zIndex: visible.length - i }}
          >
            {child}
          </span>
        ))}
        {overflow > 0 && (
          <span
            className="relative ring-2 ring-[var(--color-surface)] rounded-full"
            style={{ zIndex: 0 }}
          >
            <Avatar size={size}>
              <AvatarFallback>+{overflow}</AvatarFallback>
            </Avatar>
          </span>
        )}
      </div>
    );
  },
);
AvatarGroup.displayName = 'AvatarGroup';
