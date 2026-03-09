import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '../components/drawer';
import { Button } from '../components/button';

const meta: Meta = {
  title: 'Navigation/Drawer',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Item Details</DrawerTitle>
          <DrawerDescription>
            View and edit the item details below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 flex-1 overflow-auto">
          <p className="text-sm text-neutral-600">
            This is the drawer body content area. It scrolls independently.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Drawer side="left">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Left Drawer</Button>
      </DrawerTrigger>
      <DrawerContent size="sm">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <ul className="space-y-2 text-sm">
            <li>Dashboard</li>
            <li>Users</li>
            <li>Settings</li>
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Drawer key={size}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              {size}
            </Button>
          </DrawerTrigger>
          <DrawerContent size={size}>
            <DrawerHeader>
              <DrawerTitle>Size: {size}</DrawerTitle>
            </DrawerHeader>
            <div className="p-6">
              <p className="text-sm text-neutral-600">
                This drawer uses the {size} size variant.
              </p>
            </div>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const WithPinning: Story = {
  render: () => (
    <Drawer pinnable>
      <DrawerTrigger asChild>
        <Button>Pinnable Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pinnable Drawer</DrawerTitle>
          <DrawerDescription>
            Click the pin icon to pin this drawer as a side panel.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 flex-1">
          <p className="text-sm text-neutral-600">Content here.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
