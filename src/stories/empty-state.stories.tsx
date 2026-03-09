import type { Meta, StoryObj } from '@storybook/react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '../components/empty-state';
import { Button } from '../components/button';

const meta: Meta = {
  title: 'Data Display/EmptyState',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <EmptyState className="w-96">
      <EmptyStateIcon>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </EmptyStateIcon>
      <EmptyStateTitle>No results found</EmptyStateTitle>
      <EmptyStateDescription>
        Try adjusting your search or filter to find what you are looking for.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button variant="outline" size="sm">
          Clear filters
        </Button>
      </EmptyStateActions>
    </EmptyState>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="border border-dashed border-neutral-300 rounded-lg">
          <EmptyState size={size}>
            <EmptyStateTitle>Size: {size}</EmptyStateTitle>
            <EmptyStateDescription>
              This is the {size} variant.
            </EmptyStateDescription>
          </EmptyState>
        </div>
      ))}
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <EmptyState className="w-96">
      <EmptyStateTitle>No items yet</EmptyStateTitle>
    </EmptyState>
  ),
};
