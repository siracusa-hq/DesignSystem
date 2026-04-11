import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard, KanbanColumn, KanbanCard } from '../components/kanban';
import { Badge } from '../components/badge';
import { useBreakpoint } from '../hooks/use-breakpoint';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/Kanban',
  component: KanbanBoard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  render: () => (
    <KanbanBoard>
      <KanbanColumn columnId="todo" title="To Do" count={3}>
        <KanbanCard cardId="task-1" columnId="todo">
          <p className="font-medium">Design token audit</p>
          <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
            Review and update color tokens
          </p>
          <div className="mt-2 flex gap-1">
            <Badge variant="info">Design</Badge>
          </div>
        </KanbanCard>
        <KanbanCard cardId="task-2" columnId="todo">
          <p className="font-medium">Write unit tests</p>
          <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
            Add tests for new components
          </p>
          <div className="mt-2 flex gap-1">
            <Badge variant="warning">Testing</Badge>
          </div>
        </KanbanCard>
        <KanbanCard cardId="task-3" columnId="todo">
          <p className="font-medium">Update documentation</p>
        </KanbanCard>
      </KanbanColumn>

      <KanbanColumn columnId="in-progress" title="In Progress" count={2}>
        <KanbanCard cardId="task-4" columnId="in-progress">
          <p className="font-medium">Implement Kanban board</p>
          <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
            Build drag-and-drop board component
          </p>
          <div className="mt-2 flex gap-1">
            <Badge variant="default">Feature</Badge>
          </div>
        </KanbanCard>
        <KanbanCard cardId="task-5" columnId="in-progress">
          <p className="font-medium">Fix responsive layout</p>
          <div className="mt-2 flex gap-1">
            <Badge variant="error">Bug</Badge>
          </div>
        </KanbanCard>
      </KanbanColumn>

      <KanbanColumn columnId="done" title="Done" count={2}>
        <KanbanCard cardId="task-6" columnId="done">
          <p className="font-medium">Set up Storybook</p>
          <div className="mt-2 flex gap-1">
            <Badge variant="success">Done</Badge>
          </div>
        </KanbanCard>
        <KanbanCard cardId="task-7" columnId="done">
          <p className="font-medium">Configure CI pipeline</p>
          <div className="mt-2 flex gap-1">
            <Badge variant="success">Done</Badge>
          </div>
        </KanbanCard>
      </KanbanColumn>
    </KanbanBoard>
  ),
};

export const WithAddButton: Story = {
  render: () => (
    <KanbanBoard>
      <KanbanColumn
        columnId="todo"
        title="To Do"
        count={1}
        onAddCard={() => alert('Add card to To Do')}
      >
        <KanbanCard cardId="task-1" columnId="todo">
          <p className="font-medium">Sample task</p>
        </KanbanCard>
      </KanbanColumn>
      <KanbanColumn
        columnId="in-progress"
        title="In Progress"
        count={0}
        onAddCard={() => alert('Add card to In Progress')}
      />
      <KanbanColumn
        columnId="done"
        title="Done"
        count={0}
        onAddCard={() => alert('Add card to Done')}
      />
    </KanbanBoard>
  ),
};

export const Empty: Story = {
  render: () => (
    <KanbanBoard>
      <KanbanColumn columnId="todo" title="To Do" count={0} />
      <KanbanColumn columnId="in-progress" title="In Progress" count={0} />
      <KanbanColumn columnId="done" title="Done" count={0} />
    </KanbanBoard>
  ),
};

/* ---------------------------------------------------------------
   Mobile: Scroll-Snap Layout
   --------------------------------------------------------------- */

