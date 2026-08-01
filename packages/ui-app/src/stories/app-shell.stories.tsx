import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
} from '../components/app-shell';
import { Button } from '../components/button';

const meta: Meta = {
  title: 'Navigation/AppShell',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const navItems = ['Dashboard', 'Users', 'Projects', 'Settings'];

export const Default: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('Dashboard');

    return (
      <AppShell
        sidebarCollapsed={collapsed}
        onSidebarCollapsedChange={setCollapsed}
      >
        <AppShellSidebar>
          <div className="p-4">
            <h2 className="text-lg font-bold text-primary-500 mb-4">
              Polastack
            </h2>
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCurrentPage(item)}
                  className={`block w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                    currentPage === item
                      ? 'bg-[var(--color-surface-accent)] text-[var(--color-on-surface-accent)] font-medium'
                      : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]'
                  }`}
                >
                  {!collapsed && item}
                </button>
              ))}
            </nav>
          </div>
        </AppShellSidebar>
        <div className="flex flex-1 flex-col min-w-0">
          <AppShellHeader>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:inline-flex"
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </Button>
            <span className="text-sm font-medium">{currentPage}</span>
          </AppShellHeader>
          <AppShellContent>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{currentPage}</h1>
              <p className="text-[var(--color-on-surface-secondary)]">
                This is the main content area of the application shell.
              </p>
            </div>
          </AppShellContent>
          <AppShellFooter>
            <span className="text-xs text-[var(--color-on-surface-muted)]">
              Polastack Design System v0.1.0
            </span>
          </AppShellFooter>
        </div>
      </AppShell>
    );
  },
};

export const WithBottomNav: Story = {
  render: () => (
    <AppShell withBottomNav>
      <div className="flex flex-1 flex-col min-w-0">
        <AppShellHeader>
          <span className="text-sm font-medium">Mobile App</span>
        </AppShellHeader>
        <AppShellContent>
          <div className="p-6">
            <p className="text-[var(--color-on-surface-secondary)]">
              Content area with bottom navigation padding.
            </p>
          </div>
        </AppShellContent>
      </div>
    </AppShell>
  ),
};
