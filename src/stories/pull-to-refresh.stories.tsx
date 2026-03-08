import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PullToRefresh } from '../components/pull-to-refresh';

const meta: Meta<typeof PullToRefresh> = {
  title: 'PWA/PullToRefresh',
  component: PullToRefresh,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof PullToRefresh>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

    const handleRefresh = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setItems((prev) => [`Item ${prev.length + 1}`, ...prev]);
    };

    return (
      <PullToRefresh onRefresh={handleRefresh} className="h-[568px]">
        <div className="p-4">
          <p className="mb-4 text-xs text-neutral-400">
            Pull down to refresh (touch device)
          </p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-neutral-200 bg-white p-3 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </PullToRefresh>
    );
  },
};
