import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Combobox } from './combobox';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Combobox', () => {
  it('renders a combobox trigger', () => {
    render(<Combobox options={options} aria-label="Fruit" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(<Combobox options={options} placeholder="Pick a fruit" aria-label="Fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  it('shows selected option label', () => {
    render(<Combobox options={options} value="banana" aria-label="Fruit" />);
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('opens on click', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} aria-label="Fruit" />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Combobox options={options} disabled aria-label="Fruit" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('forwards ref', () => {
    let ref: HTMLButtonElement | null = null;
    render(<Combobox ref={(el) => { ref = el; }} options={options} aria-label="Fruit" />);
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className', () => {
    render(<Combobox options={options} className="custom" aria-label="Fruit" />);
    expect(screen.getByRole('combobox')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label id="fruit-label">Fruit</label>
        <Combobox options={options} aria-labelledby="fruit-label" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
