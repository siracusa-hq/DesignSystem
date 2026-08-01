import * as React from 'react';
import { GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { KanbanDndProvider, DroppableColumn, DraggableCard } from './kanban-dnd-provider';
import { KanbanMoveMenu } from './kanban-move-menu';
import { KanbanScrollSnap, KanbanScrollSnapColumn } from './kanban-scroll-snap';

/* ---------------------------------------------------------------
   Context
   --------------------------------------------------------------- */

interface KanbanContextValue {
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  draggedCard: { id: string; columnId: string } | null;
  setDraggedCard: (card: { id: string; columnId: string } | null) => void;
  enableTouchDrag: boolean;
  mobileLayout: 'default' | 'scroll-snap';
}

const KanbanContext = React.createContext<KanbanContextValue>({
  draggedCard: null,
  setDraggedCard: () => {},
  enableTouchDrag: false,
  mobileLayout: 'default',
});

/* ---------------------------------------------------------------
   KanbanBoard
   --------------------------------------------------------------- */

export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  /**
   * Mobile layout mode.
   * - 'default': horizontal scroll (current behavior)
   * - 'scroll-snap': full-width columns with snap scrolling + dot indicators
   */
  mobileLayout?: 'default' | 'scroll-snap';
  /**
   * Enable touch-compatible drag and drop via @dnd-kit.
   * When false (default), uses HTML5 native DnD.
   * Requires @dnd-kit/core to be installed as a peer dependency.
   */
  enableTouchDrag?: boolean;
}

export const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ onCardMove, mobileLayout = 'default', enableTouchDrag = false, className, children, ...props }, ref) => {
    const [draggedCard, setDraggedCard] = React.useState<{
      id: string;
      columnId: string;
    } | null>(null);

    const childCount = React.Children.count(children);

    const ctx = React.useMemo(
      () => ({ onCardMove, draggedCard, setDraggedCard, enableTouchDrag, mobileLayout }),
      [onCardMove, draggedCard, enableTouchDrag, mobileLayout],
    );

    const isScrollSnap = mobileLayout === 'scroll-snap';

    const content = isScrollSnap ? (
      <KanbanScrollSnap ref={ref} className={className} columnCount={childCount} {...props}>
        {React.Children.map(children, (child) => (
          <KanbanScrollSnapColumn>{child}</KanbanScrollSnapColumn>
        ))}
      </KanbanScrollSnap>
    ) : (
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
    );

    const board = (
      <KanbanContext.Provider value={ctx}>
        {content}
      </KanbanContext.Provider>
    );

    if (enableTouchDrag) {
      return (
        <KanbanDndProvider onCardMove={onCardMove}>
          {board}
        </KanbanDndProvider>
      );
    }

    return board;
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
    const { onCardMove, draggedCard, setDraggedCard, enableTouchDrag, mobileLayout } = React.useContext(KanbanContext);
    const [dragOver, setDragOver] = React.useState(false);

    // HTML5 DnD handlers (only active when enableTouchDrag is false)
    const handleDragOver = (e: React.DragEvent) => {
      if (enableTouchDrag) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedCard && draggedCard.columnId !== columnId) {
        setDragOver(true);
      }
    };

    const handleDragLeave = () => {
      if (enableTouchDrag) return;
      setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      if (enableTouchDrag) return;
      e.preventDefault();
      setDragOver(false);
      if (draggedCard && draggedCard.columnId !== columnId) {
        onCardMove?.(draggedCard.id, draggedCard.columnId, columnId);
      }
      setDraggedCard(null);
    };

    const isScrollSnap = mobileLayout === 'scroll-snap';

    const renderColumn = (droppableRef?: (node: HTMLElement | null) => void, isOver?: boolean) => {
      const showDropIndicator = enableTouchDrag ? (isOver ?? false) : dragOver;

      return (
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            droppableRef?.(node);
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex shrink-0 flex-col rounded-lg bg-[var(--color-surface-muted)]',
            isScrollSnap ? 'w-full' : 'w-72',
            showDropIndicator && 'ring-2 ring-primary-500',
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
    };

    if (enableTouchDrag) {
      return (
        <DroppableColumn columnId={columnId}>
          {({ setNodeRef, isOver }) => renderColumn(setNodeRef, isOver)}
        </DroppableColumn>
      );
    }

    return renderColumn();
  },
);
KanbanColumn.displayName = 'KanbanColumn';

/* ---------------------------------------------------------------
   KanbanCard
   --------------------------------------------------------------- */

export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardId: string;
  columnId: string;
  /**
   * Renders a "Move to" menu for accessible card movement.
   * Provide the list of all columns so the user can pick a destination.
   */
  moveToColumns?: Array<{ id: string; title: string }>;
}

export const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ cardId, columnId, moveToColumns, className, children, ...props }, ref) => {
    const { setDraggedCard, enableTouchDrag, onCardMove } = React.useContext(KanbanContext);
    const [dragging, setDragging] = React.useState(false);

    // HTML5 DnD handlers
    const handleDragStart = (e: React.DragEvent) => {
      if (enableTouchDrag) return;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', cardId);
      setDraggedCard({ id: cardId, columnId });
      setDragging(true);
    };

    const handleDragEnd = () => {
      if (enableTouchDrag) return;
      setDragging(false);
      setDraggedCard(null);
    };

    const renderCard = (
      draggableRef?: (node: HTMLElement | null) => void,
      isDndDragging?: boolean,
      dndAttributes?: Record<string, unknown>,
      dndListeners?: Record<string, unknown>,
    ) => {
      const isDraggingState = enableTouchDrag ? (isDndDragging ?? false) : dragging;

      return (
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            draggableRef?.(node);
          }}
          {...(!enableTouchDrag && { draggable: true, onDragStart: handleDragStart, onDragEnd: handleDragEnd })}
          className={cn(
            'group cursor-grab rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-sm shadow-sm transition-shadow touch:min-h-[--touch-target-min]',
            'hover:shadow-md',
            'active:cursor-grabbing',
            isDraggingState && 'opacity-50',
            className,
          )}
          {...props}
        >
          <div className="flex items-start gap-2">
            {enableTouchDrag && (
              <button
                type="button"
                className="mt-0.5 shrink-0 cursor-grab touch:visible text-[var(--color-on-surface-muted)] active:cursor-grabbing"
                aria-label="Drag handle"
                {...(dndAttributes as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                {...(dndListeners as React.DOMAttributes<HTMLButtonElement>)}
              >
                <GripVertical className="size-4" />
              </button>
            )}
            <div className="min-w-0 flex-1">{children}</div>
            {moveToColumns && onCardMove && (
              <KanbanMoveMenu
                cardId={cardId}
                currentColumnId={columnId}
                columns={moveToColumns}
                onMove={onCardMove}
              />
            )}
          </div>
        </div>
      );
    };

    if (enableTouchDrag) {
      return (
        <DraggableCard cardId={cardId} columnId={columnId}>
          {({ setNodeRef, isDragging: isDndDragging, attributes, listeners }) =>
            renderCard(setNodeRef, isDndDragging, attributes as unknown as Record<string, unknown>, listeners as unknown as Record<string, unknown>)
          }
        </DraggableCard>
      );
    }

    return renderCard();
  },
);
KanbanCard.displayName = 'KanbanCard';
