import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from './empty-state';

describe('EmptyState', () => {
  it('renders all sub-components', () => {
    render(
      <EmptyState>
        <EmptyStateIcon>
          <svg data-testid="icon" />
        </EmptyStateIcon>
        <EmptyStateTitle>No data</EmptyStateTitle>
        <EmptyStateDescription>Try again later.</EmptyStateDescription>
        <EmptyStateActions>
          <button>Retry</button>
        </EmptyStateActions>
      </EmptyState>,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Try again later.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('renders with only title', () => {
    render(
      <EmptyState>
        <EmptyStateTitle>Empty</EmptyStateTitle>
      </EmptyState>,
    );
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('applies sm size variant', () => {
    const { container } = render(
      <EmptyState size="sm">
        <EmptyStateTitle>Small</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstChild).toHaveClass('py-8');
  });

  it('applies md size variant by default', () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateTitle>Medium</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstChild).toHaveClass('py-12');
  });

  it('applies lg size variant', () => {
    const { container } = render(
      <EmptyState size="lg">
        <EmptyStateTitle>Large</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstChild).toHaveClass('py-20');
  });

  it('merges custom className', () => {
    const { container } = render(
      <EmptyState className="custom-class">
        <EmptyStateTitle>Test</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <EmptyState ref={ref}>
        <EmptyStateTitle>Test</EmptyStateTitle>
      </EmptyState>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateTitle>No results</EmptyStateTitle>
        <EmptyStateDescription>Try different filters.</EmptyStateDescription>
      </EmptyState>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
