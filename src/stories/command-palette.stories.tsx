import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
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
