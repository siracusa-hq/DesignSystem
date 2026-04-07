import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/* --------------------------------------------------------
   SidebarNav
   -------------------------------------------------------- */

export const SidebarNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn('flex flex-col gap-1 px-3', className)}
    {...props}
  />
));
SidebarNav.displayName = 'SidebarNav';

/* --------------------------------------------------------
   SidebarNavGroup
   -------------------------------------------------------- */

export interface SidebarNavGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ReactNode;
}

export const SidebarNavGroup = React.forwardRef<
  HTMLDivElement,
  SidebarNavGroupProps
>(
  (
    {
      className,
      title,
      defaultOpen = true,
      open: controlledOpen,
      onOpenChange,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <CollapsiblePrimitive.Root
        ref={ref}
        defaultOpen={defaultOpen}
        open={controlledOpen}
        onOpenChange={onOpenChange}
        className={cn('flex flex-col mt-4 first:mt-0', className)}
        {...props}
      >
        <CollapsiblePrimitive.Trigger className="group flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-muted)] transition-colors hover:text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] touch:min-h-[--touch-target-min]">
          {icon && <span className="shrink-0 opacity-70">{icon}</span>}
          <span className="flex-1 text-left">{title}</span>
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-normal group-data-[state=closed]:-rotate-90"
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="flex flex-col gap-0.5 pt-0.5 pl-2">
            {children}
          </div>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    );
  },
);
SidebarNavGroup.displayName = 'SidebarNavGroup';

/* --------------------------------------------------------
   SidebarNavItem
   -------------------------------------------------------- */

export interface SidebarNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  href?: string;
}

export const SidebarNavItem = React.forwardRef<
  HTMLButtonElement,
  SidebarNavItemProps
>(({ className, icon, active = false, badge, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors touch:min-h-[--touch-target-min]',
      active
        ? 'bg-[var(--color-surface-accent)] text-[var(--color-on-surface-accent)] font-medium'
        : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]',
      className,
    )}
    aria-current={active ? 'page' : undefined}
    {...props}
  >
    {icon && (
      <span className={cn('shrink-0', active ? 'opacity-100' : 'opacity-70')}>
        {icon}
      </span>
    )}
    <span className="flex-1 text-left truncate">{children}</span>
    {badge && (
      <span
        className={cn(
          'min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-xs font-medium',
          active
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-950)] dark:text-[var(--color-primary-300)]'
            : 'bg-[var(--color-surface-sunken)] text-[var(--color-on-surface-muted)]',
        )}
      >
        {badge}
      </span>
    )}
  </button>
));
SidebarNavItem.displayName = 'SidebarNavItem';
