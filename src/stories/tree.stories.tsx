import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tree, type TreeNode } from '../components/tree';

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tree>;

const fileExplorerData: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button.tsx', label: 'button.tsx' },
          { id: 'card.tsx', label: 'card.tsx' },
          { id: 'dialog.tsx', label: 'dialog.tsx' },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        children: [
          { id: 'use-theme.ts', label: 'use-theme.ts' },
          { id: 'use-breakpoint.ts', label: 'use-breakpoint.ts' },
        ],
      },
      { id: 'index.ts', label: 'index.ts' },
      { id: 'app.tsx', label: 'app.tsx' },
    ],
  },
];

export const FileExplorer: Story = {
  render: () => <Tree data={fileExplorerData} className="max-w-xs" />,
};

export const WithDefaultExpanded: Story = {
  render: () => (
    <Tree
      data={fileExplorerData}
      defaultExpandedIds={['src', 'components']}
      className="max-w-xs"
    />
  ),
};

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | undefined>(
      'button.tsx',
    );
    return (
      <Tree
        data={fileExplorerData}
        defaultExpandedIds={['src', 'components']}
        selectedId={selected}
        onSelect={setSelected}
        className="max-w-xs"
      />
    );
  },
};
