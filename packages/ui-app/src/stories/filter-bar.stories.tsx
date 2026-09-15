import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FilterBar,
  FilterBarGroup,
  FilterChip,
  ActiveFilters,
  FilterBarActions,
  FilterSelector,
  FilterChipSelect,
} from '../components/filter-bar';

const meta: Meta = {
  title: 'Data Display/FilterBar',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <FilterBar>
      <FilterBarGroup>
        <FilterChip label="Status" value="Active" onRemove={() => {}} />
        <FilterChip label="Role" value="Admin" onRemove={() => {}} />
      </FilterBarGroup>
    </FilterBar>
  ),
};

export const WithClearAll: Story = {
  render: () => (
    <FilterBar>
      <ActiveFilters onClearAll={() => {}}>
        <FilterChip label="Status" value="Active" onRemove={() => {}} />
        <FilterChip label="Role" value="Admin" onRemove={() => {}} />
        <FilterChip label="Department" value="Engineering" onRemove={() => {}} />
      </ActiveFilters>
    </FilterBar>
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <FilterBar>
      <FilterBarGroup>
        <FilterChip
          label="Status"
          value="Active"
          variant="outline"
          onRemove={() => {}}
        />
        <FilterChip
          label="Role"
          value="Viewer"
          variant="outline"
          onRemove={() => {}}
        />
      </FilterBarGroup>
    </FilterBar>
  ),
};

export const WithFilterSelector: Story = {
  render: () => {
    const filterDefs = [
      {
        id: 'status',
        label: 'Status',
        values: [
          { id: 'active', label: 'Active' },
          { id: 'inactive', label: 'Inactive' },
          { id: 'pending', label: 'Pending' },
        ],
      },
      {
        id: 'role',
        label: 'Role',
        values: [
          { id: 'owner', label: 'Owner' },
          { id: 'admin', label: 'Admin' },
          { id: 'user', label: 'User' },
          { id: 'guest', label: 'Guest' },
        ],
      },
      {
        id: 'team',
        label: 'Team',
        values: [
          { id: 'frontend', label: 'Frontend' },
          { id: 'backend', label: 'Backend' },
          { id: 'design', label: 'Design' },
        ],
      },
      {
        id: 'department',
        label: 'Department',
        values: [
          { id: 'engineering', label: 'Engineering' },
          { id: 'sales', label: 'Sales' },
        ],
      },
    ];
    // 有効な軸の id → 選択中の値 id 配列
    const [active, setActive] = useState<Record<string, string[]>>({
      status: ['active'],
      role: ['admin'],
    });

    const handleToggle = (id: string, checked: boolean) => {
      setActive((prev) => {
        if (checked) return { ...prev, [id]: prev[id] ?? [] };
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };

    return (
      <FilterBar>
        <ActiveFilters onClearAll={() => setActive({})}>
          {filterDefs
            .filter((def) => def.id in active)
            .map((def) => (
              <FilterChipSelect
                key={def.id}
                label={def.label}
                options={def.values}
                selected={active[def.id]}
                onSelectedChange={(ids) =>
                  setActive((prev) => ({ ...prev, [def.id]: ids }))
                }
                onRemove={() => handleToggle(def.id, false)}
              />
            ))}
        </ActiveFilters>
        <FilterBarActions>
          <FilterSelector
            options={filterDefs.map(({ id, label }) => ({ id, label }))}
            selected={Object.keys(active)}
            onToggle={handleToggle}
          />
        </FilterBarActions>
      </FilterBar>
    );
  },
};

export const WithValueSelection: Story = {
  render: () => {
    const roleOptions = [
      { id: 'owner', label: 'Owner' },
      { id: 'admin', label: 'Admin' },
      { id: 'user', label: 'User' },
      { id: 'guest', label: 'Guest' },
    ];
    const [selected, setSelected] = useState<string[]>(['admin']);

    return (
      <FilterBar>
        <FilterBarGroup>
          <FilterChipSelect
            label="Role"
            options={roleOptions}
            selected={selected}
            onSelectedChange={setSelected}
            onRemove={() => setSelected([])}
          />
        </FilterBarGroup>
      </FilterBar>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [filters, setFilters] = useState([
      { label: 'Status', value: 'Active' },
      { label: 'Role', value: 'Admin' },
      { label: 'Team', value: 'Frontend' },
    ]);

    return (
      <FilterBar>
        <ActiveFilters onClearAll={() => setFilters([])}>
          {filters.map((f) => (
            <FilterChip
              key={`${f.label}-${f.value}`}
              label={f.label}
              value={f.value}
              onRemove={() =>
                setFilters((prev) =>
                  prev.filter(
                    (p) => p.label !== f.label || p.value !== f.value,
                  ),
                )
              }
            />
          ))}
        </ActiveFilters>
      </FilterBar>
    );
  },
};
