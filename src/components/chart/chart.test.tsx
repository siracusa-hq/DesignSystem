import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getChartColors, getChartTheme } from './chart-theme';
import { ChartTooltip } from './chart-tooltip';
import { ChartLegend } from './chart-legend';

/* ----------------------------------------------------------------
   getChartColors / getChartTheme
   ---------------------------------------------------------------- */

describe('getChartColors', () => {
  it('returns an array of 8 colors', () => {
    const colors = getChartColors();
    expect(colors).toHaveLength(8);
    colors.forEach((c) => expect(c).toMatch(/^#[0-9a-fA-F]{6}$/));
  });
});

describe('getChartTheme', () => {
  it('returns theme object with expected keys', () => {
    const theme = getChartTheme();
    expect(theme).toHaveProperty('gridColor');
    expect(theme).toHaveProperty('axisColor');
    expect(theme).toHaveProperty('textColor');
    expect(theme).toHaveProperty('tooltipBg');
    expect(theme).toHaveProperty('tooltipBorder');
    expect(theme).toHaveProperty('fontSize');
    expect(theme).toHaveProperty('fontFamily');
    expect(theme.fontSize).toBe(12);
  });
});

/* ----------------------------------------------------------------
   ChartTooltip
   ---------------------------------------------------------------- */

describe('ChartTooltip', () => {
  const payload = [
    { name: 'Revenue', value: 1234, color: '#13C3A0', dataKey: 'revenue' },
    { name: 'Cost', value: 567, color: '#ef4444', dataKey: 'cost' },
  ];

  it('renders nothing when inactive', () => {
    const { container } = render(
      <ChartTooltip active={false} payload={payload} label="Jan" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when payload is empty', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={[]} label="Jan" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders label and entries when active', () => {
    render(
      <ChartTooltip active={true} payload={payload} label="January" />,
    );
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('uses custom formatter', () => {
    render(
      <ChartTooltip
        active={true}
        payload={payload}
        label="Jan"
        formatter={(v) => `¥${v.toLocaleString()}`}
      />,
    );
    expect(screen.getByText('¥1,234')).toBeInTheDocument();
  });

  it('uses custom labelFormatter', () => {
    render(
      <ChartTooltip
        active={true}
        payload={payload}
        label="2026-01"
        labelFormatter={(l) => `Period: ${l}`}
      />,
    );
    expect(screen.getByText('Period: 2026-01')).toBeInTheDocument();
  });

  it('renders color indicators', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={payload} label="Jan" />,
    );
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(2);
    expect((dots[0] as HTMLElement).style.backgroundColor).toBe(
      'rgb(19, 195, 160)',
    );
  });
});

/* ----------------------------------------------------------------
   ChartLegend
   ---------------------------------------------------------------- */

describe('ChartLegend', () => {
  const payload = [
    { value: 'Revenue', color: '#13C3A0' },
    { value: 'Cost', color: '#ef4444' },
  ];

  it('renders nothing when payload is empty', () => {
    const { container } = render(<ChartLegend payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders legend entries', () => {
    render(<ChartLegend payload={payload} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders color dots', () => {
    const { container } = render(<ChartLegend payload={payload} />);
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(2);
  });
});
