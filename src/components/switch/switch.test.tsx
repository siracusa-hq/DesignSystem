import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders a switch', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<Switch aria-label="Toggle" checked />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
  });

  it('handles unchecked state', () => {
    render(<Switch aria-label="Toggle" checked={false} />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('applies size variants', () => {
    const { rerender } = render(<Switch aria-label="Toggle" size="sm" />);
    expect(screen.getByRole('switch').className).toContain('h-4');

    rerender(<Switch aria-label="Toggle" size="lg" />);
    expect(screen.getByRole('switch').className).toContain('h-6');
  });

  it('handles disabled state', () => {
    render(<Switch aria-label="Toggle" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('forwards ref', () => {
    let ref: HTMLButtonElement | null = null;
    render(<Switch ref={(el) => { ref = el; }} aria-label="Toggle" />);
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className', () => {
    render(<Switch className="custom" aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <label>
        <Switch /> Enable notifications
      </label>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
