'use client';

import * as React from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DraggableAttributes,
} from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

/* ---------------------------------------------------------------
   DnD Context Provider
   --------------------------------------------------------------- */

interface KanbanDndProviderProps {
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  children: React.ReactNode;
}

export function KanbanDndProvider({
  onCardMove,
  children,
}: KanbanDndProviderProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !onCardMove) return;

      const cardId = active.id as string;
      const fromColumnId = active.data.current?.columnId as string;
      const toColumnId = over.data.current?.columnId as string ?? over.id as string;

      if (fromColumnId && toColumnId && fromColumnId !== toColumnId) {
        onCardMove(cardId, fromColumnId, toColumnId);
      }
    },
    [onCardMove],
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}
KanbanDndProvider.displayName = 'KanbanDndProvider';

/* ---------------------------------------------------------------
   Droppable Column Wrapper
   --------------------------------------------------------------- */

interface DroppableColumnProps {
  columnId: string;
  children: (props: { setNodeRef: (node: HTMLElement | null) => void; isOver: boolean }) => React.ReactNode;
}

export function DroppableColumn({ columnId, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
    data: { columnId },
  });
  return <>{children({ setNodeRef, isOver })}</>;
}
DroppableColumn.displayName = 'DroppableColumn';

/* ---------------------------------------------------------------
   Draggable Card Wrapper
   --------------------------------------------------------------- */

interface DraggableCardProps {
  cardId: string;
  columnId: string;
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void;
    isDragging: boolean;
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  }) => React.ReactNode;
}

export function DraggableCard({ cardId, columnId, children }: DraggableCardProps) {
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id: cardId,
    data: { columnId },
  });
  return <>{children({ setNodeRef, isDragging, attributes, listeners })}</>;
}
DraggableCard.displayName = 'DraggableCard';
