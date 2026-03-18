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
import { Avatar, AvatarFallback, AvatarStatus } from '../../components/avatar';
import { AvatarGroup } from '../../components/avatar-group';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../components/tooltip';
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

/* ----- Icons (Lucide-style inline SVGs) ----- */

const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const LayoutDashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const FolderIcon = () => <Icon d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" size={18} />;
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const FileTextIcon = () => <Icon d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M10 13H8M16 17H8M14 9H8" size={18} />;
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const BellIcon = () => <Icon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" size={18} />;
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const ChevronRightIcon = () => <Icon d="m9 18 6-6-6-6" size={14} />;
const ActivityIcon = () => <Icon d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" size={18} />;

/* ----- Navigation Config ----- */

interface NavItem {
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboardIcon /> },
  { label: 'Projects', icon: <FolderIcon />, badge: '12' },
  { label: 'Members', icon: <UsersIcon /> },
  { label: 'Activity', icon: <ActivityIcon />, badge: '3' },
  { label: 'Documents', icon: <FileTextIcon /> },
];

const bottomNav: NavItem[] = [
  { label: 'Settings', icon: <SettingsIcon /> },
];

/* ----- Mock Data ----- */

const projects = [
  { name: 'API Gateway', status: 'active' as const, members: ['api-1', 'api-2', 'api-3', 'api-4'], updated: '2h ago' },
  { name: 'Design System', status: 'active' as const, members: ['ds-1', 'ds-2'], updated: '30m ago' },
  { name: 'Mobile App', status: 'paused' as const, members: ['mob-1', 'mob-2', 'mob-3'], updated: '1d ago' },
  { name: 'Auth Service', status: 'active' as const, members: ['auth-1', 'auth-2', 'auth-3', 'auth-4', 'auth-5'], updated: '4h ago' },
  { name: 'Analytics Dashboard', status: 'review' as const, members: ['an-1', 'an-2'], updated: '6h ago' },
];

const recentActivity = [
  { user: 'Tanaka', action: 'pushed to', target: 'main', project: 'API Gateway', time: '2m ago' },
  { user: 'Suzuki', action: 'opened PR', target: '#142', project: 'Design System', time: '15m ago' },
  { user: 'Sato', action: 'commented on', target: 'Issue #89', project: 'Mobile App', time: '1h ago' },
  { user: 'Yamada', action: 'deployed', target: 'v2.1.0', project: 'Auth Service', time: '3h ago' },
  { user: 'Takahashi', action: 'merged PR', target: '#138', project: 'Analytics Dashboard', time: '5h ago' },
];

/* ----- App ----- */

