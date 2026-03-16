import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
} from '../../components/app-shell';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Badge } from '../../components/badge';
import { Separator } from '../../components/separator';
import { Avatar, AvatarFallback } from '../../components/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../../components/dropdown-menu';

const meta: Meta = {
  title: 'Examples/App Standard',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const pages = ['Dashboard', 'Projects', 'Tasks', 'Contacts', 'Reports', 'Settings'] as const;

function StandardApp() {
  const [currentPage, setCurrentPage] = useState<string>('Dashboard');

  return (
    <AppShell>
      <AppShellSidebar>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold">Polastack</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 flex-1">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-left text-sm transition-colors ${
                  currentPage === page
                    ? 'bg-primary-500 text-white font-medium'
                    : 'text-[--color-on-surface-secondary] hover:bg-[--color-surface-muted]'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>

          <Separator className="my-4" />

          {/* User */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Tanaka Taro</p>
              <p className="text-xs text-[--color-on-surface-muted] truncate">Admin</p>
            </div>
          </div>
        </div>
      </AppShellSidebar>

      <div className="flex flex-col flex-1">
        <AppShellHeader>
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-lg font-semibold">{currentPage}</h1>
              <Input
                placeholder="Search..."
                className="max-w-xs hidden sm:block"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Badge variant="info">3</Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>TT</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </AppShellHeader>

        <AppShellContent>
          <div className="p-6">
            <div className="rounded-lg border border-dashed border-[--color-border] p-12 text-center text-[--color-on-surface-muted]">
              <p className="text-lg font-medium mb-2">{currentPage} Page</p>
              <p className="text-sm">Select a page from the sidebar to navigate</p>
            </div>
          </div>
        </AppShellContent>
      </div>
    </AppShell>
  );
}

export const Default: Story = {
  render: () => <StandardApp />,
};
