import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type SeparatorProps,
} from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ---------------------------------------------------------------
   ResizablePanelGroup
   --------------------------------------------------------------- */

export const ResizablePanelGroup = ({
  className,
  ...props
}: GroupProps) => (
  <Group
    className={cn('h-full w-full', className)}
    {...props}
  />
);
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

/* ---------------------------------------------------------------
   ResizablePanel
   --------------------------------------------------------------- */

export const ResizablePanel = Panel;

/* ---------------------------------------------------------------
   ResizableHandle

   react-resizable-panels v4 rendering:
   - Group controls layout via inline flex-direction (row|column)
   - Separator outputs aria-orientation PERPENDICULAR to the group:
       horizontal group → Separator aria-orientation="vertical"   (vertical divider)
       vertical group   → Separator aria-orientation="horizontal" (horizontal divider)
   - Separator has no inherent width/height — we must set via CSS
   --------------------------------------------------------------- */

export interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean;
}

export const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) => (
  <Separator
    className={cn(
      'relative flex shrink-0 items-center justify-center bg-[var(--color-border)]',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
      // Vertical divider (in horizontal group): aria-orientation="vertical"
      'aria-[orientation=vertical]:w-px aria-[orientation=vertical]:cursor-col-resize',
      'aria-[orientation=vertical]:after:absolute aria-[orientation=vertical]:after:inset-y-0 aria-[orientation=vertical]:after:left-1/2 aria-[orientation=vertical]:after:w-1 aria-[orientation=vertical]:after:-translate-x-1/2',
      // Horizontal divider (in vertical group): aria-orientation="horizontal"
      'aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize',
      'aria-[orientation=horizontal]:after:absolute aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:-translate-y-1/2',
      // Rotate grip icon when horizontal divider
      '[&[aria-orientation=horizontal]>div]:rotate-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <GripVertical className="size-2.5" />
      </div>
    )}
  </Separator>
);
ResizableHandle.displayName = 'ResizableHandle';
