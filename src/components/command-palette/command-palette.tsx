import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { cn } from '@/lib/cn';

/* ----- CommandPalette ----- */

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

export function CommandPalette({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  className,
  children,
}: CommandPaletteProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-modal bg-black/50 animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-[20%] z-modal w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className,
          )}
        >
          <Command shouldFilter className="flex flex-col">
            <div className="flex items-center border-b border-neutral-200 px-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-neutral-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <Command.Input
                placeholder={placeholder}
                className="flex h-12 w-full bg-transparent px-3 text-base outline-none placeholder:text-neutral-400"
              />
            </div>
            <Command.List className="max-h-80 overflow-auto p-2">
              {children}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
CommandPalette.displayName = 'CommandPalette';

/* ----- CommandPaletteGroup ----- */

export interface CommandPaletteGroupProps {
  heading?: string;
  children: React.ReactNode;
}

export function CommandPaletteGroup({
  heading,
  children,
}: CommandPaletteGroupProps) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500"
    >
      {children}
    </Command.Group>
  );
}
CommandPaletteGroup.displayName = 'CommandPaletteGroup';

/* ----- CommandPaletteItem ----- */

export interface CommandPaletteItemProps {
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CommandPaletteItem({
  icon,
  shortcut,
  onSelect,
  disabled,
  className,
  children,
}: CommandPaletteItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      disabled={disabled}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none',
        'data-[selected=true]:bg-neutral-100',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        className,
      )}
    >
      {icon && (
        <span className="mr-2 flex h-4 w-4 items-center justify-center text-neutral-500">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <CommandPaletteShortcut>{shortcut}</CommandPaletteShortcut>
      )}
    </Command.Item>
  );
}
CommandPaletteItem.displayName = 'CommandPaletteItem';

/* ----- CommandPaletteSeparator ----- */

export function CommandPaletteSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Command.Separator
      className={cn('-mx-1 my-1 h-px bg-neutral-200', className)}
      {...props}
    />
  );
}
CommandPaletteSeparator.displayName = 'CommandPaletteSeparator';

/* ----- CommandPaletteEmpty ----- */

export function CommandPaletteEmpty({
  className,
  children = 'No results found.',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Command.Empty
      className={cn('px-2 py-6 text-center text-sm text-neutral-500', className)}
      {...props}
    >
      {children}
    </Command.Empty>
  );
}
CommandPaletteEmpty.displayName = 'CommandPaletteEmpty';

/* ----- CommandPaletteShortcut ----- */

export function CommandPaletteShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-neutral-400',
        className,
      )}
      {...props}
    />
  );
}
CommandPaletteShortcut.displayName = 'CommandPaletteShortcut';
