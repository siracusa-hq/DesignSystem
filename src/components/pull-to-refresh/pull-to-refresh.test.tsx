import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PullToRefresh } from './pull-to-refresh';

describe('PullToRefresh', () => {
  it('renders children', () => {
    render(
      <PullToRefresh onRefresh={async () => {}}>
        <p>Content</p>
      </PullToRefresh>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(
      <PullToRefresh ref={ref} onRefresh={async () => {}}>
        <p>Content</p>
      </PullToRefresh>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(
      <PullToRefresh
        className="custom-class"
        onRefresh={async () => {}}
        data-testid="ptr"
      >
        <p>Content</p>
      </PullToRefresh>,
    );
    expect(screen.getByTestId('ptr').className).toContain('custom-class');
  });
});
