import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Tree,
  TreeItem,
  TreeItemGroup,
  TreeItemLabel,
} from '../components/tree';

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tree>;

export const FileExplorer: Story = {
  render: () => (
    <Tree className="max-w-xs">
      <TreeItem value="src">
        <TreeItemLabel>src</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="components">
            <TreeItemLabel>components</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="button.tsx">
                <TreeItemLabel>button.tsx</TreeItemLabel>
              </TreeItem>
              <TreeItem value="card.tsx">
                <TreeItemLabel>card.tsx</TreeItemLabel>
              </TreeItem>
              <TreeItem value="dialog.tsx">
                <TreeItemLabel>dialog.tsx</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
          <TreeItem value="hooks">
            <TreeItemLabel>hooks</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="use-theme.ts">
                <TreeItemLabel>use-theme.ts</TreeItemLabel>
              </TreeItem>
              <TreeItem value="use-media-query.ts">
                <TreeItemLabel>use-media-query.ts</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
          <TreeItem value="index.ts">
            <TreeItemLabel>index.ts</TreeItemLabel>
          </TreeItem>
          <TreeItem value="app.tsx">
            <TreeItemLabel>app.tsx</TreeItemLabel>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  ),
};

export const WithDefaultExpanded: Story = {
  render: () => (
    <Tree className="max-w-xs" defaultExpanded={['src', 'components']}>
      <TreeItem value="src">
        <TreeItemLabel>src</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="components">
            <TreeItemLabel>components</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="button.tsx">
                <TreeItemLabel>button.tsx</TreeItemLabel>
              </TreeItem>
              <TreeItem value="card.tsx">
                <TreeItemLabel>card.tsx</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
          <TreeItem value="utils">
            <TreeItemLabel>utils</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="cn.ts">
                <TreeItemLabel>cn.ts</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  ),
};

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | undefined>(
      'button.tsx',
    );

    return (
      <Tree
        className="max-w-xs"
        defaultExpanded={['src', 'components']}
        value={selected}
        onValueChange={setSelected}
      >
        <TreeItem value="src">
          <TreeItemLabel>src</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="components">
              <TreeItemLabel>components</TreeItemLabel>
              <TreeItemGroup>
                <TreeItem value="button.tsx">
                  <TreeItemLabel>button.tsx</TreeItemLabel>
                </TreeItem>
                <TreeItem value="card.tsx">
                  <TreeItemLabel>card.tsx</TreeItemLabel>
                </TreeItem>
                <TreeItem value="dialog.tsx">
                  <TreeItemLabel>dialog.tsx</TreeItemLabel>
                </TreeItem>
              </TreeItemGroup>
            </TreeItem>
            <TreeItem value="index.ts">
              <TreeItemLabel>index.ts</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
      </Tree>
    );
  },
};
