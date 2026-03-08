import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea aria-label="test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('applies size variants', () => {
    const { rerender } = render(<Textarea aria-label="test" size="sm" />);
    expect(screen.getByRole('textbox').className).toContain('min-h-[60px]');

    rerender(<Textarea aria-label="test" size="lg" />);
    expect(screen.getByRole('textbox').className).toContain('min-h-[100px]');
  });

  it('handles placeholder', () => {
    render(<Textarea placeholder="Enter text" aria-label="test" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Textarea disabled aria-label="test" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="test" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('accepts rows prop', () => {
    render(<Textarea aria-label="test" rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('forwards ref', () => {
    let ref: HTMLTextAreaElement | null = null;
    render(<Textarea ref={(el) => { ref = el; }} aria-label="test" />);
    expect(ref).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('merges className', () => {
    render(<Textarea className="custom" aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-textarea">Description</label>
        <Textarea id="test-textarea" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
