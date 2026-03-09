import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  DrawerProvider,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from './drawer';

function renderDrawer(props?: {
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pinnable?: boolean;
}) {
  return render(
    <Drawer
      side={props?.side}
      pinnable={props?.pinnable}
    >
      <DrawerTrigger>Open Drawer</DrawerTrigger>
      <DrawerContent size={props?.size}>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
        <div className="p-6">Drawer body content</div>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
          <button>Save</button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  );
}

describe('Drawer', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Drawer body content')).toBeInTheDocument();
  });

  it('closes on close button', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument();
  });

  it('renders on right side by default', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('right-0');
  });

  it('renders on left side', async () => {
    const user = userEvent.setup();
    renderDrawer({ side: 'left' });

    await user.click(screen.getByText('Open Drawer'));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('left-0');
  });

  it('applies sm size', async () => {
    const user = userEvent.setup();
    renderDrawer({ size: 'sm' });

    await user.click(screen.getByText('Open Drawer'));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('w-80');
  });

  it('applies lg size', async () => {
    const user = userEvent.setup();
    renderDrawer({ size: 'lg' });

    await user.click(screen.getByText('Open Drawer'));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('w-[640px]');
  });

  it('renders footer', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders pin button when pinnable', async () => {
    const user = userEvent.setup();
    renderDrawer({ pinnable: true });

    await user.click(screen.getByText('Open Drawer'));
    expect(screen.getByRole('button', { name: 'Pin drawer' })).toBeInTheDocument();
  });

  it('does not render pin button by default', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    expect(screen.queryByRole('button', { name: 'Pin drawer' })).not.toBeInTheDocument();
  });

  it('calls onPinnedChange when pin clicked', async () => {
    const user = userEvent.setup();
    const onPinnedChange = vi.fn();
    render(
      <Drawer pinnable onPinnedChange={onPinnedChange}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByText('Open'));
    await user.click(screen.getByRole('button', { name: 'Pin drawer' }));
    expect(onPinnedChange).toHaveBeenCalledWith(true);
  });

  it('renders in pinned mode without dialog', () => {
    render(
      <Drawer open pinned>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Pinned</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );
    // Pinned renders as a div, not a dialog
    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('works with DrawerProvider for stacking', async () => {
    const user = userEvent.setup();
    render(
      <DrawerProvider>
        <Drawer>
          <DrawerTrigger>Open 1</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer 1</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </DrawerProvider>,
    );

    await user.click(screen.getByText('Open 1'));
    expect(screen.getByText('Drawer 1')).toBeInTheDocument();
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderDrawer();

    await user.click(screen.getByText('Open Drawer'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
