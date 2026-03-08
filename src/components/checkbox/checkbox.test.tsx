import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<Checkbox aria-label="Test" checked />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
  });

  it('handles unchecked state', () => {
    render(<Checkbox aria-label="Test" checked={false} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Test" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles disabled state', () => {
    render(<Checkbox aria-label="Test" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('forwards ref', () => {
    let ref: HTMLButtonElement | null = null;
    render(<Checkbox ref={(el) => { ref = el; }} aria-label="Test" />);
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className', () => {
    render(<Checkbox className="custom" aria-label="Test" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label>
          <Checkbox /> Accept terms
        </label>
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
