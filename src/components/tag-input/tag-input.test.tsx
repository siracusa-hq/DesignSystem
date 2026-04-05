import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TagInput, type TagInputOption } from './tag-input';

const options: TagInputOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

function renderTagInput(
  props?: Partial<React.ComponentProps<typeof TagInput>>,
) {
  const defaultProps = {
    options,
    value: [] as string[],
    onValueChange: vi.fn(),
    ...props,
  };
  return { ...render(<TagInput {...defaultProps} />), onValueChange: defaultProps.onValueChange };
}

describe('TagInput', () => {
  it('renders with placeholder when empty', () => {
    renderTagInput({ placeholder: 'Pick tags' });
    expect(screen.getByText('Pick tags')).toBeInTheDocument();
  });

  it('renders selected values as badges', () => {
    renderTagInput({ value: ['react', 'vue'] });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup();
    renderTagInput();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
    expect(screen.getByText('Svelte')).toBeInTheDocument();
  });

  it('selects an option on click', async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderTagInput();

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('React'));

    expect(onValueChange).toHaveBeenCalledWith(['react']);
  });

  it('deselects an already selected option', async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderTagInput({ value: ['react'] });

    await user.click(screen.getByRole('combobox'));
    // "React" appears both as badge and dropdown item, click the dropdown one
    const allReact = screen.getAllByText('React');
    await user.click(allReact[allReact.length - 1]);

    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it('removes tag via X button', async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderTagInput({ value: ['react', 'vue'] });

    await user.click(screen.getByLabelText('Remove React'));
    expect(onValueChange).toHaveBeenCalledWith(['vue']);
  });

  it('respects maxTags limit', async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderTagInput({
      value: ['react', 'vue'],
      maxTags: 2,
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Angular'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows overflow count with maxDisplayedTags', () => {
    renderTagInput({
      value: ['react', 'vue', 'angular'],
      maxDisplayedTags: 1,
    });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('Vue')).not.toBeInTheDocument();
  });

  it('shows create option when creatable', async () => {
    const user = userEvent.setup();
    renderTagInput({ creatable: true });

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'Solid');

    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    renderTagInput({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderTagInput({ value: ['react'], 'aria-label': 'Tags' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
