import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChevronsUpDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../components/collapsible';
import { Button } from '../components/button';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">3 items pinned</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="mt-2 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm">
          Item 1
        </div>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm">
            Item 2
          </div>
          <div className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm">
            Item 3
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-full max-w-sm">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          Advanced Options
          <ChevronsUpDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        <div className="rounded-md border border-[var(--color-border)] px-4 py-3 text-sm">
          Option A: Enable experimental features
        </div>
        <div className="rounded-md border border-[var(--color-border)] px-4 py-3 text-sm">
          Option B: Debug logging
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
