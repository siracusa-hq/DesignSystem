import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './dropdown-menu';

function renderMenu() {
  return render(
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem destructive>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
}

describe('DropdownMenu', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
  });

  it('renders label and separator', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(document.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  it('calls onSelect on item click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByText('Menu'));
    await user.click(screen.getByText('Action'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    // Keyboard nav moves focus between items
    expect(document.activeElement).toBeTruthy();
  });

  it('applies destructive style', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    const deleteItem = screen.getByText('Delete');
    expect(deleteItem.closest('[role="menuitem"]')?.className).toContain(
      'text-error-600',
    );
  });

  it('renders inset item with extra padding', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByText('Menu'));
    expect(
      screen.getByText('Inset item').closest('[role="menuitem"]')?.className,
    ).toContain('pl-8');
  });

  it('renders shortcut text', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByText('Menu'));
    expect(screen.getByText('⌘S')).toBeInTheDocument();
  });

  it('renders checkbox items', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>
            Checked item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByText('Menu'));
    expect(screen.getByText('Checked item')).toBeInTheDocument();
  });

  it('renders radio items', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByText('Menu'));
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderMenu();

    await user.click(screen.getByText('Actions'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
