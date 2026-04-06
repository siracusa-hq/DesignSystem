import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { KanbanBoard, KanbanColumn, KanbanCard } from './kanban';

describe('KanbanBoard', () => {
  it('renders board with columns', () => {
    render(
      <KanbanBoard data-testid="board">
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo">Task 1</KanbanCard>
        </KanbanColumn>
        <KanbanColumn columnId="done" title="Done">
          <KanbanCard cardId="2" columnId="done">Task 2</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByTestId('board')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders cards', () => {
    render(
      <KanbanBoard>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo">Task 1</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('renders column title and count', () => {
    render(
      <KanbanBoard>
        <KanbanColumn columnId="todo" title="To Do" count={3}>
          <KanbanCard cardId="1" columnId="todo">Task</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders add button when onAddCard provided', () => {
    const onAdd = vi.fn();
    render(
      <KanbanBoard>
        <KanbanColumn columnId="todo" title="To Do" onAddCard={onAdd}>
          <KanbanCard cardId="1" columnId="todo">Task</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByRole('button', { name: 'Add card to To Do' })).toBeInTheDocument();
  });

  it('does not render add button when onAddCard not provided', () => {
    render(
      <KanbanBoard>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo">Task</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.queryByRole('button', { name: /Add card/ })).not.toBeInTheDocument();
  });

  it('card is draggable', () => {
    render(
      <KanbanBoard>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo" data-testid="card">
            Task
          </KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('draggable', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <KanbanBoard>
        <KanbanColumn columnId="todo" title="To Do" count={1}>
          <KanbanCard cardId="1" columnId="todo">Task 1</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
