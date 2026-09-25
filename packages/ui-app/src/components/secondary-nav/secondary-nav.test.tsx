import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  SecondaryNav,
  SecondaryNavHeader,
  SecondaryNavSection,
  SecondaryNavItem,
} from './secondary-nav';

describe('SecondaryNav', () => {
  it('renders as a nav element', () => {
    render(
      <SecondaryNav aria-label="Settings">
        <SecondaryNavItem>User settings</SecondaryNavItem>
      </SecondaryNav>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <SecondaryNav aria-label="Settings" className="custom-nav">
        <SecondaryNavItem>User settings</SecondaryNavItem>
      </SecondaryNav>,
    );
    expect(screen.getByRole('navigation').className).toContain('custom-nav');
  });

  it('exposes width as a CSS variable', () => {
    render(
      <SecondaryNav aria-label="Settings" width={280}>
        <SecondaryNavItem>User settings</SecondaryNavItem>
      </SecondaryNav>,
    );
    expect(
      screen
        .getByRole('navigation')
        .style.getPropertyValue('--secondary-nav-width'),
    ).toBe('280px');
  });

  it('defaults width to 224px', () => {
    render(
      <SecondaryNav aria-label="Settings">
        <SecondaryNavItem>User settings</SecondaryNavItem>
      </SecondaryNav>,
    );
    expect(
      screen
        .getByRole('navigation')
        .style.getPropertyValue('--secondary-nav-width'),
    ).toBe('224px');
  });
});

describe('SecondaryNavHeader', () => {
  it('renders heading content', () => {
    render(
      <SecondaryNav aria-label="Settings">
        <SecondaryNavHeader>設定</SecondaryNavHeader>
        <SecondaryNavItem>User settings</SecondaryNavItem>
      </SecondaryNav>,
    );
    expect(screen.getByText('設定')).toBeInTheDocument();
  });
});

describe('SecondaryNavSection', () => {
  it('renders title and children', () => {
    render(
      <SecondaryNavSection title="General">
        <SecondaryNavItem>Profile</SecondaryNavItem>
        <SecondaryNavItem>Notifications</SecondaryNavItem>
      </SecondaryNavSection>,
    );
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders without a title', () => {
    render(
      <SecondaryNavSection>
        <SecondaryNavItem>Profile</SecondaryNavItem>
      </SecondaryNavSection>,
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});

describe('SecondaryNavItem', () => {
  it('renders children as text', () => {
    render(<SecondaryNavItem>Profile</SecondaryNavItem>);
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <SecondaryNavItem icon={<span data-testid="item-icon">I</span>}>
        Profile
      </SecondaryNavItem>,
    );
    expect(screen.getByTestId('item-icon')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<SecondaryNavItem badge="5">Notifications</SecondaryNavItem>);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('sets aria-current when active', () => {
    render(<SecondaryNavItem active>Profile</SecondaryNavItem>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current when not active', () => {
    render(<SecondaryNavItem>Profile</SecondaryNavItem>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<SecondaryNavItem onClick={onClick}>Profile</SecondaryNavItem>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies active styles', () => {
    render(<SecondaryNavItem active>Profile</SecondaryNavItem>);
    expect(screen.getByRole('button').className).toContain('font-medium');
  });

  it('is keyboard operable in document order', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SecondaryNav aria-label="Settings">
        <SecondaryNavItem>Profile</SecondaryNavItem>
        <SecondaryNavItem onClick={onSelect}>Notifications</SecondaryNavItem>
      </SecondaryNav>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Profile' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Notifications' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders as a link and hoists icon/badge when asChild', () => {
    render(
      <SecondaryNavItem
        asChild
        active
        icon={<span data-testid="item-icon">I</span>}
        badge="3"
      >
        <a href="/settings/profile">Profile</a>
      </SecondaryNavItem>,
    );
    const link = screen.getByRole('link', { name: /Profile/ });
    expect(link).toHaveAttribute('href', '/settings/profile');
    expect(link.className).toContain('font-medium');
    expect(link).toHaveAttribute('aria-current', 'page');
    // button 固有の type は anchor に漏れない
    expect(link).not.toHaveAttribute('type');
    expect(link).toContainElement(screen.getByTestId('item-icon'));
    expect(link).toContainElement(screen.getByText('3'));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('forwards ref to the anchor element when asChild', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <SecondaryNavItem asChild ref={ref}>
        <a href="/x">X</a>
      </SecondaryNavItem>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

describe('SecondaryNav a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <SecondaryNav aria-label="Settings navigation">
        <SecondaryNavHeader>Settings</SecondaryNavHeader>
        <SecondaryNavSection title="Account">
          <SecondaryNavItem active>Profile</SecondaryNavItem>
          <SecondaryNavItem badge="3">Notifications</SecondaryNavItem>
        </SecondaryNavSection>
        <SecondaryNavSection title="Workspace">
          <SecondaryNavItem>Team</SecondaryNavItem>
        </SecondaryNavSection>
      </SecondaryNav>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with asChild links', async () => {
    const { container } = render(
      <SecondaryNav aria-label="Settings navigation">
        <SecondaryNavItem asChild active icon={<span>I</span>}>
          <a href="/settings/profile">Profile</a>
        </SecondaryNavItem>
        <SecondaryNavItem asChild badge="3">
          <a href="/settings/notifications">Notifications</a>
        </SecondaryNavItem>
      </SecondaryNav>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
