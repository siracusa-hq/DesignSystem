import * as React from 'react';
import { cn } from '@/lib/cn';

export interface BottomNavigationProps
  extends React.HTMLAttributes<HTMLElement> {}

export const BottomNavigation = React.forwardRef<
  HTMLElement,
  BottomNavigationProps
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      'fixed bottom-0 left-0 right-0 z-sticky flex items-center justify-around border-t border-[--color-border] bg-[--color-surface-raised] pb-[--safe-area-bottom]',
      'h-[calc(var(--bottom-nav-height)+var(--safe-area-bottom))]',
      className,
    )}
    {...props}
  />
));
BottomNavigation.displayName = 'BottomNavigation';

export interface BottomNavigationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export const BottomNavigationItem = React.forwardRef<
  HTMLButtonElement,
  BottomNavigationItemProps
>(({ className, icon, label, active = false, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex min-w-[--touch-target-min] flex-1 flex-col items-center justify-center gap-0.5 py-1 text-xs transition-colors',
      active
        ? 'text-primary-500 font-medium'
        : 'text-[--color-on-surface-muted] hover:text-[--color-on-surface-secondary]',
      className,
    )}
    aria-current={active ? 'page' : undefined}
    {...props}
  >
    <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
    <span>{label}</span>
  </button>
));
BottomNavigationItem.displayName = 'BottomNavigationItem';
