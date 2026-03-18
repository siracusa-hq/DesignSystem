import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ChartContainer } from './chart-container';

describe('ChartContainer', () => {
  it('renders title and children', () => {
    render(
      <ChartContainer title="Revenue Over Time">
        <div data-testid="chart">chart here</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Revenue Over Time')).toBeInTheDocument();
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <ChartContainer title="Sales" description="Last 30 days">
        <div>chart</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(
      <ChartContainer title="Chart" actions={<button type="button">Export</button>}>
        <div>chart</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ChartContainer title="Revenue" description="Monthly breakdown">
        <div>chart placeholder</div>
      </ChartContainer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
