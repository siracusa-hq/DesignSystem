import type { Meta, StoryObj } from '@storybook/react';
import { Home, Search, Settings } from 'lucide-react';
import {
  BottomNavigation,
  BottomNavigationItem,
} from '../components/bottom-navigation';

const meta: Meta<typeof BottomNavigation> = {
  title: 'PWA/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[568px] bg-neutral-50">
      <div className="p-4">
        <p className="text-sm text-neutral-500">Page content</p>
      </div>
      <BottomNavigation aria-label="Main navigation">
        <BottomNavigationItem icon={<Home className="h-5 w-5" />} label="ホーム" active />
        <BottomNavigationItem icon={<Search className="h-5 w-5" />} label="検索" />
        <BottomNavigationItem icon={<Settings className="h-5 w-5" />} label="設定" />
      </BottomNavigation>
    </div>
  ),
};
