import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Bell,
  CreditCard,
  Palette,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';
import {
  SecondaryNav,
  SecondaryNavHeader,
  SecondaryNavSection,
  SecondaryNavItem,
} from '../components/secondary-nav';
import {
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
} from '../components/app-shell';
import { SidebarNav, SidebarNavItem } from '../components/sidebar-nav';

const meta: Meta<typeof SecondaryNav> = {
  title: 'Components/SecondaryNav',
  component: SecondaryNav,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SecondaryNav>;

const iconClass = 'h-[18px] w-[18px]';

/**
 * 設定画面の2階層目ナビ。md 以上では左の縦カラム、
 * md 未満では上部の横スクロールバーに自動で切り替わる
 * （Storybook のビューポートを狭めて確認できる）。
 */
export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('profile');
    const items = [
      { id: 'profile', label: 'ユーザー設定', icon: <User className={iconClass} /> },
      { id: 'notifications', label: '通知設定', icon: <Bell className={iconClass} /> },
      { id: 'team', label: 'チーム設定', icon: <Users className={iconClass} /> },
      { id: 'billing', label: '請求', icon: <CreditCard className={iconClass} /> },
    ];
    return (
      <div className="flex h-[420px] flex-col bg-[var(--color-surface)] md:flex-row">
        <SecondaryNav aria-label="設定">
          <SecondaryNavHeader>設定</SecondaryNavHeader>
          {items.map((item) => (
            <SecondaryNavItem
              key={item.id}
              icon={item.icon}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </SecondaryNavItem>
          ))}
        </SecondaryNav>
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-semibold">
            {items.find((i) => i.id === active)?.label}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-secondary)]">
            選択中の設定カテゴリの内容がここに表示される。
          </p>
        </div>
      </div>
    );
  },
};

export const WithSections: Story = {
  render: () => {
    const [active, setActive] = useState('profile');
    return (
      <div className="flex h-[480px] flex-col bg-[var(--color-surface)] md:flex-row">
        <SecondaryNav aria-label="設定">
          <SecondaryNavHeader>設定</SecondaryNavHeader>
          <SecondaryNavSection title="アカウント">
            <SecondaryNavItem
              icon={<User className={iconClass} />}
              active={active === 'profile'}
              onClick={() => setActive('profile')}
            >
              ユーザー設定
            </SecondaryNavItem>
            <SecondaryNavItem
              icon={<Bell className={iconClass} />}
              badge="2"
              active={active === 'notifications'}
              onClick={() => setActive('notifications')}
            >
              通知設定
            </SecondaryNavItem>
            <SecondaryNavItem
              icon={<Palette className={iconClass} />}
              active={active === 'appearance'}
              onClick={() => setActive('appearance')}
            >
              外観
            </SecondaryNavItem>
          </SecondaryNavSection>
          <SecondaryNavSection title="ワークスペース">
            <SecondaryNavItem
              icon={<Users className={iconClass} />}
              active={active === 'team'}
              onClick={() => setActive('team')}
            >
              チーム設定
            </SecondaryNavItem>
            <SecondaryNavItem
              icon={<Shield className={iconClass} />}
              active={active === 'security'}
              onClick={() => setActive('security')}
            >
              セキュリティ
            </SecondaryNavItem>
            <SecondaryNavItem
              icon={<CreditCard className={iconClass} />}
              active={active === 'billing'}
              onClick={() => setActive('billing')}
            >
              請求
            </SecondaryNavItem>
          </SecondaryNavSection>
        </SecondaryNav>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-[var(--color-on-surface-secondary)]">
            セクション見出しは md 未満（横並び時）では非表示になり、
            項目だけが横一列に流れる。
          </p>
        </div>
      </div>
    );
  },
};

/**
 * asChild で各項目をリンク要素として描画する例。
 * ルーティングでアクティブ状態を持つ実アプリの構成に相当する。
 */
