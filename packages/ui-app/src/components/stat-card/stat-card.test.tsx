import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Revenue" value="¥1,234" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('¥1,234')).toBeInTheDocument();
  });

  it('renders trend with inferred direction', () => {
    render(<StatCard label="Growth" value="24" trend="+12.5%" />);
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('+12.5%').className).toContain('text-success');
  });

  it('renders negative trend', () => {
    render(<StatCard label="Issues" value="7" trend="-3" />);
    expect(screen.getByText('-3').className).toContain('text-error');
  });

  it('supports explicit trendDirection override', () => {
    render(<StatCard label="Cost" value="¥500" trend="-10%" trendDirection="up" />);
    expect(screen.getByText('-10%').className).toContain('text-success');
  });

  it('renders icon when provided', () => {
    render(<StatCard label="Users" value="42" icon={<span data-testid="icon">$</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <StatCard label="Active Projects" value="12" trend="+2" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
