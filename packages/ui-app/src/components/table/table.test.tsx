import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

function renderTable() {
  return render(
    <Table>
      <TableCaption>A list of items</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Item 1</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Item 2</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total: 2</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );
}

describe('Table', () => {
  it('renders all sub-components', () => {
    renderTable();
    expect(screen.getByText('A list of items')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Total: 2')).toBeInTheDocument();
  });

  it('renders proper HTML structure', () => {
    renderTable();
    const table = screen.getByRole('table');
    expect(table.querySelector('thead')).toBeInTheDocument();
    expect(table.querySelector('tbody')).toBeInTheDocument();
    expect(table.querySelector('tfoot')).toBeInTheDocument();
    expect(table.querySelector('caption')).toBeInTheDocument();
  });

  it('applies hover styles class on rows', () => {
    renderTable();
    const rows = screen.getAllByRole('row');
    // body rows (index 1 and 2) should have hover class
    expect(rows[1].className).toContain('hover:bg-[var(--color-surface-muted)]');
  });

  it('supports data-state=selected on rows', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>Selected</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const row = screen.getByRole('row');
    expect(row).toHaveAttribute('data-state', 'selected');
  });

  it('wraps table in overflow container', () => {
    renderTable();
    const table = screen.getByRole('table');
    expect(table.parentElement?.className).toContain('overflow-auto');
  });

  it('merges custom className', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table').className).toContain('custom-table');
  });

  it('forwards ref on Table', () => {
    const ref = { current: null } as React.RefObject<HTMLTableElement>;
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('passes axe accessibility check', async () => {
    const { container } = renderTable();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
