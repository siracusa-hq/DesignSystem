import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import {
  PrintDocument,
  PrintHeader,
  PrintFooter,
  PrintTable,
  PrintTableHeader,
  PrintTableBody,
  PrintTableRow,
  PrintTableHead,
  PrintTableCell,
  PrintField,
  PrintFieldGroup,
  PrintDivider,
} from './index';

expect.extend(matchers);

/* ----------------------------------------------------------------
   PrintDocument
   ---------------------------------------------------------------- */

describe('PrintDocument', () => {
  it('renders children', () => {
    render(<PrintDocument>Report content</PrintDocument>);
    expect(screen.getByText('Report content')).toBeInTheDocument();
  });

  it('applies A4 size by default', () => {
    const { container } = render(<PrintDocument>Content</PrintDocument>);
    const doc = container.firstChild as HTMLElement;
    expect(doc.className).toContain('w-[210mm]');
    expect(doc.className).toContain('min-h-[297mm]');
  });

  it('applies Letter size', () => {
    const { container } = render(<PrintDocument size="Letter">Content</PrintDocument>);
    const doc = container.firstChild as HTMLElement;
    expect(doc.className).toContain('w-[8.5in]');
  });

  it('applies landscape orientation', () => {
    const { container } = render(
      <PrintDocument size="A4" orientation="landscape">Content</PrintDocument>,
    );
    const doc = container.firstChild as HTMLElement;
    expect(doc.className).toContain('w-[297mm]');
  });

  it('applies custom padding', () => {
    const { container } = render(<PrintDocument padding="15mm">Content</PrintDocument>);
    const doc = container.firstChild as HTMLElement;
    expect(doc.style.padding).toBe('15mm');
  });

  it('uses white background (light mode forced)', () => {
    const { container } = render(<PrintDocument>Content</PrintDocument>);
    const doc = container.firstChild as HTMLElement;
    expect(doc.className).toContain('bg-white');
    expect(doc.className).toContain('text-neutral-900');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<PrintDocument ref={ref}>Content</PrintDocument>);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PrintDocument>
        <PrintHeader title="Invoice" />
        <p>Content</p>
        <PrintFooter>Footer</PrintFooter>
      </PrintDocument>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ----------------------------------------------------------------
   PrintHeader
   ---------------------------------------------------------------- */

describe('PrintHeader', () => {
  it('renders title and subtitle', () => {
    render(<PrintHeader title="請求書" subtitle="Invoice" />);
    expect(screen.getByText('請求書')).toBeInTheDocument();
    expect(screen.getByText('Invoice')).toBeInTheDocument();
  });

  it('renders logo element', () => {
    render(<PrintHeader logo={<img src="logo.png" alt="Logo" />} title="Test" />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders meta info', () => {
    render(<PrintHeader title="Test" meta={<span>INV-001</span>} />);
    expect(screen.getByText('INV-001')).toBeInTheDocument();
  });

  it('has brand accent bar and bottom border', () => {
    const { container } = render(<PrintHeader title="Test" />);
    const header = container.firstChild as HTMLElement;
    // Accent bar as first child
    const accentBar = header.querySelector('.bg-primary-500');
    expect(accentBar).toBeInTheDocument();
    // Border on inner content area
    const innerContent = header.querySelector('.border-b');
    expect(innerContent).toBeInTheDocument();
  });
});

/* ----------------------------------------------------------------
   PrintFooter
   ---------------------------------------------------------------- */

describe('PrintFooter', () => {
  it('renders children', () => {
    render(<PrintFooter>Company Info</PrintFooter>);
    expect(screen.getByText('Company Info')).toBeInTheDocument();
  });

  it('has top border', () => {
    const { container } = render(<PrintFooter>Footer</PrintFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain('border-t');
  });

  it('pushes to bottom with mt-auto', () => {
    const { container } = render(<PrintFooter>Footer</PrintFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain('mt-auto');
  });
});

/* ----------------------------------------------------------------
   PrintTable
   ---------------------------------------------------------------- */

describe('PrintTable', () => {
  const renderTable = () =>
    render(
      <PrintTable>
        <PrintTableHeader>
          <PrintTableRow>
            <PrintTableHead>Item</PrintTableHead>
            <PrintTableHead align="right">Amount</PrintTableHead>
          </PrintTableRow>
        </PrintTableHeader>
        <PrintTableBody>
          <PrintTableRow>
            <PrintTableCell>Service A</PrintTableCell>
            <PrintTableCell align="right">¥100,000</PrintTableCell>
          </PrintTableRow>
        </PrintTableBody>
      </PrintTable>,
    );

  it('renders table with headers and cells', () => {
    renderTable();
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Service A')).toBeInTheDocument();
    expect(screen.getByText('¥100,000')).toBeInTheDocument();
  });

  it('applies right alignment to cells', () => {
    renderTable();
    const amountHead = screen.getByText('Amount');
    expect(amountHead.className).toContain('text-right');
    const amountCell = screen.getByText('¥100,000');
    expect(amountCell.className).toContain('text-right');
  });

  it('applies break-inside:avoid to rows', () => {
    renderTable();
    const rows = document.querySelectorAll('tr');
    rows.forEach((row) => {
      expect(row.className).toContain('[break-inside:avoid]');
    });
  });

  it('has header background styling', () => {
    renderTable();
    const header = screen.getByText('Item');
    expect(header.className).toContain('bg-neutral-50');
    expect(header.className).toContain('font-semibold');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderTable();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ----------------------------------------------------------------
   PrintField / PrintFieldGroup
   ---------------------------------------------------------------- */

describe('PrintField', () => {
  it('renders label and value', () => {
    render(<PrintField label="Company" value="Polastack Inc." />);
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Polastack Inc.')).toBeInTheDocument();
  });

  it('supports children as value', () => {
    render(<PrintField label="Address"><strong>Tokyo</strong></PrintField>);
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });
});

describe('PrintFieldGroup', () => {
  it('renders as grid with 2 columns by default', () => {
    const { container } = render(
      <PrintFieldGroup>
        <PrintField label="A" value="1" />
        <PrintField label="B" value="2" />
      </PrintFieldGroup>,
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain('grid-cols-2');
  });

  it('supports 3 columns', () => {
    const { container } = render(
      <PrintFieldGroup columns={3}>
        <PrintField label="A" value="1" />
      </PrintFieldGroup>,
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain('grid-cols-3');
  });

  it('uses dl element', () => {
    const { container } = render(
      <PrintFieldGroup>
        <PrintField label="A" value="1" />
      </PrintFieldGroup>,
    );
    expect(container.querySelector('dl')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PrintFieldGroup>
        <PrintField label="Name" value="Test" />
        <PrintField label="Email" value="test@example.com" />
      </PrintFieldGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ----------------------------------------------------------------
   PrintDivider
   ---------------------------------------------------------------- */

describe('PrintDivider', () => {
  it('renders hr element', () => {
    const { container } = render(<PrintDivider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLHRElement | null) => void>();
    render(<PrintDivider ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
