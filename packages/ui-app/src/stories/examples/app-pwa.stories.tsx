import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Home,
  Folder,
  Bell,
  User,
  ChevronRight,
  CheckCircle,
  Circle,
  SquarePen,
  BellRing,
  Sun,
  HelpCircle,
} from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarStatus } from '../../components/avatar';
import { AvatarGroup } from '../../components/avatar-group';
import { Separator } from '../../components/separator';

const meta: Meta = {
  title: 'Examples/App PWA',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

/* ----- Icons ----- */

/* ----- Mock Data ----- */

const projects = [
  { name: 'API Gateway', status: 'active' as const, members: ['a1', 'a2', 'a3', 'a4'], progress: 72 },
  { name: 'Design System', status: 'active' as const, members: ['d1', 'd2'], progress: 89 },
  { name: 'Mobile App', status: 'paused' as const, members: ['m1', 'm2', 'm3'], progress: 45 },
];

const tasks = [
  { title: 'Review PR #142', project: 'API Gateway', priority: 'High' as const, done: false },
  { title: 'Update color tokens', project: 'Design System', priority: 'Medium' as const, done: true },
  { title: 'Fix push notification', project: 'Mobile App', priority: 'High' as const, done: false },
  { title: 'Write API docs', project: 'API Gateway', priority: 'Low' as const, done: false },
  { title: 'Deploy staging build', project: 'Mobile App', priority: 'Medium' as const, done: false },
];

const activity = [
  { user: 'Suzuki', action: 'opened PR', target: '#142', time: '15m ago' },
  { user: 'Sato', action: 'commented on', target: 'Issue #89', time: '1h ago' },
  { user: 'Yamada', action: 'deployed', target: 'v2.1.0', time: '3h ago' },
];

type Page = 'home' | 'projects' | 'profile';
type ProfileMenuItem = 'edit' | 'notifications' | 'appearance' | 'help' | null;

/* ----- App ----- */

function PWAApp() {
  const [page, setPage] = useState<Page>('home');
  const [activeProfileItem, setActiveProfileItem] = useState<ProfileMenuItem>(null);

  const titles: Record<Page, string> = {
    home: 'Home',
    projects: 'Projects',
    profile: 'Profile',
  };

  return (
    <div className="h-[667px] w-[375px] mx-auto border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
      <AppShell withBottomNav>
        <div className="flex flex-col flex-1">
          <AppShellHeader>
            <div className="flex items-center justify-between w-full">
              {page === 'home' ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
                      P
                    </div>
                    <span className="font-semibold">Polastack</span>
                  </div>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500" />
                  </Button>
                </>
              ) : (
                <h1 className="text-lg font-semibold">{titles[page]}</h1>
              )}
            </div>
          </AppShellHeader>

          <AppShellContent>
            <div className="p-4">
              {page === 'home' && <HomeContent />}
              {page === 'projects' && <ProjectsContent />}
              {page === 'profile' && <ProfileContent activeItem={activeProfileItem} onItemSelect={setActiveProfileItem} />}
            </div>
          </AppShellContent>
        </div>
      </AppShell>

      <BottomNavigation>
        <BottomNavigationItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          active={page === 'home'}
          onClick={() => setPage('home')}
        />
        <BottomNavigationItem
          icon={<Folder className="h-5 w-5" />}
          label="Projects"
          active={page === 'projects'}
          onClick={() => setPage('projects')}
        />
        <BottomNavigationItem
          icon={<User className="h-5 w-5" />}
          label="Profile"
          active={page === 'profile'}
          onClick={() => setPage('profile')}
        />
      </BottomNavigation>
    </div>
  );
}

/* ----- Home ----- */

