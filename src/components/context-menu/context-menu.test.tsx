import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from './context-menu';

function renderContextMenu(opts?: { onSelect?: () => void; destructive?: boolean }) {
  return render(
    <ContextMenu>
      <ContextMenuTrigger>
        <div style={{ width: 200, height: 200 }}>Right click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={opts?.onSelect}>
          Edit
          <ContextMenuShortcut>Ctrl+E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive={opts?.destructive}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  );
}

describe('ContextMenu', () => {
  it('opens on right-click', async () => {
    renderContextMenu();
    const trigger = screen.getByText('Right click me');
    fireEvent.contextMenu(trigger);
    expect(await screen.findByText('Edit')).toBeInTheDocument();
  });

  it('shows menu items', async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Right click me'));
    expect(await screen.findByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows separator', async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Right click me'));
    await screen.findByText('Edit');
    expect(document.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  it('shows shortcut text', async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Right click me'));
    expect(await screen.findByText('Ctrl+E')).toBeInTheDocument();
  });

  it('handles item click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderContextMenu({ onSelect });

    fireEvent.contextMenu(screen.getByText('Right click me'));
    await screen.findByText('Edit');
    await user.click(screen.getByText('Edit'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('applies destructive variant', async () => {
    renderContextMenu({ destructive: true });
    fireEvent.contextMenu(screen.getByText('Right click me'));
    const deleteItem = await screen.findByText('Delete');
    expect(deleteItem.closest('[role="menuitem"]')?.className).toContain('text-error-600');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Right click me'));
    await screen.findByText('Edit');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
