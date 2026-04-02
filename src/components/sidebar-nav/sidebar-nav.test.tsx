import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SidebarNav, SidebarNavGroup, SidebarNavItem } from './sidebar-nav';

describe('SidebarNav', () => {
  it('renders as a nav element', () => {
    render(
      <SidebarNav aria-label="Sidebar">
        <SidebarNavItem>Home</SidebarNavItem>
      </SidebarNav>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <SidebarNav aria-label="Sidebar" className="custom-nav">
        <SidebarNavItem>Home</SidebarNavItem>
      </SidebarNav>,
    );
    expect(screen.getByRole('navigation').className).toContain('custom-nav');
  });
});

describe('SidebarNavGroup', () => {
  it('renders title and children when open', () => {
    render(
      <SidebarNavGroup title="General" defaultOpen>
        <SidebarNavItem>Dashboard</SidebarNavItem>
        <SidebarNavItem>Settings</SidebarNavItem>
      </SidebarNavGroup>,
    );
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('hides children when defaultOpen is false', () => {
    render(
      <SidebarNavGroup title="General" defaultOpen={false}>
        <SidebarNavItem>Dashboard</SidebarNavItem>
      </SidebarNavGroup>,
    );
    expect(screen.getByText('General')).toBeInTheDocument();
    // Radix Collapsible removes closed content from the DOM
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('toggles children on click', async () => {
    const user = userEvent.setup();
    render(
      <SidebarNavGroup title="General" defaultOpen>
        <SidebarNavItem>Dashboard</SidebarNavItem>
      </SidebarNavGroup>,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    await user.click(screen.getByText('General'));
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    await user.click(screen.getByText('General'));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('supports controlled open state', async () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarNavGroup title="General" open={true} onOpenChange={onOpenChange}>
        <SidebarNavItem>Dashboard</SidebarNavItem>
      </SidebarNavGroup>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('General'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders icon when provided', () => {
    render(
      <SidebarNavGroup
        title="General"
        icon={<span data-testid="group-icon">G</span>}
      >
        <SidebarNavItem>Dashboard</SidebarNavItem>
      </SidebarNavGroup>,
    );
    expect(screen.getByTestId('group-icon')).toBeInTheDocument();
  });
});

describe('SidebarNavItem', () => {
  it('renders children as text', () => {
    render(<SidebarNavItem>Dashboard</SidebarNavItem>);
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <SidebarNavItem icon={<span data-testid="item-icon">I</span>}>
        Dashboard
      </SidebarNavItem>,
    );
    expect(screen.getByTestId('item-icon')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<SidebarNavItem badge="5">Inbox</SidebarNavItem>);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('sets aria-current when active', () => {
    render(<SidebarNavItem active>Dashboard</SidebarNavItem>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current when not active', () => {
    render(<SidebarNavItem>Dashboard</SidebarNavItem>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<SidebarNavItem onClick={onClick}>Dashboard</SidebarNavItem>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies active styles', () => {
    render(<SidebarNavItem active>Dashboard</SidebarNavItem>);
    expect(screen.getByRole('button').className).toContain('font-medium');
  });
});

describe('SidebarNav a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <SidebarNav aria-label="Sidebar navigation">
        <SidebarNavGroup title="Main">
          <SidebarNavItem active>Dashboard</SidebarNavItem>
          <SidebarNavItem badge="3">Projects</SidebarNavItem>
        </SidebarNavGroup>
        <SidebarNavGroup title="Settings" defaultOpen={false}>
          <SidebarNavItem>Preferences</SidebarNavItem>
        </SidebarNavGroup>
      </SidebarNav>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
