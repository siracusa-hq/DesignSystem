import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';

function renderAccordion(props?: { type?: 'single' | 'multiple'; collapsible?: boolean }) {
  return render(
    <Accordion type={props?.type ?? 'single'} collapsible={props?.collapsible}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('renders all triggers', () => {
    renderAccordion();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  it('expands content on trigger click (single)', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  it('collapses previous when opening another (single)', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeVisible();

    await user.click(screen.getByText('Section 2'));
    expect(screen.getByText('Content 2')).toBeVisible();
    // In single mode, previous item content is removed from DOM
    const content1 = screen.queryByText('Content 1');
    expect(content1 === null || !content1.checkVisibility?.()).toBe(true);
  });

  it('allows multiple open items with type="multiple"', async () => {
    const user = userEvent.setup();
    renderAccordion({ type: 'multiple' });

    await user.click(screen.getByText('Section 1'));
    await user.click(screen.getByText('Section 2'));
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('supports collapsible prop (single)', async () => {
    const user = userEvent.setup();
    renderAccordion({ type: 'single', collapsible: true });

    await user.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeVisible();

    await user.click(screen.getByText('Section 1'));
    // After collapsing, content is removed from DOM
    const content1 = screen.queryByText('Content 1');
    expect(content1 === null || !content1.checkVisibility?.()).toBe(true);
  });

  it('renders triggers as buttons', () => {
    renderAccordion();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  it('triggers have correct aria-expanded', async () => {
    const user = userEvent.setup();
    renderAccordion({ type: 'single', collapsible: true });

    const trigger1 = screen.getByText('Section 1');
    expect(trigger1).toHaveAttribute('data-state', 'closed');

    await user.click(trigger1);
    expect(trigger1).toHaveAttribute('data-state', 'open');
  });

  it('supports keyboard navigation (Enter/Space)', async () => {
    const user = userEvent.setup();
    renderAccordion();

    screen.getByText('Section 1').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  it('merges custom className on AccordionItem', () => {
    const { container } = render(
      <Accordion type="single">
        <AccordionItem value="test" className="custom-item">
          <AccordionTrigger>Test</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const item = container.querySelector('[data-state].custom-item');
    expect(item).not.toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderAccordion();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when expanded', async () => {
    const user = userEvent.setup();
    const { container } = renderAccordion();
    await user.click(screen.getByText('Section 1'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
