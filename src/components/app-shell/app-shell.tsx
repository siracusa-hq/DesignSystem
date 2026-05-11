import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';
import { useBreakpoint } from '@/hooks';
import { Drawer, DrawerContent } from '@/components/drawer';

/* ----- AppShell Context ----- */

interface AppShellContextValue {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  withBottomNav: boolean;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const [AppShellProvider, useAppShell] =
  createContext<AppShellContextValue>('AppShell');

export { useAppShell };

/* ----- AppShell ----- */

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;
  withBottomNav?: boolean;
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      className,
      sidebarCollapsed: controlledCollapsed,
      onSidebarCollapsedChange,
      sidebarWidth = 256,
      sidebarCollapsedWidth = 64,
      withBottomNav = false,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile } = useBreakpoint();
    const [internalCollapsed, setInternalCollapsed] = React.useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

    const collapsed = controlledCollapsed ?? internalCollapsed;
    const setCollapsed = onSidebarCollapsedChange ?? setInternalCollapsed;

    return (
      <AppShellProvider
        value={{
          sidebarCollapsed: collapsed,
          setSidebarCollapsed: setCollapsed,
          isMobile,
          withBottomNav,
          mobileSidebarOpen,
          setMobileSidebarOpen,
        }}
      >
        <div
          ref={ref}
          className={cn('flex h-dvh', className)}
          style={
            {
              '--sidebar-width': `${sidebarWidth}px`,
              '--sidebar-collapsed-width': `${sidebarCollapsedWidth}px`,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </AppShellProvider>
    );
  },
);
AppShell.displayName = 'AppShell';

/* ----- AppShellSidebar ----- */

export const AppShellSidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const { sidebarCollapsed, isMobile, mobileSidebarOpen, setMobileSidebarOpen } =
    useAppShell();

  if (isMobile) {
    return (
      <Drawer
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
        side="left"
      >
        <DrawerContent size="sm" className={className}>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <aside
      ref={ref}
      className={cn(
        'hidden md:flex md:flex-col shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-raised)] overflow-y-auto transition-[width] duration-slow',
        className,
      )}
      style={{
        width: sidebarCollapsed
          ? 'var(--sidebar-collapsed-width)'
          : 'var(--sidebar-width)',
      }}
      {...props}
    >
      {children}
    </aside>
  );
});
AppShellSidebar.displayName = 'AppShellSidebar';

/* ----- AppShellHeader ----- */

export const AppShellHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const { isMobile, setMobileSidebarOpen } = useAppShell();

  return (
    <header
      ref={ref}
      className={cn(
        // `z-header` (= 20) を予防適用。将来 header 内に sticky sub-element を
        // 配置した時にも、Modal/Drawer 等の floating レイヤーに対して
        // 安定した順序関係を持つ。詳細: docs/z-index-system.md
        'flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 shrink-0 relative isolate z-header',
        className,
      )}
      {...props}
    >
      {isMobile && (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-md p-1.5 hover:bg-[var(--color-surface-muted)] transition-colors touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      {children}
    </header>
  );
});
AppShellHeader.displayName = 'AppShellHeader';

/* ----- AppShellContent ----- */

export const AppShellContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  const { withBottomNav } = useAppShell();

  return (
    <main
      ref={ref}
      className={cn(
        'flex-1 overflow-auto',
        withBottomNav &&
          'pb-[calc(var(--bottom-nav-height)+var(--safe-area-bottom))]',
        className,
      )}
      {...props}
    />
  );
});
AppShellContent.displayName = 'AppShellContent';

/* ----- AppShellFooter ----- */

export const AppShellFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn(
      'flex items-center border-t border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 shrink-0',
      className,
    )}
    {...props}
  />
));
AppShellFooter.displayName = 'AppShellFooter';
