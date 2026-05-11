import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerProvider,
} from '../components/drawer';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/dropdown-menu';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '../components/tooltip';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from '../components/toast';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover';
import { Button } from '../components/button';

/**
 * z-index 階層を組み合わせて重ね表示を視認確認するための Foundations story 集。
 * 各 story は CTO QA で発覚した stacking bug および期待挙動の visual reference。
 *
 * 詳細: docs/z-index-system.md
 */
const meta: Meta = {
  title: 'Foundations/Z-Index Stacking',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'z-index hierarchy の 3 層構造 (in-flow / backdrop / floating) を組み合わせシナリオで検証するストーリー群。',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

/**
 * Scenario 1: Tabs + Dialog
 *
 * 元バグ再現。Tabs trigger (`z-content`) は TabsList の `isolate` で閉じ込められるため、
 * Dialog (`z-modal` = 1200) より下に隠れる。
 */
export const DialogInsideTabs: Story = {
  render: () => (
    <div className="p-8">
      <Tabs defaultValue="api-traffic">
        <TabsList>
          <TabsTrigger value="api-traffic">API トラフィック</TabsTrigger>
          <TabsTrigger value="errors">エラー</TabsTrigger>
        </TabsList>
        <TabsContent value="api-traffic" className="mt-4">
          <p className="mb-4 text-sm">
            タブ表示中に Dialog を開いた場合、Dialog が Tabs の上に重なるはず。
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Dialog を開く (idle timeout を模擬)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>セッションがまもなく切れます</DialogTitle>
                <DialogDescription>
                  この Dialog は背景の Tabs trigger より上に表示されるべきです。
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/**
 * Scenario 2: Select inside Dialog
 *
 * Dialog 内の Select 候補が Dialog より上 (`z-popover` = 1300 > `z-modal` = 1200) に表示される。
 */
export const SelectInsideDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select inside Dialog</DialogTitle>
          <DialogDescription>
            Select の候補は Dialog の上に表示されるはず。
          </DialogDescription>
        </DialogHeader>
        <Select defaultValue="opt1">
          <SelectTrigger>
            <SelectValue placeholder="選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
            <SelectItem value="opt3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scenario 3: DropdownMenu inside Dialog
 *
 * 旧階層では `z-dropdown=50 < z-modal=300` で下に潜っていた。
 * 新階層では `z-dropdown=1300 > z-modal=1200` で正しく上に出る。
 */
export const DropdownMenuInsideDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DropdownMenu inside Dialog</DialogTitle>
          <DialogDescription>
            DropdownMenu のメニューは Dialog の上に表示されるはず (元バグ
            では下に潜っていた)。
          </DialogDescription>
        </DialogHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Action 1</DropdownMenuItem>
            <DropdownMenuItem>Action 2</DropdownMenuItem>
            <DropdownMenuItem>Action 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scenario 4: Dialog inside Drawer
 *
 * Drawer (`z-drawer` = 1100) の中で Dialog (`z-modal` = 1200) を開く。
 * Dialog が Drawer より上に重なるはず。
 */
export const DialogInsideDrawer: Story = {
  render: () => (
    <DrawerProvider>
      <div className="p-8">
        <Drawer defaultOpen side="right">
          <DrawerContent size="md">
            <DrawerHeader>
              <DrawerTitle>Sidebar Drawer</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Drawer 内から Dialog を開く</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog (modal)</DialogTitle>
                    <DialogDescription>
                      Drawer の上に表示されるべき (z-modal=1200 &gt;
                      z-drawer=1100)。
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </DrawerProvider>
  ),
};

/**
 * Scenario 5: Tooltip over Dialog
 *
 * Tooltip (`z-tooltip` = 1400) が Dialog より上に出る。
 */
export const TooltipOverDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tooltip over Dialog</DialogTitle>
          <DialogDescription>
            Tooltip は最前面に表示されるはず。
          </DialogDescription>
        </DialogHeader>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              Tooltip は z-tooltip (= 1400)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scenario 6: Toast over Modal
 *
 * Dialog 表示中に Toast を発火 → Toast (`z-toast` = 1500) が Dialog より上に出る。
 */
export const ToastOverModal: Story = {
  render: () => {
    const ToastDemo = () => {
      const [open, setOpen] = useState(false);
      return (
        <ToastProvider>
          <Dialog defaultOpen>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Toast over Modal</DialogTitle>
                <DialogDescription>
                  ボタンで Toast を発火、Toast が最前面に出る。
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => setOpen(true)}>Toast を発火</Button>
            </DialogContent>
          </Dialog>
          <Toast open={open} onOpenChange={setOpen}>
            <ToastTitle>保存しました</ToastTitle>
            <ToastDescription>変更内容を保存しました。</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };
    return <ToastDemo />;
  },
};

/**
 * Scenario 7: Popover inside Dialog
 *
 * Dialog 内 Popover が Dialog より上に出る。
 */
export const PopoverInsideDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Popover inside Dialog</DialogTitle>
          <DialogDescription>
            Popover は Dialog の上に表示されるはず。
          </DialogDescription>
        </DialogHeader>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm">
              Popover content (z-popover = 1300 &gt; z-modal = 1200)
            </p>
          </PopoverContent>
        </Popover>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scenario 8: Stacked Drawers
 *
 * DrawerProvider 下に nested Drawer を 2 段。stackOffset が動作し、
 * 後から開いた Drawer が前のものの上に表示される。
 */
export const StackedDrawers: Story = {
  render: () => (
    <DrawerProvider>
      <div className="p-8">
        <Drawer defaultOpen side="right">
          <DrawerContent size="md">
            <DrawerHeader>
              <DrawerTitle>First Drawer</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <Drawer defaultOpen side="right">
                <DrawerContent size="sm">
                  <DrawerHeader>
                    <DrawerTitle>Second Drawer (on top)</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 text-sm">
                    stackOffset により First Drawer の上に表示。
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </DrawerProvider>
  ),
};
