import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Autocomplete, type AutocompleteOption, type AutocompleteProps } from './autocomplete';

type Fruit = { id: number };

const fruits: AutocompleteOption<Fruit>[] = [
  { value: 'apple', label: 'Apple', description: 'red', data: { id: 1 } },
  { value: 'apricot', label: 'Apricot', data: { id: 2 } },
  { value: 'banana', label: 'Banana', data: { id: 3 } },
];

function searchFruits(query: string) {
  return fruits.filter((f) => f.label.toLowerCase().startsWith(query.toLowerCase()));
}

type HarnessProps = Partial<Omit<AutocompleteProps<Fruit>, 'value' | 'onValueChange'>> & {
  loadOptions: AutocompleteProps<Fruit>['loadOptions'];
  initialValue?: string;
};

function Harness({ initialValue = '', ...props }: HarnessProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <Autocomplete<Fruit>
        aria-label="Fruit"
        value={value}
        onValueChange={setValue}
        debounceMs={0}
        {...props}
      />
      <output data-testid="value">{value}</output>
    </>
  );
}

describe('Autocomplete', () => {
  it('renders a combobox input without a list', () => {
    render(<Harness loadOptions={vi.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not query below minChars and queries once the threshold is reached', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async (q: string) => searchFruits(q));
    render(<Harness loadOptions={loadOptions} minChars={2} />);

    await user.type(screen.getByRole('combobox'), 'a');
    expect(loadOptions).not.toHaveBeenCalled();

    await user.type(screen.getByRole('combobox'), 'p');
    await waitFor(() => expect(loadOptions).toHaveBeenCalledWith('ap', expect.any(AbortSignal)));
    const options = await screen.findAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['Applered', 'Apricot']);
  });

  it('selects an option by click: fills the input, calls onSelect, closes the list', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness loadOptions={async (q) => searchFruits(q)} onSelect={onSelect} />);

    await user.type(screen.getByRole('combobox'), 'ap');
    await user.click(await screen.findByRole('option', { name: /Apricot/ }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'apricot', data: { id: 2 } }),
    );
    expect(screen.getByTestId('value')).toHaveTextContent('Apricot');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation: ArrowDown + Enter selects, Escape closes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness loadOptions={async (q) => searchFruits(q)} onSelect={onSelect} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'ap');
    await screen.findAllByRole('option');
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: /Apricot/ }).id,
    );
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'apricot' }));
    expect(screen.getByTestId('value')).toHaveTextContent('Apricot');

    await user.type(input, 'x');
    await user.type(input, 'y');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps the typed text when no option is chosen', async () => {
    const user = userEvent.setup();
    render(<Harness loadOptions={async () => []} />);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(await screen.findByText(/該当する候補がありません/)).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('zzz');
  });

  it('shows the error message when loading fails', async () => {
    const user = userEvent.setup();
    render(<Harness loadOptions={async () => Promise.reject(new Error('boom'))} />);
    await user.type(screen.getByRole('combobox'), 'ap');
    expect(await screen.findByRole('alert')).toHaveTextContent('候補の取得に失敗しました');
  });

  it('ignores stale responses and aborts the previous request', async () => {
    const user = userEvent.setup();
    const pending: Array<{
      query: string;
      signal: AbortSignal;
      resolve: (v: AutocompleteOption<Fruit>[]) => void;
    }> = [];
    const loadOptions = vi.fn(
      (query: string, signal: AbortSignal) =>
        new Promise<AutocompleteOption<Fruit>[]>((resolve) =>
          pending.push({ query, signal, resolve }),
        ),
    );
    render(<Harness loadOptions={loadOptions} />);

    await user.type(screen.getByRole('combobox'), 'ap');
    await waitFor(() => expect(pending).toHaveLength(1));
    await user.type(screen.getByRole('combobox'), 'r');
    await waitFor(() => expect(pending).toHaveLength(2));
    expect(pending[0]!.signal.aborted).toBe(true);

    pending[1]!.resolve(searchFruits('apr'));
    expect(await screen.findByRole('option', { name: /Apricot/ })).toBeInTheDocument();
    pending[0]!.resolve(searchFruits('ap')); // 古い応答が後から届いても捨てる
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
  });

  it('reuses results for the same query without calling loadOptions again', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async (q: string) => searchFruits(q));
    render(<Harness loadOptions={loadOptions} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'ap');
    await screen.findAllByRole('option');
    await user.clear(input);
    await user.type(input, 'ap');
    await screen.findAllByRole('option');
    expect(loadOptions).toHaveBeenCalledTimes(1);
  });

  it('renders custom option content via renderOption', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        loadOptions={async (q) => searchFruits(q)}
        renderOption={(option) => <strong>{option.label.toUpperCase()}</strong>}
      />,
    );
    await user.type(screen.getByRole('combobox'), 'ba');
    expect(await screen.findByRole('option', { name: 'BANANA' })).toBeInTheDocument();
  });

  it('has no a11y violations with the list open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness loadOptions={async (q) => searchFruits(q)} />);
    await user.type(screen.getByRole('combobox'), 'ap');
    await screen.findAllByRole('option');
    expect(await axe(container)).toHaveNoViolations();
  });
});
