import * as React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/dropdown-menu';

interface KanbanMoveMenuProps {
  cardId: string;
  currentColumnId: string;
  columns: Array<{ id: string; title: string }>;
  onMove: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}

export function KanbanMoveMenu({
  cardId,
  currentColumnId,
  columns,
  onMove,
}: KanbanMoveMenuProps) {
  const targetColumns = columns.filter((col) => col.id !== currentColumnId);
  if (targetColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-1 text-[var(--color-on-surface-muted)] opacity-0 transition-opacity hover:text-[var(--color-on-surface)] focus-visible:opacity-100 group-hover:opacity-100 touch:opacity-100 touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]"
          aria-label="Move card"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowRightLeft className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        {targetColumns.map((col) => (
          <DropdownMenuItem
            key={col.id}
            onSelect={() => onMove(cardId, currentColumnId, col.id)}
          >
            Move to {col.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
KanbanMoveMenu.displayName = 'KanbanMoveMenu';
