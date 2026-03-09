import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteSeparator,
  CommandPaletteEmpty,
} from './command-palette';

function renderPalette(open = true) {
  const onOpenChange = vi.fn();
  const onSelect = vi.fn();

  const result = render(
    <CommandPalette open={open} onOpenChange={onOpenChange} placeholder="Search...">
      <CommandPaletteEmpty>No results found.</CommandPaletteEmpty>
      <CommandPaletteGroup heading="Navigation">
        <CommandPaletteItem onSelect={() => onSelect('dashboard')}>
          Dashboard
        </CommandPaletteItem>
        <CommandPaletteItem onSelect={() => onSelect('settings')}>
          Settings
        </CommandPaletteItem>
      </CommandPaletteGroup>
      <CommandPaletteSeparator />
      <CommandPaletteGroup heading="Actions">
        <CommandPaletteItem shortcut="⌘N" onSelect={() => onSelect('new')}>
          New Item
        </CommandPaletteItem>
      </CommandPaletteGroup>
    </CommandPalette>,
  );

  return { ...result, onOpenChange, onSelect };
}

describe('CommandPalette', () => {
  it('renders when open', () => {
    renderPalette();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderPalette(false);
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('renders groups with headings', () => {
    renderPalette();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders shortcut text', () => {
    renderPalette();
    expect(screen.getByText('⌘N')).toBeInTheDocument();
  });

  it('renders item with icon', () => {
    render(
      <CommandPalette open onOpenChange={() => {}}>
        <CommandPaletteItem icon={<svg data-testid="icon" />}>
          Test
        </CommandPaletteItem>
      </CommandPalette>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('filters items on search input', async () => {
    const user = userEvent.setup();
    renderPalette();

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'Dash');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // Settings should be filtered out by cmdk
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('shows empty state when no match', async () => {
    const user = userEvent.setup();
    renderPalette();

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'zzzzz');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('calls onSelect when item selected', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderPalette();

    await user.click(screen.getByText('Dashboard'));
    expect(onSelect).toHaveBeenCalledWith('dashboard');
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderPalette();

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('passes axe accessibility check', async () => {
    const { container } = renderPalette();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
