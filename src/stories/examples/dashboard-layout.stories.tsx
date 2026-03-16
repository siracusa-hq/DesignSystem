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
                    ? 'bg-[--color-surface-muted] text-[--color-on-surface] font-medium'
                    : 'text-[--color-on-surface-secondary] hover:bg-[--color-surface-muted]'
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
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { title: 'Total Revenue', value: '¥1,234,567', change: '+12.5%' },
                { title: 'Active Projects', value: '24', change: '+3' },
                { title: 'Team Members', value: '18', change: '+2' },
                { title: 'Open Issues', value: '7', change: '-5' },
              ].map((metric) => (
                <Card key={metric.title}>
                  <CardHeader className="pb-2">
                    <CardDescription>{metric.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <Badge variant="success" className="text-xs">{metric.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
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
          </div>
        </AppShellContent>
      </div>
    </AppShell>
  );
}

export const Default: Story = {
  render: () => <DashboardLayout />,
};
