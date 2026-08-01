import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home } from 'lucide-react';
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteSeparator,
  CommandPaletteEmpty,
} from '../components/command-palette';
import { Button } from '../components/button';

const meta: Meta = {
  title: 'Navigation/CommandPalette',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen((prev) => !prev);
        }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Open Command Palette (⌘K)
        </Button>
        <CommandPalette open={open} onOpenChange={setOpen}>
          <CommandPaletteEmpty>No results found.</CommandPaletteEmpty>
          <CommandPaletteGroup heading="Navigation">
            <CommandPaletteItem
              icon={<Home className="h-4 w-4" />}
              onSelect={() => setOpen(false)}
            >
              Dashboard
            </CommandPaletteItem>
            <CommandPaletteItem onSelect={() => setOpen(false)}>
              Settings
            </CommandPaletteItem>
            <CommandPaletteItem onSelect={() => setOpen(false)}>
              Users
            </CommandPaletteItem>
          </CommandPaletteGroup>
          <CommandPaletteSeparator />
          <CommandPaletteGroup heading="Actions">
            <CommandPaletteItem
              shortcut="⌘N"
              onSelect={() => setOpen(false)}
            >
              New Item
            </CommandPaletteItem>
            <CommandPaletteItem
              shortcut="⌘⇧E"
              onSelect={() => setOpen(false)}
            >
              Export Data
            </CommandPaletteItem>
          </CommandPaletteGroup>
        </CommandPalette>
      </>
    );
  },
};
