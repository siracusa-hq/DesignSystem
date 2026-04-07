import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ---------------------------------------------------------------
   Context
   --------------------------------------------------------------- */

interface KanbanContextValue {
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  draggedCard: { id: string; columnId: string } | null;
  setDraggedCard: (card: { id: string; columnId: string } | null) => void;
}

const KanbanContext = React.createContext<KanbanContextValue>({
  draggedCard: null,
  setDraggedCard: () => {},
});

/* ---------------------------------------------------------------
   KanbanBoard
   --------------------------------------------------------------- */

export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}

export const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ onCardMove, className, children, ...props }, ref) => {
    const [draggedCard, setDraggedCard] = React.useState<{
      id: string;
      columnId: string;
    } | null>(null);

    const ctx = React.useMemo(
      () => ({ onCardMove, draggedCard, setDraggedCard }),
      [onCardMove, draggedCard],
    );

    return (
      <KanbanContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn(
            'flex gap-4 overflow-x-auto p-1',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </KanbanContext.Provider>
    );
  },
);
KanbanBoard.displayName = 'KanbanBoard';

/* ---------------------------------------------------------------
   KanbanColumn
   --------------------------------------------------------------- */

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  columnId: string;
  title: string;
  count?: number;
  onAddCard?: () => void;
}

export const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ columnId, title, count, onAddCard, className, children, ...props }, ref) => {
    const { onCardMove, draggedCard, setDraggedCard } = React.useContext(KanbanContext);
    const [dragOver, setDragOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedCard && draggedCard.columnId !== columnId) {
        setDragOver(true);
      }
    };

    const handleDragLeave = () => {
      setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (draggedCard && draggedCard.columnId !== columnId) {
        onCardMove?.(draggedCard.id, draggedCard.columnId, columnId);
      }
      setDraggedCard(null);
    };

    return (
      <div
        ref={ref}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex w-72 shrink-0 flex-col rounded-lg bg-[var(--color-surface-muted)]',
          dragOver && 'ring-2 ring-primary-500',
          className,
        )}
        {...props}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">
              {title}
            </h3>
            {count !== undefined && (
              <span className="text-xs text-[var(--color-on-surface-muted)]">
                {count}
              </span>
            )}
          </div>
          {onAddCard && (
            <button
              type="button"
              onClick={onAddCard}
              aria-label={`Add card to ${title}`}
              className="inline-flex items-center justify-center rounded-sm p-0.5 text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>

        {/* Cards */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
          {children}
          {!children && (
            <div className="flex items-center justify-center py-8 text-xs text-[var(--color-on-surface-muted)]">
              Drag cards here
            </div>
          )}
        </div>
      </div>
    );
  },
);
KanbanColumn.displayName = 'KanbanColumn';

/* ---------------------------------------------------------------
   KanbanCard
   --------------------------------------------------------------- */

export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardId: string;
  columnId: string;
}

export const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ cardId, columnId, className, children, ...props }, ref) => {
    const { setDraggedCard } = React.useContext(KanbanContext);
    const [dragging, setDragging] = React.useState(false);

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', cardId);
      setDraggedCard({ id: cardId, columnId });
      setDragging(true);
    };

    const handleDragEnd = () => {
      setDragging(false);
      setDraggedCard(null);
    };

    return (
      <div
        ref={ref}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          'cursor-grab rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-sm shadow-sm transition-shadow touch:min-h-[--touch-target-min]',
          'hover:shadow-md',
          'active:cursor-grabbing',
          dragging && 'opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
KanbanCard.displayName = 'KanbanCard';
