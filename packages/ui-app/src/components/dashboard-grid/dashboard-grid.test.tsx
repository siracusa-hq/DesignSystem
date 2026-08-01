import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DashboardGrid, DashboardSection, DashboardPanel } from './dashboard-grid';

/* ── DashboardGrid ─────────────────────────────────────────────── */

describe('DashboardGrid', () => {
  it('renders children', () => {
    render(<DashboardGrid>content</DashboardGrid>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies 12-column grid class', () => {
    const { container } = render(<DashboardGrid>x</DashboardGrid>);
    expect(container.firstElementChild!.className).toContain('grid-cols-12');
  });

  it('applies default gap (md = gap-4)', () => {
    const { container } = render(<DashboardGrid>x</DashboardGrid>);
    expect(container.firstElementChild!.className).toContain('gap-4');
  });

  it('applies sm gap variant', () => {
    const { container } = render(<DashboardGrid gap="sm">x</DashboardGrid>);
    expect(container.firstElementChild!.className).toContain('gap-3');
  });

  it('applies lg gap variant', () => {
    const { container } = render(<DashboardGrid gap="lg">x</DashboardGrid>);
    expect(container.firstElementChild!.className).toContain('gap-6');
  });

  it('sets --dashboard-row-height CSS variable (default 80px)', () => {
    const { container } = render(<DashboardGrid>x</DashboardGrid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--dashboard-row-height')).toBe('80px');
  });

  it('sets custom rowHeight', () => {
    const { container } = render(<DashboardGrid rowHeight={100}>x</DashboardGrid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--dashboard-row-height')).toBe('100px');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DashboardGrid ref={ref}>x</DashboardGrid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges className', () => {
    const { container } = render(<DashboardGrid className="custom">x</DashboardGrid>);
    expect(container.firstElementChild!.className).toContain('custom');
    expect(container.firstElementChild!.className).toContain('grid-cols-12');
  });
});

/* ── DashboardSection ──────────────────────────────────────────── */

describe('DashboardSection', () => {
  it('renders as <section> element', () => {
    const { container } = render(<DashboardSection>content</DashboardSection>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('spans full width (col-span-12)', () => {
    const { container } = render(<DashboardSection>x</DashboardSection>);
    expect(container.firstElementChild!.className).toContain('col-span-12');
  });

  it('renders title as heading', () => {
    render(<DashboardSection title="KPI">x</DashboardSection>);
    expect(screen.getByRole('heading', { name: 'KPI' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<DashboardSection title="KPI" description="Key metrics">x</DashboardSection>);
    expect(screen.getByText('Key metrics')).toBeInTheDocument();
  });

  it('omits heading markup when no title', () => {
    const { container } = render(<DashboardSection>x</DashboardSection>);
    expect(container.querySelector('h2')).toBeNull();
  });

  it('has role=region with aria-labelledby when title is present', () => {
    render(<DashboardSection title="Charts">x</DashboardSection>);
    const section = screen.getByRole('region', { name: 'Charts' });
    expect(section).toBeInTheDocument();
  });

  it('does not have role=region when no title', () => {
    const { container } = render(<DashboardSection>x</DashboardSection>);
    const section = container.querySelector('section')!;
    expect(section.getAttribute('role')).toBeNull();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<DashboardSection ref={ref}>x</DashboardSection>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DashboardSection title="Metrics" description="Key performance indicators">
        <div>Panel content</div>
      </DashboardSection>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ── DashboardPanel ────────────────────────────────────────────── */

describe('DashboardPanel', () => {
  it('renders children', () => {
    render(<DashboardPanel>content</DashboardPanel>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies default col-span-12', () => {
    const { container } = render(<DashboardPanel>x</DashboardPanel>);
    expect(container.firstElementChild!.className).toContain('col-span-12');
  });

  it('applies numeric colSpan', () => {
    const { container } = render(<DashboardPanel colSpan={6}>x</DashboardPanel>);
    expect(container.firstElementChild!.className).toContain('col-span-6');
  });

  it('applies responsive colSpan object', () => {
    const { container } = render(
      <DashboardPanel colSpan={{ default: 12, md: 6, lg: 4 }}>x</DashboardPanel>,
    );
    const cls = container.firstElementChild!.className;
    expect(cls).toContain('col-span-12');
    expect(cls).toContain('md:col-span-6');
    expect(cls).toContain('lg:col-span-4');
  });

  it('applies rowSpan via inline style', () => {
    const { container } = render(<DashboardPanel rowSpan={3}>x</DashboardPanel>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridRow).toBe('span 3');
  });

  it('sets minHeight based on rowSpan', () => {
    const { container } = render(<DashboardPanel rowSpan={2}>x</DashboardPanel>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.minHeight).toBe('calc(2 * var(--dashboard-row-height, 80px))');
  });

  it('does not set rowSpan styles when rowSpan is not provided', () => {
    const { container } = render(<DashboardPanel>x</DashboardPanel>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridRow).toBe('');
  });

  it('sets data-min-col-span when minColSpan is provided', () => {
    const { container } = render(<DashboardPanel minColSpan={3}>x</DashboardPanel>);
    expect(container.firstElementChild!.getAttribute('data-min-col-span')).toBe('3');
  });

  it('does not set data-min-col-span when not provided', () => {
    const { container } = render(<DashboardPanel>x</DashboardPanel>);
    expect(container.firstElementChild!.hasAttribute('data-min-col-span')).toBe(false);
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DashboardPanel ref={ref}>x</DashboardPanel>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges className', () => {
    const { container } = render(<DashboardPanel className="custom" colSpan={4}>x</DashboardPanel>);
    const cls = container.firstElementChild!.className;
    expect(cls).toContain('custom');
    expect(cls).toContain('col-span-4');
  });
});
