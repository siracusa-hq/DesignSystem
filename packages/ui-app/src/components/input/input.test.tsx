import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input aria-label="test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { rerender } = render(<Input aria-label="test" size="sm" />);
    expect(screen.getByRole('textbox').className).toContain('h-8');

    rerender(<Input aria-label="test" size="lg" />);
    expect(screen.getByRole('textbox').className).toContain('h-10');
  });

  it('applies default size', () => {
    render(<Input aria-label="test" />);
    expect(screen.getByRole('textbox').className).toContain('h-9');
  });

  it('handles type prop', () => {
    render(<Input type="email" aria-label="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('handles placeholder', () => {
    render(<Input placeholder="Enter text" aria-label="test" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Input disabled aria-label="test" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="test" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref', () => {
    let ref: HTMLInputElement | null = null;
    render(<Input ref={(el) => { ref = el; }} aria-label="test" />);
    expect(ref).toBeInstanceOf(HTMLInputElement);
  });

  it('merges className', () => {
    render(<Input className="custom" aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });

  it('supports aria-invalid for error styling', () => {
    render(<Input aria-invalid="true" aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-input">Name</label>
        <Input id="test-input" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
