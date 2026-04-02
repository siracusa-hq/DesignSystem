import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  LayoutDashboard,
  Folder,
  Users,
  FileText,
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Code,
  Activity,
} from 'lucide-react';
import {
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
} from '../components/sidebar-nav';

const meta: Meta<typeof SidebarNav> = {
  title: 'Components/SidebarNav',
  component: SidebarNav,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[240px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-3">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SidebarNav>;

const iconClass = 'h-[18px] w-[18px]';

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('Dashboard');
    return (
      <SidebarNav aria-label="Main navigation">
        <SidebarNavGroup title="General">
          <SidebarNavItem
            icon={<LayoutDashboard className={iconClass} />}
            active={active === 'Dashboard'}
            onClick={() => setActive('Dashboard')}
          >
            Dashboard
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Folder className={iconClass} />}
            badge="12"
            active={active === 'Projects'}
            onClick={() => setActive('Projects')}
          >
            Projects
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Users className={iconClass} />}
            active={active === 'Members'}
            onClick={() => setActive('Members')}
          >
            Members
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Activity className={iconClass} />}
            badge="3"
            active={active === 'Activity'}
            onClick={() => setActive('Activity')}
          >
            Activity
          </SidebarNavItem>
        </SidebarNavGroup>

        <SidebarNavGroup title="Content">
          <SidebarNavItem
            icon={<FileText className={iconClass} />}
            active={active === 'Documents'}
            onClick={() => setActive('Documents')}
          >
            Documents
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Database className={iconClass} />}
            active={active === 'Database'}
            onClick={() => setActive('Database')}
          >
            Database
          </SidebarNavItem>
        </SidebarNavGroup>

        <SidebarNavGroup title="Settings" defaultOpen={false}>
          <SidebarNavItem
            icon={<Settings className={iconClass} />}
            active={active === 'General'}
            onClick={() => setActive('General')}
          >
            General
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Shield className={iconClass} />}
            active={active === 'Security'}
            onClick={() => setActive('Security')}
          >
            Security
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Bell className={iconClass} />}
            active={active === 'Notifications'}
            onClick={() => setActive('Notifications')}
          >
            Notifications
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Palette className={iconClass} />}
            active={active === 'Appearance'}
            onClick={() => setActive('Appearance')}
          >
            Appearance
          </SidebarNavItem>
        </SidebarNavGroup>
      </SidebarNav>
    );
  },
};

export const CollapsedGroup: Story = {
  render: () => (
    <SidebarNav aria-label="Navigation">
      <SidebarNavGroup title="Open Group" defaultOpen>
        <SidebarNavItem icon={<LayoutDashboard className={iconClass} />} active>
          Dashboard
        </SidebarNavItem>
        <SidebarNavItem icon={<Folder className={iconClass} />}>
          Projects
        </SidebarNavItem>
      </SidebarNavGroup>
      <SidebarNavGroup title="Closed Group" defaultOpen={false}>
        <SidebarNavItem icon={<Settings className={iconClass} />}>
          Settings
        </SidebarNavItem>
        <SidebarNavItem icon={<Shield className={iconClass} />}>
          Security
        </SidebarNavItem>
      </SidebarNavGroup>
    </SidebarNav>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <SidebarNav aria-label="Navigation">
      <SidebarNavGroup title="Workspace">
        <SidebarNavItem icon={<LayoutDashboard className={iconClass} />} active>
          Dashboard
        </SidebarNavItem>
        <SidebarNavItem icon={<Folder className={iconClass} />} badge="12">
          Projects
        </SidebarNavItem>
        <SidebarNavItem icon={<Activity className={iconClass} />} badge="3">
          Activity
        </SidebarNavItem>
        <SidebarNavItem icon={<Bell className={iconClass} />} badge="99+">
          Notifications
        </SidebarNavItem>
      </SidebarNavGroup>
    </SidebarNav>
  ),
};

export const NoIcons: Story = {
  render: () => (
    <SidebarNav aria-label="Navigation">
      <SidebarNavGroup title="Pages">
        <SidebarNavItem active>Overview</SidebarNavItem>
        <SidebarNavItem>Analytics</SidebarNavItem>
        <SidebarNavItem>Reports</SidebarNavItem>
      </SidebarNavGroup>
      <SidebarNavGroup title="Admin">
        <SidebarNavItem>Users</SidebarNavItem>
        <SidebarNavItem>Billing</SidebarNavItem>
      </SidebarNavGroup>
    </SidebarNav>
  ),
};

export const DeveloperPortal: Story = {
  render: () => {
    const [active, setActive] = useState('API Keys');
    return (
      <SidebarNav aria-label="Developer navigation">
        <SidebarNavGroup title="API">
          <SidebarNavItem
            icon={<Code className={iconClass} />}
            active={active === 'API Keys'}
            onClick={() => setActive('API Keys')}
          >
            API Keys
          </SidebarNavItem>
          <SidebarNavItem
            icon={<FileText className={iconClass} />}
            active={active === 'Documentation'}
            onClick={() => setActive('Documentation')}
          >
            Documentation
          </SidebarNavItem>
        </SidebarNavGroup>
        <SidebarNavGroup title="Infrastructure">
          <SidebarNavItem
            icon={<Database className={iconClass} />}
            active={active === 'Databases'}
            onClick={() => setActive('Databases')}
          >
            Databases
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Activity className={iconClass} />}
            badge="2"
            active={active === 'Monitoring'}
            onClick={() => setActive('Monitoring')}
          >
            Monitoring
          </SidebarNavItem>
        </SidebarNavGroup>
        <SidebarNavGroup title="Security" defaultOpen={false}>
          <SidebarNavItem
            icon={<Shield className={iconClass} />}
            active={active === 'Auth'}
            onClick={() => setActive('Auth')}
          >
            Authentication
          </SidebarNavItem>
          <SidebarNavItem
            icon={<Settings className={iconClass} />}
            active={active === 'Permissions'}
            onClick={() => setActive('Permissions')}
          >
            Permissions
          </SidebarNavItem>
        </SidebarNavGroup>
      </SidebarNav>
    );
  },
};
