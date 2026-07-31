import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

function renderDialog(props?: { defaultOpen?: boolean }) {
  return render(
    <Dialog defaultOpen={props?.defaultOpen}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description text</DialogDescription>
        </DialogHeader>
        <div>Dialog body</div>
        <DialogFooter>
          <button>Cancel</button>
          <button>Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  );
}

describe('Dialog', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });

  it('closes on close button click', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Title')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Title')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('renders as dialog role', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title as heading', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
  });

  it('renders header and footer', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogTitle>Test</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog').className).toContain('custom-dialog');
  });

  it('renders responsive classes', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const dialog = screen.getByRole('dialog');
    // Should have mobile full-screen + desktop centered classes
    expect(dialog.className).toContain('inset-0');
    expect(dialog.className).toContain('sm:max-w-lg');
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
