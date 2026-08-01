import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription, AlertAction } from './alert';

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is a description.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
    expect(screen.getByText('This is a description.')).toBeInTheDocument();
  });

  it('renders with an icon', () => {
    render(
      <Alert>
        <Info data-testid="icon" />
        <AlertTitle>Info</AlertTitle>
      </Alert>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action slot', () => {
    render(
      <Alert>
        <AlertTitle>Update</AlertTitle>
        <AlertAction>
          <button>Retry</button>
        </AlertAction>
      </Alert>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Alert>Default</Alert>);
    const el = screen.getByRole('alert');
    expect(el.className).toContain('bg-[var(--color-surface-raised)]');
  });

  it('applies info variant', () => {
    render(<Alert variant="info">Info</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-info-50');
  });

  it('applies success variant', () => {
    render(<Alert variant="success">Success</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-success-50');
  });

  it('applies warning variant', () => {
    render(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-warning-50');
  });

  it('applies destructive variant', () => {
    render(<Alert variant="destructive">Error</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-error-50');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<Alert ref={ref}>Ref</Alert>);
    expect(ref).toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Alert className="custom-class">Custom</Alert>);
    expect(screen.getByRole('alert').className).toContain('custom-class');
  });

  it('has no accessibility violations (default)', async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (info with icon)', async () => {
    const { container } = render(
      <Alert variant="info">
        <Info />
        <AlertTitle>Info alert</AlertTitle>
        <AlertDescription>Some info here.</AlertDescription>
      </Alert>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (destructive with icon)', async () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
