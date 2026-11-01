import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerProvider,
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
      {(['sm', 'md', 'lg', 'xl', 'wide'] as const).map((size) => (
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

/** 画面の半分まで広がる。640px より狭くせず 1100px より広くしない。明細の表など、横に長い中身向け */
export const Wide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Wide Drawer</Button>
      </DrawerTrigger>
      <DrawerContent size="wide">
        <DrawerHeader>
          <DrawerTitle>判定の明細</DrawerTitle>
          <DrawerDescription>
            画面の半分（640〜1100px）。画面が 640px より狭いときは画面いっぱい。
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-600">
                <th className="py-2 pr-4">項目</th>
                <th className="py-2 pr-4">判定</th>
                <th className="py-2 pr-4">最終確認</th>
                <th className="py-2">直し方</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }, (_, i) => (
                <tr key={i} className="border-t border-[var(--color-border)]">
                  <td className="py-2 pr-4">項目 {i + 1}</td>
                  <td className="py-2 pr-4">{i % 3 === 0 ? '要対応' : '適合'}</td>
                  <td className="py-2 pr-4">2026-11-01</td>
                  <td className="py-2">設定画面で対象を見直す</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/** wide を固定表示で本文の横に並べる。画面が狭いときも画面の外にはみ出さない（max-w-full） */
export const WidePinned: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const WidePinnedDemo = () => {
      const [open, setOpen] = useState(true);
      const [pinned, setPinned] = useState(true);
      return (
        <div className="flex h-screen">
          <main className="min-w-0 flex-1 overflow-auto p-6">
            <h1 className="text-lg font-semibold">集計</h1>
            <p className="mt-2 text-sm text-neutral-600">
              引き出しを固定すると、本文の横に並ぶ。ピンを外すと本文の上に重なる。
            </p>
            {!open && (
              <Button className="mt-4" onClick={() => setOpen(true)}>
                Open Drawer
              </Button>
            )}
          </main>
          <Drawer
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              if (!next) setPinned(false);
            }}
            pinnable
            pinned={open && pinned}
            onPinnedChange={setPinned}
          >
            <DrawerContent size="wide">
              <DrawerHeader>
                <DrawerTitle>判定の明細</DrawerTitle>
                <DrawerDescription>size="wide" を固定表示</DrawerDescription>
              </DrawerHeader>
              <div className="p-6 flex-1 overflow-auto text-sm text-neutral-600">
                ウィンドウの幅を変えて、本文と引き出しの幅を確かめる。
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      );
    };
    return <WidePinnedDemo />;
  },
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

export const Stacked: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const StackedDemo = () => {
      const [outerOpen, setOuterOpen] = useState(true);
      const [innerOpen, setInnerOpen] = useState(true);
      return (
        <DrawerProvider>
          <div className="p-8">
            <Drawer open={outerOpen} onOpenChange={setOuterOpen} side="right">
              <DrawerContent size="md">
                <DrawerHeader>
                  <DrawerTitle>First Drawer</DrawerTitle>
                  <DrawerDescription>
                    Opens a second drawer on top via stackOffset.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6">
                  <Drawer
                    open={innerOpen}
                    onOpenChange={setInnerOpen}
                    side="right"
                  >
                    <DrawerContent size="sm">
                      <DrawerHeader>
                        <DrawerTitle>Second Drawer</DrawerTitle>
                        <DrawerDescription>
                          Stacked above the first drawer.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-6 text-sm text-neutral-600">
                        Nested content.
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </DrawerProvider>
      );
    };
    return <StackedDemo />;
  },
};
