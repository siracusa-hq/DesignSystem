import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
} from './app-shell';

// Mock useBreakpoint to control mobile/desktop state
vi.mock('@/hooks', () => ({
  useBreakpoint: vi.fn(() => ({
    breakpoint: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
}));

import { useBreakpoint } from '@/hooks';
const mockUseBreakpoint = vi.mocked(useBreakpoint);

function renderAppShell(props?: { withBottomNav?: boolean; sidebarCollapsed?: boolean }) {
  return render(
    <AppShell withBottomNav={props?.withBottomNav} sidebarCollapsed={props?.sidebarCollapsed}>
      <AppShellSidebar>
        <nav>Sidebar nav</nav>
      </AppShellSidebar>
      <div className="flex flex-1 flex-col min-w-0">
        <AppShellHeader>Header content</AppShellHeader>
        <AppShellContent>Main content</AppShellContent>
        <AppShellFooter>Footer content</AppShellFooter>
      </div>
    </AppShell>,
  );
}

describe('AppShell', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'lg',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });

  it('renders all sub-components on desktop', () => {
    renderAppShell();
    expect(screen.getByText('Sidebar nav')).toBeInTheDocument();
    expect(screen.getByText('Header content')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders sidebar as aside on desktop', () => {
    renderAppShell();
    const sidebar = screen.getByText('Sidebar nav').closest('aside');
    expect(sidebar).toBeInTheDocument();
  });

  it('shows hamburger menu on mobile', () => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'base',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });
    renderAppShell();
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('does not show hamburger on desktop', () => {
    renderAppShell();
    expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
  });

  it('opens mobile sidebar drawer on hamburger click', async () => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'base',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });
    const user = userEvent.setup();
    renderAppShell();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    // Sidebar content should now be visible in the drawer
    expect(screen.getByText('Sidebar nav')).toBeInTheDocument();
  });

  it('applies collapsed sidebar width', () => {
    renderAppShell({ sidebarCollapsed: true });
    const sidebar = screen.getByText('Sidebar nav').closest('aside');
    expect(sidebar?.style.width).toBe('var(--sidebar-collapsed-width)');
  });

  it('applies expanded sidebar width', () => {
    renderAppShell({ sidebarCollapsed: false });
    const sidebar = screen.getByText('Sidebar nav').closest('aside');
    expect(sidebar?.style.width).toBe('var(--sidebar-width)');
  });

  it('applies bottom nav padding when withBottomNav', () => {
    renderAppShell({ withBottomNav: true });
    const content = screen.getByText('Main content').closest('main');
    expect(content?.className).toContain('pb-');
  });

  it('merges custom className', () => {
    const { container } = render(
      <AppShell className="custom-shell">
        <AppShellContent>Content</AppShellContent>
      </AppShell>,
    );
    expect(container.firstChild).toHaveClass('custom-shell');
  });

  it('passes axe accessibility check', async () => {
    const { container } = renderAppShell();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
