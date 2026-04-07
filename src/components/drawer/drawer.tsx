import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pin, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';

/* ----- Drawer Context ----- */

interface DrawerContextValue {
  side: 'left' | 'right';
  pinnable: boolean;
  pinned: boolean;
  onPinnedChange?: (pinned: boolean) => void;
}

const [DrawerContextProvider, useDrawerContext] =
  createContext<DrawerContextValue>('Drawer');

/* ----- Drawer Stack Context ----- */

interface DrawerStackEntry {
  id: string;
  level: number;
}

interface DrawerStackContextValue {
  stack: DrawerStackEntry[];
  register: (id: string) => number;
  unregister: (id: string) => void;
}

const DrawerStackContext = React.createContext<DrawerStackContextValue | null>(
  null,
);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const stackRef = React.useRef<DrawerStackEntry[]>([]);
  const [, forceUpdate] = React.useState(0);

  const register = React.useCallback((id: string) => {
    const level = stackRef.current.length;
    stackRef.current = [...stackRef.current, { id, level }];
    forceUpdate((n) => n + 1);
    return level;
  }, []);

  const unregister = React.useCallback((id: string) => {
    stackRef.current = stackRef.current.filter((e) => e.id !== id);
    forceUpdate((n) => n + 1);
  }, []);

  const ctx = React.useMemo(
    () => ({ stack: stackRef.current, register, unregister }),
    [register, unregister],
  );

  return (
    <DrawerStackContext.Provider value={ctx}>
      {children}
    </DrawerStackContext.Provider>
  );
}
DrawerProvider.displayName = 'DrawerProvider';

/* ----- Drawer ----- */

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'left' | 'right';
  pinnable?: boolean;
  pinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  children: React.ReactNode;
}

export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  pinnable = false,
  pinned = false,
  onPinnedChange,
  children,
}: DrawerProps) {
  return (
    <DrawerContextProvider value={{ side, pinnable, pinned, onPinnedChange }}>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </DialogPrimitive.Root>
    </DrawerContextProvider>
  );
}
Drawer.displayName = 'Drawer';

/* ----- DrawerTrigger ----- */

export const DrawerTrigger = DialogPrimitive.Trigger;

/* ----- DrawerClose ----- */

export const DrawerClose = DialogPrimitive.Close;

/* ----- DrawerContent ----- */

const drawerSizeVariants = cva('', {
  variants: {
    size: {
      sm: 'w-80',       // 320px
      md: 'w-[480px]',
      lg: 'w-[640px]',
      xl: 'w-[800px]',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerSizeVariants> {}

export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, size, children, ...props }, ref) => {
  const { side, pinned } = useDrawerContext();
  const stackCtx = React.useContext(DrawerStackContext);
  const drawerId = React.useId();
  const [level, setLevel] = React.useState(0);

  React.useEffect(() => {
    if (stackCtx) {
      const l = stackCtx.register(drawerId);
      setLevel(l);
      return () => stackCtx.unregister(drawerId);
    }
  }, [stackCtx, drawerId]);

  const stackOffset = stackCtx ? level * 2 : 0;

  if (pinned) {
    return (
      <div
        className={cn(
          'flex flex-col border-[var(--color-border)] bg-[var(--color-surface-raised)]',
          side === 'right' ? 'border-l' : 'border-r',
          drawerSizeVariants({ size }),
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 bg-[var(--color-surface-overlay)]',
          'animate-in fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        )}
        style={{ zIndex: 200 + stackOffset }}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed top-0 h-full max-w-full bg-[var(--color-surface-raised)] shadow-xl',
          'focus-visible:outline-none',
          side === 'right' && 'right-0 border-l border-[var(--color-border)] animate-slide-in-right data-[state=closed]:animate-slide-out-right',
          side === 'left' && 'left-0 border-r border-[var(--color-border)] animate-slide-in-left data-[state=closed]:animate-slide-out-left',
          drawerSizeVariants({ size }),
          className,
        )}
        style={{ zIndex: 201 + stackOffset }}
        {...props}
      >
        <div className="flex h-full flex-col">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
DrawerContent.displayName = 'DrawerContent';

/* ----- DrawerHeader ----- */

export const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { pinnable, pinned, onPinnedChange } = useDrawerContext();

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 sm:px-6 sm:py-4',
        'pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-4',
        className,
      )}
      {...props}
    >
      <div className="flex-1">{props.children}</div>
      <div className="flex items-center gap-1">
        {pinnable && (
          <button
            type="button"
            onClick={() => onPinnedChange?.(!pinned)}
            className={cn(
              'inline-flex items-center justify-center rounded-sm p-1 transition-opacity hover:opacity-100 touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]',
              pinned ? 'opacity-100 text-primary-500' : 'opacity-50',
            )}
            aria-label={pinned ? 'Unpin drawer' : 'Pin drawer'}
          >
            <Pin className="h-4 w-4" fill={pinned ? 'currentColor' : 'none'} />
          </button>
        )}
        <DialogPrimitive.Close className="inline-flex items-center justify-center rounded-sm p-1 opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
    </div>
  );
});
DrawerHeader.displayName = 'DrawerHeader';

/* ----- DrawerTitle ----- */

export const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

/* ----- DrawerDescription ----- */

export const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--color-on-surface-muted)]', className)}
    {...props}
  />
));
DrawerDescription.displayName = 'DrawerDescription';

/* ----- DrawerFooter ----- */

export const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-4 py-3 sm:px-6 sm:py-4',
      'pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4',
      className,
    )}
    {...props}
  />
));
DrawerFooter.displayName = 'DrawerFooter';
