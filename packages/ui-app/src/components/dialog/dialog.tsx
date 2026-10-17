import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-modal bg-[var(--color-surface-overlay)]',
      'animate-in fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-modal bg-[var(--color-surface-raised)] p-6 shadow-xl',
        'focus-visible:outline-none',
        // Layout: standard gap between header / body / footer.
        // The close button is absolute, so it is excluded from the gap.
        // overflow-y-auto is a fallback when DialogBody is not used.
        'flex flex-col gap-6 overflow-y-auto',
        // Mobile: full-screen with safe area insets
        'inset-0',
        'pt-[max(1.5rem,env(safe-area-inset-top))]',
        'pb-[max(1.5rem,env(safe-area-inset-bottom))]',
        'pl-[max(1.5rem,env(safe-area-inset-left))]',
        'pr-[max(1.5rem,env(safe-area-inset-right))]',
        'sm:p-6',
        // Desktop: centered modal
        'sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
        'sm:w-full sm:max-w-lg md:max-w-xl sm:rounded-xl sm:border sm:border-[var(--color-border)]',
        'sm:max-h-[calc(100dvh-2rem)]',
        // Animations
        'animate-in fade-in-0',
        'sm:zoom-in-95 sm:slide-in-from-left-1/2 sm:slide-in-from-top-[48%]',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[state=closed]:sm:zoom-out-95',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

/**
 * Scrollable body between DialogHeader and DialogFooter.
 * Keeps header and footer pinned while long content scrolls.
 * `-m-1 p-1` keeps focus rings of edge inputs from being clipped.
 */
export const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('-m-1 min-h-0 flex-1 overflow-y-auto p-1', className)}
    {...props}
  />
);
DialogBody.displayName = 'DialogBody';

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--color-on-surface-muted)]', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';
