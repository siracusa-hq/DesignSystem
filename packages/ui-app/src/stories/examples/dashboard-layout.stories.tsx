import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
} from '../../components/app-shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/card';
import { DataTable } from '../../components/data-table';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Separator } from '../../components/separator';
import { StatCard } from '../../components/stat-card';
import {
  DashboardGrid,
  DashboardSection,
  DashboardPanel,
} from '../../components/dashboard-grid';

const meta: Meta = {
  title: 'Examples/Dashboard Layout',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

interface Activity {
  id: string;
  action: string;
  user: string;
  target: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

const activityData: Activity[] = [
  { id: '1', action: 'Created', user: 'Tanaka', target: 'Project Alpha', time: '2 min ago', status: 'completed' },
  { id: '2', action: 'Updated', user: 'Suzuki', target: 'Invoice #1234', time: '15 min ago', status: 'completed' },
  { id: '3', action: 'Deleted', user: 'Sato', target: 'Draft Report', time: '1 hour ago', status: 'completed' },
  { id: '4', action: 'Exported', user: 'Yamada', target: 'Q4 Data', time: '2 hours ago', status: 'pending' },
  { id: '5', action: 'Submitted', user: 'Takahashi', target: 'Review Request', time: '3 hours ago', status: 'failed' },
];

const activityColumns: ColumnDef<Activity>[] = [
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'time', header: 'Time' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'warning';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

const navItems = [
  { label: 'Dashboard', active: true },
  { label: 'Projects', active: false },
  { label: 'Invoices', active: false },
  { label: 'Reports', active: false },
  { label: 'Settings', active: false },
];

function DashboardLayout() {
  return (
    <AppShell>
      <AppShellSidebar>
        <div className="p-4">
          <h2 className="text-lg font-bold text-primary-500 mb-4">Polastack</h2>
          <Separator className="mb-4" />
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`px-3 py-2 rounded-md text-left text-sm transition-colors ${
                  item.active
                    ? 'bg-[var(--color-surface-muted)] text-[var(--color-on-surface)] font-medium'
                    : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </AppShellSidebar>

      <div className="flex flex-col flex-1">
        <AppShellHeader>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </AppShellHeader>

        <AppShellContent>
          <div className="p-6">
            <DashboardGrid>
              <DashboardSection>
                <DashboardPanel colSpan={{ default: 6, lg: 3 }}>
                  <StatCard label="Total Revenue" value="¥1,234,567" trend="+12.5%" />
                </DashboardPanel>
                <DashboardPanel colSpan={{ default: 6, lg: 3 }}>
                  <StatCard label="Active Projects" value="24" trend="+3" />
                </DashboardPanel>
                <DashboardPanel colSpan={{ default: 6, lg: 3 }}>
                  <StatCard label="Team Members" value="18" trend="+2" />
                </DashboardPanel>
                <DashboardPanel colSpan={{ default: 6, lg: 3 }}>
                  <StatCard label="Open Issues" value="7" trend="-5" />
                </DashboardPanel>
              </DashboardSection>

              <DashboardSection>
                <DashboardPanel colSpan={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions across all projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        columns={activityColumns}
                        data={activityData}
                        enableSorting
                        aria-label="Recent activity"
                      />
                    </CardContent>
                  </Card>
                </DashboardPanel>
              </DashboardSection>
            </DashboardGrid>
          </div>
        </AppShellContent>
      </div>
    </AppShell>
  );
}

export const Default: Story = {
  render: () => <DashboardLayout />,
};