function HomeContent() {
  const pending = tasks.filter((t) => !t.done).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Greeting */}
      <div>
        <p className="text-lg font-semibold">Good morning, Taro</p>
        <p className="text-sm text-[var(--color-on-surface-muted)]">
          You have {pending} tasks remaining today
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Tasks', value: String(tasks.length), color: 'text-primary-500' },
          { label: 'Done', value: String(tasks.filter((t) => t.done).length), color: 'text-success-500' },
          { label: 'Projects', value: String(projects.length), color: 'text-info-500' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-[var(--color-surface-sunken)] p-3 text-center">
            <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's tasks */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Today&apos;s Tasks</CardTitle>
            <Badge variant="outline" className="text-xs">{pending} left</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {tasks.slice(0, 4).map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className={t.done ? 'text-success-500' : 'text-[var(--color-on-surface-muted)]'}>
                  {t.done ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${t.done ? 'line-through text-[var(--color-on-surface-muted)]' : ''}`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-muted)]">{t.project}</p>
                </div>
                <Badge
                  variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'outline'}
                  className="text-xs shrink-0"
                >
                  {t.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar size="sm">
                  <AvatarFallback colorSeed={a.user}>{a.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{a.user}</span>{' '}
                    {a.action}{' '}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-muted)]">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ----- Projects ----- */

function ProjectsContent() {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((p) => (
        <Card key={p.name} className="overflow-hidden">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Avatar size="sm" shape="square">
                <AvatarFallback colorSeed={p.name}>
                  {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{p.name}</p>
                  <Badge
                    variant={p.status === 'active' ? 'success' : 'outline'}
                    className="text-xs"
                  >
                    {p.status}
                  </Badge>
                </div>
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[var(--color-on-surface-muted)]">Progress</span>
                    <span className="text-xs font-medium tabular-nums">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-sunken)]">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <AvatarGroup max={3} size="sm">
                    {p.members.map((id) => (
                      <Avatar key={id} size="sm">
                        <AvatarFallback colorSeed={id}>{id[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <span className="text-xs text-[var(--color-on-surface-muted)]">{p.members.length} members</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ----- Profile ----- */

const profileMenu: { key: ProfileMenuItem; label: string; icon: React.ReactNode }[] = [
  { key: 'edit', label: 'Edit Profile', icon: <SquarePen className="h-[18px] w-[18px]" /> },
  { key: 'notifications', label: 'Notifications', icon: <BellRing className="h-[18px] w-[18px]" /> },
  { key: 'appearance', label: 'Appearance', icon: <Sun className="h-[18px] w-[18px]" /> },
  { key: 'help', label: 'Help & Support', icon: <HelpCircle className="h-[18px] w-[18px]" /> },
];

function ProfileContent({ activeItem, onItemSelect }: { activeItem: ProfileMenuItem; onItemSelect: (item: ProfileMenuItem) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Profile card */}
      <div className="flex flex-col items-center gap-3 py-2">
        <Avatar className="h-20 w-20">
          <AvatarFallback colorSeed="tanaka@polastack.io" className="text-2xl">TT</AvatarFallback>
          <AvatarStatus status="online" />
        </Avatar>
        <div className="text-center">
          <p className="text-lg font-semibold">Tanaka Taro</p>
          <p className="text-sm text-[var(--color-on-surface-muted)]">tanaka@polastack.io</p>
        </div>
        <div className="flex gap-6 mt-1">
          {[
            { label: 'Projects', value: '3' },
            { label: 'Tasks', value: '12' },
            { label: 'Completed', value: '89' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold tabular-nums">{s.value}</p>
              <p className="text-xs text-[var(--color-on-surface-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Team members */}
      <div>
        <p className="text-xs font-medium text-[var(--color-on-surface-muted)] uppercase tracking-wider mb-2">Team</p>
        <div className="flex gap-3">
          {['Suzuki', 'Sato', 'Yamada', 'Takahashi'].map((name) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <Avatar size="sm">
                <AvatarFallback colorSeed={name}>{name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-[var(--color-on-surface-muted)]">{name.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Menu */}
      <div className="flex flex-col gap-0.5">
        {profileMenu.map((item) => {
          const isActive = activeItem === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onItemSelect(isActive ? null : item.key)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-[var(--color-surface-accent)] text-[var(--color-on-surface-accent)] font-medium'
                  : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              <span className={isActive ? 'text-[var(--color-on-surface-accent)]' : 'text-[var(--color-on-surface-muted)]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className={`ml-auto ${isActive ? 'text-[var(--color-on-surface-accent)]' : 'text-[var(--color-on-surface-muted)]'}`}>
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>

      <Separator />

      <button
        type="button"
        className="flex items-center justify-center w-full py-2.5 text-sm text-error-500 rounded-md hover:bg-error-50 dark:hover:bg-error-950 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}

export const Default: Story = {
  render: () => <PWAApp />,
};
