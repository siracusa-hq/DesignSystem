import * as React from 'react';
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
    className={cn(
      'flex h-full w-full data-[orientation=vertical]:flex-col',
      className,
    )}
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
      'relative flex w-px items-center justify-center bg-[var(--color-border)]',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
      'data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full',
      'data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0',
      '[&[data-orientation=vertical]>div]:rotate-90',
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