function StandardApp() {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  return (
    <TooltipProvider>
      <AppShell>
        {/* ----- Sidebar ----- */}
        <AppShellSidebar>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
                P
              </div>
              <span className="font-semibold tracking-tight">Polastack</span>
            </div>

            {/* Search trigger */}
            <div className="px-3 mb-3">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md border border-[var(--color-border-input)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-on-surface-muted)] transition-colors hover:bg-[var(--color-surface-muted)]"
              >
                <SearchIcon />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-[var(--color-border)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-on-surface-muted)]">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Main nav */}
            <nav className="flex-1 px-3">
              <div className="flex flex-col gap-0.5">
                {mainNav.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCurrentPage(item.label)}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                      currentPage === item.label
                        ? 'bg-[var(--color-surface-muted)] text-[var(--color-on-surface)] font-medium'
                        : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    <span className="shrink-0 opacity-70">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-[20px] rounded-full bg-[var(--color-surface-sunken)] px-1.5 py-0.5 text-center text-xs font-medium text-[var(--color-on-surface-muted)]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Bottom nav */}
            <div className="px-3 pb-2">
              <Separator className="mb-2" />
              {bottomNav.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCurrentPage(item.label)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                    currentPage === item.label
                      ? 'bg-[var(--color-surface-muted)] text-[var(--color-on-surface)] font-medium'
                      : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]'
                  }`}
                >
                  <span className="shrink-0 opacity-70">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>

            {/* User section */}
            <div className="border-t border-[var(--color-border)] px-3 py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-surface-muted)]"
                  >
                    <Avatar size="sm">
                      <AvatarFallback colorSeed="tanaka@polastack.io">TT</AvatarFallback>
                      <AvatarStatus status="online" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Tanaka Taro</p>
                      <p className="text-xs text-[var(--color-on-surface-muted)] truncate">tanaka@polastack.io</p>
                    </div>
                    <ChevronRightIcon />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </AppShellSidebar>

        {/* ----- Main Area ----- */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <AppShellHeader>
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">{currentPage}</h1>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <BellIcon />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar size="sm">
                        <AvatarFallback colorSeed="tanaka@polastack.io">TT</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tanaka Taro</DropdownMenuLabel>
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

          {/* Content */}
          <AppShellContent>
            <div className="p-6 max-w-6xl">
              {currentPage === 'Dashboard' && <DashboardContent />}
              {currentPage === 'Projects' && <ProjectsContent />}
              {currentPage === 'Members' && <MembersContent />}
              {currentPage === 'Activity' && <ActivityContent />}
              {currentPage !== 'Dashboard' && currentPage !== 'Projects' && currentPage !== 'Members' && currentPage !== 'Activity' && (
                <PlaceholderContent page={currentPage} />
              )}
            </div>
          </AppShellContent>
        </div>
      </AppShell>
    </TooltipProvider>
  );
}

/* ----- Dashboard Content ----- */

function DashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: '12', change: '+2', trend: 'up' },
          { label: 'Team Members', value: '24', change: '+3', trend: 'up' },
          { label: 'Open Issues', value: '18', change: '-5', trend: 'down' },
          { label: 'Deployments', value: '142', change: '+12', trend: 'up' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-5">
              <p className="text-xs font-medium text-[var(--color-on-surface-muted)] uppercase tracking-wider">{m.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold tabular-nums">{m.value}</span>
                <Badge variant={m.trend === 'up' ? 'success' : 'error'} className="text-xs">
                  {m.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Projects overview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">View all</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-[var(--color-border)]">
              {projects.slice(0, 4).map((p) => (
                <div key={p.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" shape="square">
                      <AvatarFallback colorSeed={p.name}>
                        {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-muted)]">Updated {p.updated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AvatarGroup max={3} size="sm">
                      {p.members.map((id) => (
                        <Avatar key={id} size="sm">
                          <AvatarFallback colorSeed={id}>{id[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Badge
                      variant={p.status === 'active' ? 'success' : p.status === 'review' ? 'warning' : 'outline'}
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentActivity.slice(0, 5).map((a, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar size="sm">
                    <AvatarFallback colorSeed={a.user}>{a.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{a.user}</span>
                      {' '}{a.action}{' '}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-muted)]">
                      {a.project} · {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ----- Projects Content ----- */

function ProjectsContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-[var(--color-on-surface-muted)]">{projects.length} projects</p>
        </div>
        <Button size="sm">New Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card key={p.name} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <Avatar shape="square">
                  <AvatarFallback colorSeed={p.name}>
                    {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{p.name}</p>
                    <Badge
                      variant={p.status === 'active' ? 'success' : p.status === 'review' ? 'warning' : 'outline'}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--color-on-surface-muted)] mt-1">Updated {p.updated}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <AvatarGroup max={4} size="sm">
                  {p.members.map((id) => (
                    <Avatar key={id} size="sm">
                      <AvatarFallback colorSeed={id}>{id[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                <span className="text-xs text-[var(--color-on-surface-muted)]">{p.members.length} members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ----- Members Content ----- */

const members = [
  { name: 'Tanaka Taro', role: 'Admin', email: 'tanaka@polastack.io', status: 'online' as const },
  { name: 'Suzuki Hanako', role: 'Developer', email: 'suzuki@polastack.io', status: 'online' as const },
  { name: 'Sato Kenji', role: 'Developer', email: 'sato@polastack.io', status: 'away' as const },
  { name: 'Yamada Yuki', role: 'Designer', email: 'yamada@polastack.io', status: 'busy' as const },
  { name: 'Takahashi Mai', role: 'PM', email: 'takahashi@polastack.io', status: 'offline' as const },
];

function MembersContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Members</h2>
          <p className="text-sm text-[var(--color-on-surface-muted)]">{members.length} members</p>
        </div>
        <Button size="sm">Invite</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--color-border)]">
            {members.map((m) => (
              <div key={m.email} className="flex items-center gap-4 px-5 py-3.5">
                <Avatar>
                  <AvatarFallback colorSeed={m.email}>
                    {m.name.split(' ').map((w) => w[0]).join('')}
                  </AvatarFallback>
                  <AvatarStatus status={m.status} />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-[var(--color-on-surface-muted)]">{m.email}</p>
                </div>
                <Badge variant="outline">{m.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ----- Activity Content ----- */

function ActivityContent() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Activity</h2>
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col gap-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <Avatar size="sm">
                  <AvatarFallback colorSeed={a.user}>{a.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{a.user}</span>
                    {' '}{a.action}{' '}
                    <span className="font-medium text-primary-500">{a.target}</span>
                    {' '}in {a.project}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ----- Placeholder ----- */

function PlaceholderContent({ page }: { page: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] p-12 text-center text-[var(--color-on-surface-muted)]">
      <p className="text-lg font-medium mb-2">{page}</p>
      <p className="text-sm">Select a page from the sidebar to navigate</p>
    </div>
  );
}

export const Default: Story = {
  render: () => <StandardApp />,
};
