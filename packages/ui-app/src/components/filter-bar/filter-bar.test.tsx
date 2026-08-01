import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  FilterBar,
  FilterBarGroup,
  FilterChip,
  ActiveFilters,
  FilterBarActions,
} from './filter-bar';

describe('FilterBar', () => {
  it('renders with toolbar role', () => {
    render(<FilterBar>Content</FilterBar>);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<FilterBar className="custom">Content</FilterBar>);
    expect(screen.getByRole('toolbar')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<FilterBar ref={ref}>Content</FilterBar>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('FilterBarGroup', () => {
  it('renders with group role', () => {
    render(<FilterBarGroup>Group</FilterBarGroup>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});

describe('FilterChip', () => {
  it('renders label and value', () => {
    render(<FilterChip label="Status" value="Active" />);
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders remove button when onRemove provided', () => {
    const onRemove = vi.fn();
    render(<FilterChip label="Status" value="Active" onRemove={onRemove} />);
    expect(
      screen.getByRole('button', { name: 'Remove Status filter' }),
    ).toBeInTheDocument();
  });

  it('does not render remove button without onRemove', () => {
    render(<FilterChip label="Status" value="Active" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<FilterChip label="Status" value="Active" onRemove={onRemove} />);
    await user.click(
      screen.getByRole('button', { name: 'Remove Status filter' }),
    );
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('applies default variant', () => {
    const { container } = render(
      <FilterChip label="Status" value="Active" />,
    );
    expect(container.firstChild).toHaveClass('bg-primary-50');
  });

  it('applies outline variant', () => {
    const { container } = render(
      <FilterChip label="Status" value="Active" variant="outline" />,
    );
    expect(container.firstChild).toHaveClass('border');
  });
});

describe('ActiveFilters', () => {
  it('renders children and clear all button', () => {
    const onClearAll = vi.fn();
    render(
      <ActiveFilters onClearAll={onClearAll}>
        <FilterChip label="A" value="B" />
      </ActiveFilters>,
    );
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('calls onClearAll when button clicked', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    render(
      <ActiveFilters onClearAll={onClearAll}>
        <span>Filter</span>
      </ActiveFilters>,
    );
    await user.click(screen.getByText('Clear all'));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('uses custom clearAllLabel', () => {
    render(
      <ActiveFilters onClearAll={() => {}} clearAllLabel="Reset">
        <span>Filter</span>
      </ActiveFilters>,
    );
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('does not render clear button without onClearAll', () => {
    render(
      <ActiveFilters>
        <span>Filter</span>
      </ActiveFilters>,
    );
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });
});

describe('FilterBar a11y', () => {
  it('passes axe check', async () => {
    const { container } = render(
      <FilterBar>
        <FilterBarGroup>
          <FilterChip label="Status" value="Active" onRemove={() => {}} />
        </FilterBarGroup>
        <ActiveFilters onClearAll={() => {}}>
          <FilterChip label="Type" value="A" onRemove={() => {}} />
        </ActiveFilters>
        <FilterBarActions>
          <button>Apply</button>
        </FilterBarActions>
      </FilterBar>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
