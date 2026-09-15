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
  FilterSelector,
  FilterChipSelect,
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

const dimensionOptions = [
  { id: 'status', label: 'Status' },
  { id: 'role', label: 'Role' },
];

describe('FilterSelector', () => {
  it('opens menu with checkbox items on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <FilterSelector
        options={dimensionOptions}
        selected={['status']}
        onToggle={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const items = screen.getAllByRole('menuitemcheckbox');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('aria-checked', 'true');
    expect(items[1]).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onToggle with id and next checked state', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <FilterSelector
        options={dimensionOptions}
        selected={['status']}
        onToggle={onToggle}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Role' }));
    expect(onToggle).toHaveBeenCalledWith('role', true);
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Status' }));
    expect(onToggle).toHaveBeenCalledWith('status', false);
  });

  it('keeps menu open after toggling an item', async () => {
    const user = userEvent.setup();
    render(
      <FilterSelector
        options={dimensionOptions}
        selected={[]}
        onToggle={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Role' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

const roleOptions = [
  { id: 'owner', label: 'Owner' },
  { id: 'admin', label: 'Admin' },
  { id: 'user', label: 'User' },
  { id: 'guest', label: 'Guest' },
];

describe('FilterChipSelect', () => {
  it('shows placeholder when nothing selected', () => {
    render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={[]}
        onSelectedChange={() => {}}
      />,
    );
    expect(screen.getByText('Any')).toBeInTheDocument();
  });

  it('shows selected labels joined', () => {
    render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={['admin', 'user']}
        onSelectedChange={() => {}}
      />,
    );
    expect(screen.getByText('Admin, User')).toBeInTheDocument();
  });

  it('shows count when more than two selected', () => {
    render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={['owner', 'admin', 'user']}
        onSelectedChange={() => {}}
      />,
    );
    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('opens value menu and adds a value', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={['admin']}
        onSelectedChange={onSelectedChange}
      />,
    );
    await user.click(screen.getByText('Admin'));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'User' }));
    expect(onSelectedChange).toHaveBeenCalledWith(['admin', 'user']);
  });

  it('removes a value when unchecked', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={['admin', 'user']}
        onSelectedChange={onSelectedChange}
      />,
    );
    await user.click(screen.getByText('Admin, User'));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Admin' }));
    expect(onSelectedChange).toHaveBeenCalledWith(['user']);
  });

  it('calls onRemove from the remove button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={[]}
        onSelectedChange={() => {}}
        onRemove={onRemove}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: 'Remove Role filter' }),
    );
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations with menu open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FilterChipSelect
        label="Role"
        options={roleOptions}
        selected={['admin']}
        onSelectedChange={() => {}}
        onRemove={() => {}}
      />,
    );
    await user.click(screen.getByText('Admin'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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
