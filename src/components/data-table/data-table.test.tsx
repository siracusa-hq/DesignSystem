import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';

interface TestData {
  id: number;
  name: string;
  status: string;
}

const testData: TestData[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  status: i % 2 === 0 ? 'Active' : 'Inactive',
}));

const columns: ColumnDef<TestData, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
];

const sortableColumns: ColumnDef<TestData, unknown>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'status', header: 'Status', enableSorting: true },
];

describe('DataTable', () => {
  it('renders data rows', () => {
    render(
      <DataTable columns={columns} data={testData.slice(0, 3)} aria-label="Test table" />,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <DataTable columns={columns} data={testData.slice(0, 1)} aria-label="Test table" />,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <DataTable columns={columns} data={[]} aria-label="Test table" />,
    );
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('shows custom empty state', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyState={<div>Nothing here</div>}
        aria-label="Test table"
      />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('enables pagination', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={testData}
        enablePagination
        pageSize={10}
        aria-label="Test table"
      />,
    );

    expect(screen.getByText('1-10 of 25')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('11-20 of 25')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        enablePagination
        pageSize={10}
        aria-label="Test table"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  it('enables row selection with checkboxes', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={testData.slice(0, 3)}
        enableRowSelection
        onRowSelectionChange={onSelectionChange}
        aria-label="Test table"
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4); // 1 header + 3 rows

    await user.click(checkboxes[1]); // select first row
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('select all checkbox works', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={testData.slice(0, 3)}
        enableRowSelection
        aria-label="Test table"
      />,
    );

    const selectAll = screen.getByRole('checkbox', { name: 'Select all' });
    await user.click(selectAll);

    const rowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select row' });
    rowCheckboxes.forEach((cb) => {
      expect(cb).toHaveAttribute('data-state', 'checked');
    });
  });

  it('shows selected count in toolbar', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={testData.slice(0, 3)}
        enableRowSelection
        aria-label="Test table"
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox', { name: 'Select row' });
    await user.click(checkboxes[0]);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('enables column visibility toggle', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={testData.slice(0, 3)}
        enableColumnVisibility
        aria-label="Test table"
      />,
    );

    const toggleBtn = screen.getByRole('button', { name: 'Toggle columns' });
    await user.click(toggleBtn);
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
  });

  it('enables sorting', async () => {
    const user = userEvent.setup();
    const data = [
      { id: 1, name: 'Charlie', status: 'Active' },
      { id: 2, name: 'Alice', status: 'Inactive' },
      { id: 3, name: 'Bob', status: 'Active' },
    ];
    render(
      <DataTable
        columns={sortableColumns}
        data={data}
        enableSorting
        aria-label="Test table"
      />,
    );

    // Click sort button for Name column
    await user.click(screen.getByRole('button', { name: 'Sort by Name' }));
    const cells = screen.getAllByRole('cell');
    const names = cells
      .filter((_, i) => i % 2 === 0)
      .map((c) => c.textContent);
    expect(names).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('changes page size', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={testData}
        enablePagination
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
        aria-label="Test table"
      />,
    );

    const select = screen.getByRole('combobox', { name: 'Rows per page' });
    await user.selectOptions(select, '5');
    expect(screen.getByText('1-5 of 25')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={testData.slice(0, 1)}
        className="custom-dt"
        aria-label="Test table"
      />,
    );
    expect(container.firstChild).toHaveClass('custom-dt');
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(
      <DataTable columns={columns} data={testData.slice(0, 3)} aria-label="Test table" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with pagination', async () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={testData}
        enablePagination
        pageSize={10}
        aria-label="Test table"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
