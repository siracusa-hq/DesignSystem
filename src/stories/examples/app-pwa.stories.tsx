import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AppShell,
  AppShellHeader,
  AppShellContent,
} from '../../components/app-shell';
import {
  BottomNavigation,
  BottomNavigationItem,
} from '../../components/bottom-navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/card';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Avatar, AvatarFallback } from '../../components/avatar';
import { Separator } from '../../components/separator';

const meta: Meta = {
  title: 'Examples/App PWA',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

// Simple SVG icons for the demo
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

type Page = 'home' | 'tasks' | 'profile';

function PWAApp() {
  const [page, setPage] = useState<Page>('home');

  return (
    <div className="h-[667px] w-[375px] mx-auto border border-[--color-border] rounded-xl overflow-hidden bg-[--color-surface]">
      <AppShell withBottomNav>
        <div className="flex flex-col flex-1">
          <AppShellHeader>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-semibold">
                {page === 'home' ? 'Home' : page === 'tasks' ? 'Tasks' : 'Profile'}
              </h1>
              {page === 'home' && (
                <Button variant="ghost" size="sm">
                  <Badge variant="error">2</Badge>
                </Button>
              )}
            </div>
          </AppShellHeader>

          <AppShellContent>
            <div className="p-4">
              {page === 'home' && <HomeContent />}
              {page === 'tasks' && <TasksContent />}
              {page === 'profile' && <ProfileContent />}
            </div>
          </AppShellContent>
        </div>
      </AppShell>

      <BottomNavigation>
        <BottomNavigationItem
          icon={<HomeIcon />}
          label="Home"
          active={page === 'home'}
          onClick={() => setPage('home')}
        />
        <BottomNavigationItem
          icon={<ListIcon />}
          label="Tasks"
          active={page === 'tasks'}
          onClick={() => setPage('tasks')}
        />
        <BottomNavigationItem
          icon={<UserIcon />}
          label="Profile"
          active={page === 'profile'}
          onClick={() => setPage('profile')}
        />
      </BottomNavigation>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[--color-on-surface-secondary]">
            You have 3 tasks due today and 2 new notifications.
          </p>
          <Button size="sm" className="mt-3">View Tasks</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Completed', value: '12', variant: 'success' as const },
              { label: 'In Progress', value: '5', variant: 'warning' as const },
              { label: 'Overdue', value: '2', variant: 'error' as const },
              { label: 'Total', value: '24', variant: 'info' as const },
            ].map((stat) => (
              <div key={stat.label} className="rounded-md bg-[--color-surface-sunken] p-3">
                <p className="text-xs text-[--color-on-surface-muted]">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold">{stat.value}</span>
                  <Badge variant={stat.variant} className="text-xs">{stat.label}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TasksContent() {
  const tasks = [
    { title: 'Review PR #42', status: 'In Progress', priority: 'High' },
    { title: 'Update documentation', status: 'Todo', priority: 'Medium' },
    { title: 'Fix login bug', status: 'In Progress', priority: 'High' },
    { title: 'Design review meeting', status: 'Todo', priority: 'Low' },
    { title: 'Deploy v2.0', status: 'Blocked', priority: 'High' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task, i) => (
        <Card key={i}>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-[--color-on-surface-muted] mt-1">{task.status}</p>
              </div>
              <Badge
                variant={
                  task.priority === 'High' ? 'error' :
                  task.priority === 'Medium' ? 'warning' : 'outline'
                }
              >
                {task.priority}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProfileContent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarFallback className="text-2xl">TT</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-lg font-semibold">Tanaka Taro</p>
        <p className="text-sm text-[--color-on-surface-muted]">tanaka@example.com</p>
      </div>
      <Separator className="w-full" />
      <div className="w-full flex flex-col gap-2">
        {['Edit Profile', 'Notification Settings', 'Theme', 'Help & Support', 'Log Out'].map((item) => (
          <button
            key={item}
            type="button"
            className="w-full px-4 py-3 text-left text-sm rounded-md hover:bg-[--color-surface-muted] transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <PWAApp />,
};
