import * as React from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

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
