import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from '../components/scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-64 rounded-md border border-[var(--color-border)] p-4">
      <div className="space-y-2">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="rounded bg-[var(--color-surface-muted)] px-3 py-1.5 text-sm"
          >
            Tag {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 rounded-md border border-[var(--color-border)]">
      <div className="flex gap-4 p-4" style={{ width: '1200px' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-muted)] text-sm font-medium"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
