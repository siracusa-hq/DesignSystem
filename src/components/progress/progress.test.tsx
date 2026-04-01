import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Progress } from './progress';

describe('Progress', () => {
  it('renders a progressbar', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the provided value', () => {
    render(<Progress value={60} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '60',
    );
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<Progress value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    rerender(<Progress value={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  it('renders each variant', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Progress value={50} variant={variant} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      unmount();
    });
  });

  it('renders each size', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(<Progress value={50} size={size} />);
      const bar = screen.getByRole('progressbar');
      if (size === 'sm') expect(bar.className).toContain('h-1.5');
      if (size === 'md') expect(bar.className).toContain('h-2.5');
      if (size === 'lg') expect(bar.className).toContain('h-4');
      unmount();
    });
  });

  it('renders indeterminate when value is null', () => {
    render(<Progress value={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('renders indeterminate when value is undefined', () => {
    render(<Progress />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('shows percentage label when showLabel is true', () => {
    render(<Progress value={73} showLabel />);
    expect(screen.getByText('73%')).toBeInTheDocument();
  });

  it('shows custom label via render function', () => {
    render(
      <Progress value={50} showLabel={(v) => `${v} of 100`} />,
    );
    expect(screen.getByText('50 of 100')).toBeInTheDocument();
  });

  it('renders label at top position', () => {
    render(<Progress value={50} showLabel labelPosition="top" />);
    const label = screen.getByText('50%');
    // Label should be before the progressbar in DOM
    const bar = screen.getByRole('progressbar');
    expect(
      label.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null;
    render(
      <Progress
        value={50}
        ref={(el) => {
          ref = el;
        }}
      />,
    );
    expect(ref).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    render(<Progress value={50} className="custom-class" />);
    expect(screen.getByRole('progressbar').className).toContain('custom-class');
  });

  it('has no accessibility violations (determinate)', async () => {
    const { container } = render(<Progress value={50} aria-label="Upload progress" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (indeterminate)', async () => {
    const { container } = render(
      <Progress value={null} aria-label="Loading" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
