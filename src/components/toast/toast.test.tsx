import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Toaster } from './toaster';
import { toast } from './use-toast';

function renderToaster() {
  return render(<Toaster />);
}

describe('Toast', () => {
  beforeEach(() => {
    // Clear existing toasts
    const { unmount } = renderToaster();
    unmount();
  });

  it('renders toast with title', () => {
    renderToaster();
    act(() => {
      toast({ title: 'Test Toast' });
    });
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
  });

  it('renders toast with description', () => {
    renderToaster();
    act(() => {
      toast({ title: 'Title', description: 'Description text' });
    });
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('dismisses toast', () => {
    renderToaster();
    let result: { dismiss: () => void };
    act(() => {
      result = toast({ title: 'Dismissable' });
    });
    expect(screen.getByText('Dismissable')).toBeInTheDocument();

    act(() => {
      result.dismiss();
    });
    // After dismiss, the toast should have data-state=closed
    // The actual removal happens after TOAST_REMOVE_DELAY
  });

  it('has no accessibility violations', async () => {
    const { container } = renderToaster();
    act(() => {
      toast({ title: 'A11y Toast', description: 'Testing accessibility' });
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
