import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { EditableCell } from './editable-cell';

describe('EditableCell', () => {
  it('renders value text', () => {
    render(<EditableCell value="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('enters edit mode on click', async () => {
    const user = userEvent.setup();
    render(<EditableCell value="Hello" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Hello');
  });

  it('confirms with Enter key', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<EditableCell value="Hello" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'World{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('World');
  });

  it('cancels with Escape key', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<EditableCell value="Hello" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'World{Escape}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onValueChange with new value', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<EditableCell value="Old" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('New');
  });

  it('does not enter edit mode when disabled', async () => {
    const user = userEvent.setup();
    render(<EditableCell value="Hello" disabled />);
    await user.click(screen.getByText('Hello'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EditableCell value="Accessible" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
