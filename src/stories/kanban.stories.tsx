import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard, KanbanColumn, KanbanCard } from '../components/kanban';
import { Badge } from '../components/badge';

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
