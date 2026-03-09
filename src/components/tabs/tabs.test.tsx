import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

function renderTabs(variant?: 'default' | 'underline') {
  return render(
    <Tabs defaultValue="tab1">
      <TabsList variant={variant}>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>,
  );
}

describe('Tabs', () => {
  it('renders with default tab active', () => {
    renderTabs();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderTabs();

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    tab1.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
  });

  it('renders default variant with pill style', () => {
    renderTabs('default');
    const tablist = screen.getByRole('tablist');
    expect(tablist.className).toContain('rounded-lg');
  });

  it('renders underline variant', () => {
    renderTabs('underline');
    const tablist = screen.getByRole('tablist');
    expect(tablist.className).toContain('border-b');
  });

  it('disables tab when disabled prop is set', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeDisabled();
  });

  it('merges custom className on TabsList', () => {
    render(
      <Tabs defaultValue="t1">
        <TabsList className="custom-class">
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
        <TabsContent value="t1">C</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tablist').className).toContain('custom-class');
  });

  it('merges custom className on TabsContent', () => {
    render(
      <Tabs defaultValue="t1">
        <TabsList>
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
        <TabsContent value="t1" className="custom-content">
          C
        </TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel').className).toContain('custom-content');
  });

  it('passes axe accessibility check', async () => {
    const { container } = renderTabs();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
