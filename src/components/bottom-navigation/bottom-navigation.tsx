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
      // `isolate` で stacking context を BottomNavigation 内に閉じる
      // (子の z-index が外部レイヤーに干渉しないことを保証)。docs/z-index-system.md
      'fixed bottom-0 left-0 right-0 z-sticky isolate flex items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-surface-raised)] pb-[var(--safe-area-bottom)]',
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
        : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface-secondary)]',
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
