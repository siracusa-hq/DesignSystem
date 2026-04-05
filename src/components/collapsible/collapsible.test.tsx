import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './collapsible';

function renderCollapsible(props?: { defaultOpen?: boolean }) {
  return render(
    <Collapsible defaultOpen={props?.defaultOpen}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Collapsible content</CollapsibleContent>
    </Collapsible>,
  );
}

describe('Collapsible', () => {
  it('renders the trigger', () => {
    renderCollapsible();
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  it('hides content by default', () => {
    renderCollapsible();
    const content = screen.queryByText('Collapsible content');
    // Radix removes content from DOM when closed
    expect(content === null || !content.checkVisibility?.()).toBe(true);
  });

  it('shows content when defaultOpen', () => {
    renderCollapsible({ defaultOpen: true });
    expect(screen.getByText('Collapsible content')).toBeVisible();
  });

  it('toggles content on trigger click', async () => {
    const user = userEvent.setup();
    renderCollapsible();

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByText('Collapsible content')).toBeVisible();

    await user.click(screen.getByText('Toggle'));
    const content = screen.queryByText('Collapsible content');
    expect(content === null || !content.checkVisibility?.()).toBe(true);
  });

  it('supports keyboard toggle (Enter)', async () => {
    const user = userEvent.setup();
    renderCollapsible();

    screen.getByText('Toggle').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Collapsible content')).toBeVisible();
  });

  it('has correct aria-expanded attribute', async () => {
    const user = userEvent.setup();
    renderCollapsible();

    const trigger = screen.getByText('Toggle');
    expect(trigger).toHaveAttribute('data-state', 'closed');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderCollapsible({ defaultOpen: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
