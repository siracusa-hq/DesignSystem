import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
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

  it('lays out children with a standard gap', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('flex');
    expect(dialog.className).toContain('flex-col');
    expect(dialog.className).toContain('gap-6');
  });

  it('keeps the close button out of the flex flow', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('button', { name: 'Close' }).className).toContain('absolute');
  });

  it('keeps footer button order classes', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const footer = screen.getByText('Save').parentElement!;
    expect(footer.className).toContain('flex-col-reverse');
    expect(footer.className).toContain('sm:flex-row');
    expect(footer.className).toContain('sm:justify-end');
  });

  it('renders DialogBody as a scrollable region', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
          <DialogBody className="custom-body">Long body</DialogBody>
          <DialogFooter>
            <button>OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const body = screen.getByText('Long body');
    expect(body.className).toContain('flex-1');
    expect(body.className).toContain('min-h-0');
    expect(body.className).toContain('overflow-y-auto');
    expect(body.className).toContain('custom-body');
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
