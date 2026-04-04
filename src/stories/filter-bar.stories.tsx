import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FilterBar,
  FilterBarGroup,
  FilterChip,
  ActiveFilters,
  FilterBarActions,
  FilterSelector,
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
    const allFilters = [
      { id: 'status', label: 'Status' },
      { id: 'role', label: 'Role' },
      { id: 'team', label: 'Team' },
      { id: 'department', label: 'Department' },
    ];
    const [enabled, setEnabled] = useState(['status', 'role', 'team']);
    const [filters, setFilters] = useState([
      { label: 'Status', value: 'Active' },
      { label: 'Role', value: 'Admin' },
      { label: 'Team', value: 'Frontend' },
    ]);

    const handleToggle = (id: string, checked: boolean) => {
      if (checked) {
        setEnabled((prev) => [...prev, id]);
      } else {
        setEnabled((prev) => prev.filter((f) => f !== id));
        setFilters((prev) =>
          prev.filter((f) => f.label.toLowerCase() !== id),
        );
      }
    };

    return (
      <FilterBar>
        <FilterBarActions>
          <FilterSelector
            options={allFilters}
            selected={enabled}
            onToggle={handleToggle}
          />
        </FilterBarActions>
        <ActiveFilters onClearAll={() => setFilters([])}>
          {filters
            .filter((f) => enabled.includes(f.label.toLowerCase()))
            .map((f) => (
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
