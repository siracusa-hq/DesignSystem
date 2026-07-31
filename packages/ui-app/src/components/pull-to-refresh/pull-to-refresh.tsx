'use client';

import * as React from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/spinner';

export interface PullToRefreshProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({ className, onRefresh, threshold = 80, disabled = false, children, ...props }, ref) => {
    const [pullDistance, setPullDistance] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const startYRef = React.useRef(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const handleTouchStart = React.useCallback(
      (e: React.TouchEvent) => {
        if (disabled || isRefreshing) return;
        const container = containerRef.current;
        if (container && container.scrollTop === 0) {
          startYRef.current = e.touches[0].clientY;
        }
      },
      [disabled, isRefreshing],
    );

    const handleTouchMove = React.useCallback(
      (e: React.TouchEvent) => {
        if (disabled || isRefreshing || startYRef.current === 0) return;
        const distance = Math.max(
          0,
          (e.touches[0].clientY - startYRef.current) * 0.5,
        );
        if (distance > 0) {
          setPullDistance(Math.min(distance, threshold * 1.5));
        }
      },
      [disabled, isRefreshing, threshold],
    );

    const handleTouchEnd = React.useCallback(async () => {
      if (disabled || isRefreshing) return;

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      setPullDistance(0);
      startYRef.current = 0;
    }, [disabled, isRefreshing, pullDistance, threshold, onRefresh]);

    const indicatorOpacity = Math.min(pullDistance / threshold, 1);
    const shouldTrigger = pullDistance >= threshold;

    return (
      <div
        ref={containerRef}
        className={cn('relative overflow-auto', className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        <div
          className="flex items-center justify-center overflow-hidden transition-[height] duration-normal"
          style={{ height: isRefreshing ? threshold * 0.6 : pullDistance }}
          aria-hidden="true"
        >
          <div
            className="transition-opacity"
            style={{ opacity: isRefreshing ? 1 : indicatorOpacity }}
          >
            {isRefreshing ? (
              <Spinner size="sm" />
            ) : (
              <ArrowDown
                className={cn(
                  'h-5 w-5 text-[var(--color-on-surface-muted)] transition-transform duration-normal',
                  shouldTrigger && 'rotate-180 text-primary-500',
                )}
              />
            )}
          </div>
        </div>
        {children}
      </div>
    );
  },
);
PullToRefresh.displayName = 'PullToRefresh';
