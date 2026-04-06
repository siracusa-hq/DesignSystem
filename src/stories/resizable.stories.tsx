import type { Meta, StoryObj } from '@storybook/react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../components/resizable';

const meta: Meta = {
  title: 'Components/Resizable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[300px] max-w-2xl rounded-lg border border-[var(--color-outline)]">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center bg-[var(--color-surface-variant)] p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Sidebar
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Content
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup orientation="vertical" className="min-h-[400px] max-w-md rounded-lg border border-[var(--color-outline)]">
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center bg-[var(--color-surface-variant)] p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Header
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Body
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[300px] max-w-2xl rounded-lg border border-[var(--color-outline)]">
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center bg-[var(--color-surface-variant)] p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Panel A
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Panel B
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Nested: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[400px] max-w-3xl rounded-lg border border-[var(--color-outline)]">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center bg-[var(--color-surface-variant)] p-6">
          <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
            Sidebar
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
                Editor
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center bg-[var(--color-surface-variant)] p-6">
              <span className="text-sm font-medium text-[var(--color-on-surface-secondary)]">
                Terminal
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
