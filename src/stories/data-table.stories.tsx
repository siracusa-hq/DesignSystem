import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../components/data-table';
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

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      emptyState={
        <EmptyState size="sm">
          <EmptyStateIcon>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
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
