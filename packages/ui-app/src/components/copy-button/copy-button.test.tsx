import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { CopyButton } from './copy-button';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('CopyButton', () => {
  it('renders with copy aria-label', () => {
    render(<CopyButton value="hello" />);
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toBeInTheDocument();
  });

  it('copies text to clipboard on click', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="hello world" />);

    await user.click(screen.getByRole('button'));
    // Verify copy happened by checking the state changed to "Copied"
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });
  });

  it('shows Copied label after copy', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="test" />);

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });
  });

  it('calls onCopy callback', async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();
    render(<CopyButton value="test" onCopy={onCopy} />);

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(onCopy).toHaveBeenCalled();
    });
  });

  it('resets after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<CopyButton value="test" timeout={1000} />);

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CopyButton value="a11y" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