const allColumns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const ScrollSnap: Story = {
  render: () => {
    const { isMobile } = useBreakpoint();
    return (
      <div>
        <p className="mb-2 text-sm text-[var(--color-on-surface-muted)]">
          現在のモード: {isMobile ? 'scroll-snap' : 'default'}（640px以下でスナップモード）
        </p>
        <KanbanBoard mobileLayout={isMobile ? 'scroll-snap' : 'default'}>
          <KanbanColumn columnId="todo" title="To Do" count={2}>
            <KanbanCard cardId="t1" columnId="todo">
              <p className="font-medium">Design token audit</p>
            </KanbanCard>
            <KanbanCard cardId="t2" columnId="todo">
              <p className="font-medium">Write unit tests</p>
            </KanbanCard>
          </KanbanColumn>
          <KanbanColumn columnId="in-progress" title="In Progress" count={1}>
            <KanbanCard cardId="t3" columnId="in-progress">
              <p className="font-medium">Implement Kanban</p>
            </KanbanCard>
          </KanbanColumn>
          <KanbanColumn columnId="done" title="Done" count={1}>
            <KanbanCard cardId="t4" columnId="done">
              <p className="font-medium">Set up Storybook</p>
            </KanbanCard>
          </KanbanColumn>
        </KanbanBoard>
      </div>
    );
  },
};

/* ---------------------------------------------------------------
   Mobile: Touch Drag + Move Menu
   --------------------------------------------------------------- */

export const TouchDragAndMoveMenu: Story = {
  render: () => {
    const [cards, setCards] = useState([
      { id: 't1', col: 'todo', text: 'Design token audit' },
      { id: 't2', col: 'todo', text: 'Write unit tests' },
      { id: 't3', col: 'in-progress', text: 'Implement Kanban' },
      { id: 't4', col: 'done', text: 'Set up Storybook' },
    ]);

    const handleMove = (cardId: string, _from: string, to: string) => {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, col: to } : c)),
      );
    };

    const { isMobile } = useBreakpoint();

    return (
      <div>
        <p className="mb-2 text-sm text-[var(--color-on-surface-muted)]">
          enableTouchDrag: {isMobile ? 'ON' : 'OFF'} — ドラッグハンドル + 「Move to」メニュー付き
        </p>
        <KanbanBoard
          onCardMove={handleMove}
          enableTouchDrag={isMobile}
          mobileLayout={isMobile ? 'scroll-snap' : 'default'}
        >
          {allColumns.map((col) => {
            const colCards = cards.filter((c) => c.col === col.id);
            return (
              <KanbanColumn key={col.id} columnId={col.id} title={col.title} count={colCards.length}>
                {colCards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    cardId={card.id}
                    columnId={col.id}
                    moveToColumns={allColumns}
                  >
                    <p className="font-medium">{card.text}</p>
                  </KanbanCard>
                ))}
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      </div>
    );
  },
};

/* ---------------------------------------------------------------
   Mobile: Full Featured (scroll-snap + touch + move menu + badges)
   --------------------------------------------------------------- */

export const MobileFullFeatured: Story = {
  render: () => {
    const [cards, setCards] = useState([
      { id: 't1', col: 'todo', text: 'Design token audit', badge: 'Design' as const },
      { id: 't2', col: 'todo', text: 'Write unit tests', badge: 'Testing' as const },
      { id: 't3', col: 'in-progress', text: 'Implement Kanban', badge: 'Feature' as const },
      { id: 't4', col: 'done', text: 'Set up Storybook', badge: 'Done' as const },
    ]);

    const handleMove = (cardId: string, _from: string, to: string) => {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, col: to } : c)),
      );
    };

    const badgeVariant = {
      Design: 'info',
      Testing: 'warning',
      Feature: 'default',
      Done: 'success',
    } as const;

    return (
      <KanbanBoard
        onCardMove={handleMove}
        enableTouchDrag
        mobileLayout="scroll-snap"
      >
        {allColumns.map((col) => {
          const colCards = cards.filter((c) => c.col === col.id);
          return (
            <KanbanColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              count={colCards.length}
              onAddCard={() => alert(`Add card to ${col.title}`)}
            >
              {colCards.map((card) => (
                <KanbanCard
                  key={card.id}
                  cardId={card.id}
                  columnId={col.id}
                  moveToColumns={allColumns}
                >
                  <p className="font-medium">{card.text}</p>
                  <div className="mt-2 flex gap-1">
                    <Badge variant={badgeVariant[card.badge]}>{card.badge}</Badge>
                  </div>
                </KanbanCard>
              ))}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    );
  },
};
