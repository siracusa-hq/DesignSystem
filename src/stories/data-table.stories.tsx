import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { DataTable, ColumnPinSelector } from '../components/data-table';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from '../components/empty-state';

const meta: Meta = {
  title: 'Data Display/DataTable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const users: User[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3],
  status: i % 4 === 0 ? 'Inactive' : 'Active',
}));

const columns: ColumnDef<User, unknown>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role', enableSorting: true },
  { accessorKey: 'status', header: 'Status' },
];

export const Default: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={users.slice(0, 5)}
      aria-label="Users"
    />
  ),
};

export const WithPagination: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={users}
      enablePagination
      pageSize={10}
      aria-label="Users"
    />
  ),
};

export const GridVariant: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={users.slice(0, 5)}
      variant="grid"
      aria-label="Users"
    />
  ),
};

export const WithSorting: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={users.slice(0, 10)}
      enableSorting
      aria-label="Users"
    />
  ),
};

export const WithRowSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([]);
    return (
      <div>
        <p className="text-sm text-neutral-500 mb-2">
          Selected: {selected.length} users
        </p>
        <DataTable
          columns={columns}
          data={users.slice(0, 10)}
          enableRowSelection
          onRowSelectionChange={setSelected}
          aria-label="Users"
        />
      </div>
    );
  },
};

export const WithColumnVisibility: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={users.slice(0, 10)}
      enableColumnVisibility
      aria-label="Users"
    />
  ),
};

export const FullFeatured: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={users}
      enableSorting
      enableRowSelection
      enableColumnVisibility
      enablePagination
      pageSize={10}
      aria-label="Users"
    />
  ),
};

export const WithStickyColumns: Story = {
  render: () => {
    const allColumns = [
      { id: 'name', label: 'Name' },
      { id: 'email', label: 'Email' },
      { id: 'role', label: 'Role' },
      { id: 'status', label: 'Status' },
      { id: 'department', label: 'Department' },
      { id: 'location', label: 'Location' },
      { id: 'phone', label: 'Phone' },
      { id: 'joinDate', label: 'Join Date' },
    ];
    const [pinnedIds, setPinnedIds] = useState(['name', 'email']);

    const handleToggle = (id: string, checked: boolean) => {
      if (checked) {
        // 元のカラム順序を保持して追加
        const ordered = allColumns
          .map((c) => c.id)
          .filter((cid) => pinnedIds.includes(cid) || cid === id);
        setPinnedIds(ordered);
      } else {
        setPinnedIds((prev) => prev.filter((p) => p !== id));
      }
    };

    const wideColumns: ColumnDef<User & { department: string; location: string; phone: string; joinDate: string }, unknown>[] = [
      { accessorKey: 'name', header: 'Name', size: 150 },
      { accessorKey: 'email', header: 'Email', size: 220 },
      { accessorKey: 'role', header: 'Role', size: 120 },
      { accessorKey: 'status', header: 'Status', size: 120 },
      { accessorKey: 'department', header: 'Department', size: 150 },
      { accessorKey: 'location', header: 'Location', size: 180 },
      { accessorKey: 'phone', header: 'Phone', size: 160 },
      { accessorKey: 'joinDate', header: 'Join Date', size: 140 },
    ];
    const wideData = users.slice(0, 10).map((u) => ({
      ...u,
      department: ['Engineering', 'Design', 'Marketing'][u.id % 3],
      location: ['Tokyo', 'New York', 'London', 'Berlin'][u.id % 4],
      phone: `+81-90-${String(u.id).padStart(4, '0')}-0000`,
      joinDate: `2024-${String((u.id % 12) + 1).padStart(2, '0')}-01`,
    }));

    // stickyColumns は連続した左端からの列数なので、pinnedIds の順序で数える
    const stickyCount = pinnedIds.length;

    return (
      <div style={{ maxWidth: 800 }}>
        <div className="relative z-popover mb-2 flex justify-end">
          <ColumnPinSelector
            options={allColumns}
            pinned={pinnedIds}
            onToggle={handleToggle}
          />
        </div>
        <DataTable
          columns={wideColumns}
          data={wideData}
          stickyColumns={stickyCount}
          aria-label="Users with sticky columns"
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      emptyState={
        <EmptyState size="sm">
          <EmptyStateIcon>
            <Users />
          </EmptyStateIcon>
          <EmptyStateTitle>No users found</EmptyStateTitle>
          <EmptyStateDescription>
            Try adjusting your filters.
          </EmptyStateDescription>
        </EmptyState>
      }
      aria-label="Users"
    />
  ),
};
