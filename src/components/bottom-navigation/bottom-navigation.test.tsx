import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { BottomNavigation, BottomNavigationItem } from './bottom-navigation';

describe('BottomNavigation', () => {
  const icon = (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );

  it('renders as nav element', () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem icon={icon} label="Home" />
      </BottomNavigation>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders items with labels', () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem icon={icon} label="Home" />
        <BottomNavigationItem icon={icon} label="Settings" />
      </BottomNavigation>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('marks active item with aria-current', () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem icon={icon} label="Home" active />
        <BottomNavigationItem icon={icon} label="Settings" />
      </BottomNavigation>,
    );
    expect(screen.getByText('Home').closest('button')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('Settings').closest('button')).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('calls onClick on item', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <BottomNavigation>
        <BottomNavigationItem icon={icon} label="Home" onClick={onClick} />
      </BottomNavigation>,
    );
    await user.click(screen.getByText('Home'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLElement | null) => void>();
    render(
      <BottomNavigation ref={ref}>
        <BottomNavigationItem icon={icon} label="Home" />
      </BottomNavigation>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <BottomNavigation aria-label="Main navigation">
        <BottomNavigationItem icon={icon} label="Home" active />
        <BottomNavigationItem icon={icon} label="Settings" />
      </BottomNavigation>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
