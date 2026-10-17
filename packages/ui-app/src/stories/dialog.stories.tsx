import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../components/dialog';
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
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Label } from '../components/label';

const meta: Meta = {
  title: 'Navigation/Dialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '`DialogContent` は子要素の間に標準の間隔（`gap-6` = 24px）を持つ。',
          '`DialogHeader` / 本文 / `DialogFooter` を並べるだけで間隔が揃うので、',
          '本文に `pt-*` / `mt-*` / `py-*` を足さないこと。',
          '',
          '本文が長くなりうる場合は `DialogBody` で包む。見出しとフッターが固定され、本文だけがスクロールする。',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@johndoe" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-error-600">
          Delete Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the item.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-error-600 hover:bg-error-700">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Choose options from the select below. The dropdown list renders above
            the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              Language
            </Label>
            <div className="col-span-3">
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithDropdownMenu: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Item actions</DialogTitle>
          <DialogDescription>
            Open the action menu. Menu items render above the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * 標準の組み方: 見出し + フォーム + フッター。
 * 本文側に余白クラスは付けない（間隔は DialogContent が持つ）。
 */
export const StandardForm: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>質問票を取り込む</DialogTitle>
          <DialogDescription>Excel／Word／PDF／テキスト</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="questionnaire-name">名前</Label>
            <Input id="questionnaire-name" placeholder="2026年度 セキュリティ質問票" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="questionnaire-client">提出先</Label>
            <Input id="questionnaire-client" placeholder="株式会社サンプル" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button>取り込む</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** 本文が長いとき: 見出しとフッターは固定され、DialogBody だけがスクロールする。 */
export const LongContent: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>利用規約</DialogTitle>
          <DialogDescription>最後まで読んでから同意してください。</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3 text-sm">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>
              第{i + 1}条 本サービスの利用者は、本規約に従って本サービスを利用するものとします。
              当社は必要に応じて本規約を変更できるものとします。
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">同意しない</Button>
          </DialogClose>
          <Button>同意する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
