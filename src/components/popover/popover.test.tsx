import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Popover, PopoverTrigger, PopoverContent } from './popover';

function renderPopover() {
  return render(
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>,
  );
}

describe('Popover', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes on trigger click when open', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.click(screen.getByText('Open'));
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="custom-popover">Content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Content').closest('[role]')?.className ?? screen.getByText('Content').className).toContain('custom-popover');
  });

  it('passes axe accessibility check when open', async () => {
    const user = userEvent.setup();
    const { container } = renderPopover();

    await user.click(screen.getByText('Open'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
