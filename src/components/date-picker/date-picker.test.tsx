import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('renders a date input', () => {
    render(<DatePicker aria-label="Date" />);
    const input = screen.getByLabelText('Date');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('applies size variants', () => {
    render(<DatePicker aria-label="Date" size="sm" />);
    const input = screen.getByLabelText('Date');
    expect(input.className).toContain('h-8');
  });

  it('handles min and max', () => {
    render(<DatePicker aria-label="Date" min="2024-01-01" max="2024-12-31" />);
    const input = screen.getByLabelText('Date');
    expect(input).toHaveAttribute('min', '2024-01-01');
    expect(input).toHaveAttribute('max', '2024-12-31');
  });

  it('handles disabled state', () => {
    render(<DatePicker aria-label="Date" disabled />);
    expect(screen.getByLabelText('Date')).toBeDisabled();
  });

  it('forwards ref', () => {
    let ref: HTMLInputElement | null = null;
    render(<DatePicker ref={(el) => { ref = el; }} aria-label="Date" />);
    expect(ref).toBeInstanceOf(HTMLInputElement);
  });

  it('merges className', () => {
    render(<DatePicker className="custom" aria-label="Date" />);
    expect(screen.getByLabelText('Date')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="date">Date</label>
        <DatePicker id="date" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
