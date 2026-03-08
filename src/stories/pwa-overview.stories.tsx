import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/button';
import { Toast, ToastProvider, ToastViewport } from '../components/toast/toast';
import { ToastTitle, ToastDescription } from '../components/toast/toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/tooltip';
import {
  BottomNavigation,
  BottomNavigationItem,
} from '../components/bottom-navigation';
import { OfflineIndicator } from '../components/offline-indicator';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const meta: Meta = {
  title: 'PWA/Overview',
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
};
export default meta;
type Story = StoryObj;

export const MobileAppShell: Story = {
  name: 'Mobile App Shell (PWA)',
  render: () => (
    <div className="relative flex h-[568px] flex-col bg-neutral-50">
      {/* Offline indicator */}
      <OfflineIndicator isOffline message="オフラインです" />

      {/* Header */}
      <header className="flex h-12 items-center border-b border-neutral-200 bg-white px-4">
        <h1 className="text-sm font-semibold text-neutral-900">Polastack App</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div className="mb-2 text-sm font-medium text-neutral-900">
                Item {i}
              </div>
              <div className="text-xs text-neutral-500">
                業務データのサンプル行です
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation>
        <BottomNavigationItem icon={<HomeIcon />} label="ホーム" active />
        <BottomNavigationItem icon={<ListIcon />} label="一覧" />
        <BottomNavigationItem icon={<SettingsIcon />} label="設定" />
      </BottomNavigation>
    </div>
  ),
};

export const TouchOptimizedButtons: Story = {
  name: 'Touch-Optimized Buttons',
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className="space-y-6 p-8">
      <div>
        <p className="mb-3 text-xs font-medium text-neutral-500">
          Buttons automatically get 44px min touch targets on touch devices
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <HomeIcon />
          </Button>
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-medium text-neutral-500">
          All variants maintain touch targets
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
    </div>
  ),
};

export const TooltipOnTouch: Story = {
  name: 'Tooltip (hidden on touch)',
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-4 p-8 text-center">
        <p className="text-xs text-neutral-500">
          Tooltips are hidden on touch devices (pointer: coarse).
          <br />
          Switch viewport to desktop to see the tooltip on hover.
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me (desktop only)</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This tooltip is hidden on touch devices</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const ToastMobilePosition: Story = {
  name: 'Toast (mobile centered)',
  render: () => (
    <ToastProvider>
      <div className="relative h-[568px] bg-neutral-50 p-4">
        <p className="text-xs text-neutral-500">
          Toasts appear full-width at the bottom on mobile, right-aligned on desktop (sm+).
        </p>
        <Toast variant="default" open>
          <div className="grid gap-1">
            <ToastTitle>通知</ToastTitle>
            <ToastDescription>変更が保存されました。</ToastDescription>
          </div>
        </Toast>
        <Toast variant="success" open>
          <div className="grid gap-1">
            <ToastTitle>成功</ToastTitle>
            <ToastDescription>データが正常に送信されました。</ToastDescription>
          </div>
        </Toast>
      </div>
      <ToastViewport />
    </ToastProvider>
  ),
};
