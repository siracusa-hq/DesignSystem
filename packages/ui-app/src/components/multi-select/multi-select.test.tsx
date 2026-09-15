import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { MultiSelect } from './multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian' },
  { value: 'elderberry', label: 'Elderberry' },
];

describe('MultiSelect', () => {
  it('renders a combobox trigger', () => {
    render(<MultiSelect options={options} aria-label="Fruits" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder when nothing selected', () => {
    render(
      <MultiSelect
        options={options}
        placeholder="Pick fruits"
        aria-label="Fruits"
      />,
    );
    expect(screen.getByText('Pick fruits')).toBeInTheDocument();
  });

  it('shows selected values as tags', () => {
    render(
      <MultiSelect
        options={options}
        value={['apple', 'cherry']}
        aria-label="Fruits"
      />,
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('collapses tags beyond maxDisplay into +N', () => {
    render(
      <MultiSelect
        options={options}
        value={['apple', 'banana', 'cherry', 'durian', 'elderberry']}
        maxDisplay={3}
        aria-label="Fruits"
      />,
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
    expect(screen.queryByText('Durian')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('opens with a search input on click', async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} aria-label="Fruits" />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
  });

  it('adds a value on option select', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={['apple']}
        onValueChange={onValueChange}
        aria-label="Fruits"
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onValueChange).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('removes a value when an already-selected option is selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={['apple', 'banana']}
        onValueChange={onValueChange}
        aria-label="Fruits"
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onValueChange).toHaveBeenCalledWith(['banana']);
  });

  it('keeps the menu open after selecting', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect options={options} onValueChange={() => {}} aria-label="Fruits" />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
  });

  it('filters options by search text', async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} aria-label="Fruits" />);
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('検索...'), 'ban');
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Apple' }),
    ).not.toBeInTheDocument();
  });

  it('shows empty message when no option matches', async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} aria-label="Fruits" />);
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('検索...'), 'zzz');
    expect(screen.getByText('見つかりませんでした')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<MultiSelect options={options} disabled aria-label="Fruits" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('forwards ref', () => {
    let ref: HTMLButtonElement | null = null;
    render(
      <MultiSelect
        ref={(el) => {
          ref = el;
        }}
        options={options}
        aria-label="Fruits"
      />,
    );
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className', () => {
    render(
      <MultiSelect options={options} className="custom" aria-label="Fruits" />,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <label id="fruits-label">Fruits</label>
        <MultiSelect
          options={options}
          value={['apple']}
          aria-label="Fruits"
        />
      </div>,
    );
    await user.click(screen.getByRole('combobox'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
