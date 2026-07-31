import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders horizontal by default', () => {
    render(<Separator />);
    const sep = screen.getByRole('separator');
    expect(sep.className).toContain('h-px');
    expect(sep.className).toContain('w-full');
  });

  it('renders vertical', () => {
    render(<Separator orientation="vertical" />);
    const sep = screen.getByRole('separator');
    expect(sep.className).toContain('w-px');
  });

  it('has role="separator" by default', () => {
    render(<Separator />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('has role="none" when decorative', () => {
    render(<Separator decorative data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('role', 'none');
  });

  it('sets aria-orientation', () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('does not set aria-orientation when decorative', () => {
    render(<Separator decorative data-testid="sep" />);
    expect(screen.getByTestId('sep')).not.toHaveAttribute('aria-orientation');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<Separator ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Separator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