export const AsChildLinks: Story = {
  render: () => (
    <div className="flex h-[360px] flex-col bg-[var(--color-surface)] md:flex-row">
      <SecondaryNav aria-label="設定">
        <SecondaryNavHeader>設定</SecondaryNavHeader>
        <SecondaryNavItem asChild active icon={<User className={iconClass} />}>
          <a href="#profile">ユーザー設定</a>
        </SecondaryNavItem>
        <SecondaryNavItem
          asChild
          icon={<Bell className={iconClass} />}
          badge="2"
        >
          <a href="#notifications">通知設定</a>
        </SecondaryNavItem>
        <SecondaryNavItem asChild icon={<Users className={iconClass} />}>
          <a href="#team">チーム設定</a>
        </SecondaryNavItem>
      </SecondaryNav>
      <div className="flex-1 p-6 text-sm text-[var(--color-on-surface-secondary)]">
        next/link 等を単一子として渡す想定。
      </div>
    </div>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <div className="flex h-[300px] flex-col bg-[var(--color-surface)] md:flex-row">
      <SecondaryNav aria-label="設定" width={280}>
        <SecondaryNavHeader>設定（width=280）</SecondaryNavHeader>
        <SecondaryNavItem active>ユーザー設定</SecondaryNavItem>
        <SecondaryNavItem>通知設定</SecondaryNavItem>
        <SecondaryNavItem>チーム設定</SecondaryNavItem>
      </SecondaryNav>
      <div className="flex-1 p-6" />
    </div>
  ),
};

/**
 * AppShell に組み込んだ全体像。1階層目（AppShellSidebar + SidebarNav）で
 * 「設定」を選ぶと、その右に SecondaryNav が 2階層目として並ぶ。
 */
export const InsideAppShell: Story = {
  render: () => {
    const [active, setActive] = useState('profile');
    return (
      <div className="h-[560px]">
        <AppShell className="h-full">
          <AppShellSidebar>
            <div className="flex h-14 items-center border-b border-[var(--color-border)] px-4 font-semibold">
              Siracusa
            </div>
            <SidebarNav aria-label="メインナビゲーション" className="py-3">
              <SidebarNavItem>ダッシュボード</SidebarNavItem>
              <SidebarNavItem>案件</SidebarNavItem>
              <SidebarNavItem active icon={<Settings className={iconClass} />}>
                設定
              </SidebarNavItem>
            </SidebarNav>
          </AppShellSidebar>
          <div className="flex min-w-0 flex-1 flex-col">
            <AppShellHeader>
              <span className="font-medium">設定</span>
            </AppShellHeader>
            <AppShellContent className="flex flex-col md:flex-row">
              <SecondaryNav aria-label="設定">
                <SecondaryNavSection title="アカウント">
                  <SecondaryNavItem
                    icon={<User className={iconClass} />}
                    active={active === 'profile'}
                    onClick={() => setActive('profile')}
                  >
                    ユーザー設定
                  </SecondaryNavItem>
                  <SecondaryNavItem
                    icon={<Bell className={iconClass} />}
                    active={active === 'notifications'}
                    onClick={() => setActive('notifications')}
                  >
                    通知設定
                  </SecondaryNavItem>
                </SecondaryNavSection>
                <SecondaryNavSection title="ワークスペース">
                  <SecondaryNavItem
                    icon={<Users className={iconClass} />}
                    active={active === 'team'}
                    onClick={() => setActive('team')}
                  >
                    チーム設定
                  </SecondaryNavItem>
                </SecondaryNavSection>
              </SecondaryNav>
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-lg font-semibold">
                  {
                    {
                      profile: 'ユーザー設定',
                      notifications: '通知設定',
                      team: 'チーム設定',
                    }[active]
                  }
                </h2>
                <p className="mt-2 text-sm text-[var(--color-on-surface-secondary)]">
                  1階層目のサイドバーで「設定」を選択した状態。2階層目は
                  SecondaryNav が受け持つ。
                </p>
              </div>
            </AppShellContent>
          </div>
        </AppShell>
      </div>
    );
  },
};
