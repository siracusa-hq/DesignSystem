import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  getChartColors,
  getChartSubtleColors,
  getChartTheme,
  axisDefaults,
  gridDefaults,
  INACTIVE_OPACITY,
  ACTIVE_DOT_RADIUS,
} from './chart-theme';
import { ChartTooltip } from './chart-tooltip';
import { ChartLegend } from './chart-legend';

/* ----------------------------------------------------------------
   getChartColors / getChartSubtleColors / getChartTheme
   ---------------------------------------------------------------- */

describe('getChartColors', () => {
  it('returns an array of 5 CSS variable references', () => {
    const colors = getChartColors();
    expect(colors).toHaveLength(5);
    colors.forEach((c) => expect(c).toMatch(/^var\(--color-chart-\d\)$/));
  });
});

describe('getChartSubtleColors', () => {
  it('returns an array of 5 CSS variable references', () => {
    const colors = getChartSubtleColors();
    expect(colors).toHaveLength(5);
    colors.forEach((c) => expect(c).toMatch(/^var\(--color-chart-\d-subtle\)$/));
  });
});

describe('getChartTheme', () => {
  it('returns theme object with expected keys', () => {
    const theme = getChartTheme();
    expect(theme).toHaveProperty('gridColor');
    expect(theme).toHaveProperty('textColor');
    expect(theme).toHaveProperty('cursorStroke');
    expect(theme).toHaveProperty('fontSize');
    expect(theme).toHaveProperty('fontFamily');
    expect(theme.fontSize).toBe(12);
  });

  it('returns CSS variable references for colors', () => {
    const theme = getChartTheme();
    expect(theme.gridColor).toMatch(/^var\(/);
    expect(theme.textColor).toMatch(/^var\(/);
    expect(theme.cursorStroke).toMatch(/^var\(/);
  });
});

describe('axisDefaults', () => {
  it('hides axis line and tick line', () => {
    expect(axisDefaults.axisLine).toBe(false);
    expect(axisDefaults.tickLine).toBe(false);
    expect(axisDefaults.tickMargin).toBe(8);
  });
});

describe('gridDefaults', () => {
  it('uses horizontal-only dashed grid', () => {
    expect(gridDefaults.vertical).toBe(false);
    expect(gridDefaults.strokeDasharray).toBe('4 4');
    expect(gridDefaults.strokeOpacity).toBe(0.5);
  });
});

describe('constants', () => {
  it('exports correct interaction constants', () => {
    expect(INACTIVE_OPACITY).toBe(0.3);
    expect(ACTIVE_DOT_RADIUS).toBe(5);
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

  it('renders rounded-square color indicators by default', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={payload} label="Jan" />,
    );
    const dots = container.querySelectorAll('.rounded-\\[2px\\]');
    expect(dots).toHaveLength(2);
    expect((dots[0] as HTMLElement).style.backgroundColor).toBe(
      'rgb(19, 195, 160)',
    );
  });

  it('renders line indicator variant', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={payload} label="Jan" indicator="line" />,
    );
    const lines = container.querySelectorAll('.w-1');
    expect(lines).toHaveLength(2);
  });

  it('renders dashed indicator variant', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={payload} label="Jan" indicator="dashed" />,
    );
    const dashed = container.querySelectorAll('.border-dashed');
    expect(dashed).toHaveLength(2);
  });

  it('applies shadow-xl for elevated appearance', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={payload} label="Jan" />,
    );
    const tooltip = container.firstElementChild;
    expect(tooltip?.className).toContain('shadow-xl');
  });

  it('uses grid layout for value alignment', () => {
    const { container } = render(
      <ChartTooltip active={true} payload={payload} label="Jan" />,
    );
    const grid = container.querySelector('.grid');
    expect(grid).toBeTruthy();
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

  it('renders rounded-square color indicators', () => {
    const { container } = render(<ChartLegend payload={payload} />);
    const dots = container.querySelectorAll('.rounded-\\[2px\\]');
    expect(dots).toHaveLength(2);
  });
});
