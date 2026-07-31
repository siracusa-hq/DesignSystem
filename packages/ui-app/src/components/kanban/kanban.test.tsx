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

  /* ---------------------------------------------------------------
     Scroll-snap mobile layout
     --------------------------------------------------------------- */

  it('applies scroll-snap layout when mobileLayout is "scroll-snap"', () => {
    render(
      <KanbanBoard mobileLayout="scroll-snap" data-testid="board">
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo">Task</KanbanCard>
        </KanbanColumn>
        <KanbanColumn columnId="done" title="Done">
          <KanbanCard cardId="2" columnId="done">Task 2</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    // Dot indicators should be present (2 dots for 2 columns)
    const dots = document.querySelectorAll('[aria-hidden="true"] button');
    expect(dots.length).toBe(2);
  });

  it('columns are full-width in scroll-snap mode', () => {
    render(
      <KanbanBoard mobileLayout="scroll-snap">
        <KanbanColumn columnId="todo" title="To Do" data-testid="col">
          <KanbanCard cardId="1" columnId="todo">Task</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    const col = screen.getByTestId('col');
    expect(col.className).toContain('w-full');
  });

  /* ---------------------------------------------------------------
     Touch DnD
     --------------------------------------------------------------- */

  it('removes draggable attribute when enableTouchDrag is true', () => {
    render(
      <KanbanBoard enableTouchDrag>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo" data-testid="card">
            Task
          </KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    const card = screen.getByTestId('card');
    expect(card).not.toHaveAttribute('draggable');
  });

  it('renders drag handle when enableTouchDrag', () => {
    render(
      <KanbanBoard enableTouchDrag>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo">Task</KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByLabelText('Drag handle')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------
     Move menu
     --------------------------------------------------------------- */

  it('renders move menu when moveToColumns is provided', () => {
    const moveColumns = [
      { id: 'todo', title: 'To Do' },
      { id: 'done', title: 'Done' },
    ];
    render(
      <KanbanBoard onCardMove={vi.fn()}>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo" moveToColumns={moveColumns}>
            Task
          </KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    expect(screen.getByLabelText('Move card')).toBeInTheDocument();
  });

  it('move menu shows target columns on click', async () => {
    const user = await import('@testing-library/user-event');
    const moveColumns = [
      { id: 'todo', title: 'To Do' },
      { id: 'done', title: 'Done' },
    ];
    render(
      <KanbanBoard onCardMove={vi.fn()}>
        <KanbanColumn columnId="todo" title="To Do">
          <KanbanCard cardId="1" columnId="todo" moveToColumns={moveColumns}>
            Task
          </KanbanCard>
        </KanbanColumn>
      </KanbanBoard>,
    );
    await user.default.setup().click(screen.getByLabelText('Move card'));
    // Only shows columns other than current
    expect(screen.getByText('Move to Done')).toBeInTheDocument();
    expect(screen.queryByText('Move to To Do')).not.toBeInTheDocument();
  });

  it('scroll-snap mode passes axe', async () => {
    const { container } = render(
      <KanbanBoard mobileLayout="scroll-snap">
        <KanbanColumn columnId="todo" title="To Do" count={1}>
          <KanbanCard cardId="1" columnId="todo">Task 1</KanbanCard>
        </KanbanColumn>
        <KanbanColumn columnId="done" title="Done" count={0} />
      </KanbanBoard>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
