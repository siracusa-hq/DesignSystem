import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders with role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('has sr-only loading text', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders SVG with 8 bar segments', () => {
    render(<Spinner />);
    const svg = screen.getByRole('status').querySelector('svg')!;
    expect(svg).toBeInTheDocument();
    const rects = svg.querySelectorAll('rect');
    expect(rects).toHaveLength(8);
  });

  it('applies size variants', () => {
    const { rerender } = render(<Spinner size="sm" />);
    let svg = screen.getByRole('status').querySelector('svg')!;
    expect(svg.className.baseVal || svg.getAttribute('class')).toContain('h-4');

    rerender(<Spinner size="lg" />);
    svg = screen.getByRole('status').querySelector('svg')!;
    expect(svg.className.baseVal || svg.getAttribute('class')).toContain('h-8');
  });

  it('each bar has animation delay', () => {
    render(<Spinner />);
    const rects = screen.getByRole('status').querySelectorAll('rect');
    rects.forEach((rect, i) => {
      expect(rect.style.animationDelay).toBe(`${-i * 0.1}s`);
    });
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<Spinner ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
