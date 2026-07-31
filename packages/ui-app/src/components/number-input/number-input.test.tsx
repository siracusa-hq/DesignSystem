import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { NumberInput } from './number-input';

describe('NumberInput', () => {
  it('renders an input', () => {
    render(<NumberInput aria-label="Amount" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays value', () => {
    render(<NumberInput aria-label="Amount" value={42} onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('42');
  });

  it('displays default value', () => {
    render(<NumberInput aria-label="Amount" defaultValue={10} />);
    expect(screen.getByRole('textbox')).toHaveValue('10');
  });

  it('renders increment and decrement buttons', () => {
    render(<NumberInput aria-label="Amount" />);
    expect(screen.getByLabelText('Increment')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrement')).toBeInTheDocument();
  });

  it('increments on button click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={5} onChange={onChange} />);
    await user.click(screen.getByLabelText('Increment'));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrements on button click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={5} onChange={onChange} />);
    await user.click(screen.getByLabelText('Decrement'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('disables decrement button at min', () => {
    render(<NumberInput aria-label="Amount" value={0} onChange={() => {}} min={0} />);
    expect(screen.getByLabelText('Decrement')).toBeDisabled();
  });

  it('disables increment button at max', () => {
    render(<NumberInput aria-label="Amount" value={10} onChange={() => {}} max={10} />);
    expect(screen.getByLabelText('Increment')).toBeDisabled();
  });

  it('clamps value to min on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Amount" defaultValue={5} onChange={onChange} min={0} />);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '-10');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('handles precision', () => {
    render(<NumberInput aria-label="Amount" value={3.14159} precision={2} onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('3.14');
  });

  it('handles disabled state', () => {
    render(<NumberInput aria-label="Amount" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.queryByLabelText('Increment')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    let ref: HTMLInputElement | null = null;
    render(<NumberInput ref={(el) => { ref = el; }} aria-label="Amount" />);
    expect(ref).toBeInstanceOf(HTMLInputElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="amount">Amount</label>
        <NumberInput id="amount" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
