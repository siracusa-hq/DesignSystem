import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-primary-100');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toContain('bg-success-100');
  });

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').className).toContain('bg-warning-100');
  });

  it('applies error variant', () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('bg-error-100');
  });

  it('applies info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').className).toContain('bg-info-100');
  });

  it('applies outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline').className).toContain('border');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLSpanElement | null) => void>();
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref).toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Badge className="custom">Custom</Badge>);
    expect(screen.getByText('Custom').className).toContain('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Accessible</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
