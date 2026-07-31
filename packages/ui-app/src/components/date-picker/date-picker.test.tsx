import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('renders a trigger button with placeholder', () => {
    render(<DatePicker aria-label="Date" />);
    const trigger = screen.getByLabelText('Date');
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveTextContent('日付を選択');
  });

  it('displays selected value', () => {
    render(<DatePicker aria-label="Date" value="2024-06-15" />);
    expect(screen.getByLabelText('Date')).toHaveTextContent('2024/6/15');
  });

  it('opens calendar on click', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" />);
    await user.click(screen.getByLabelText('Date'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a date and calls onValueChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Date"
        value="2024-06-15"
        onValueChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Date'));
    await user.click(screen.getByText('20'));
    expect(onChange).toHaveBeenCalledWith('2024-06-20');
  });

  it('works in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" defaultValue="2024-06-15" />);

    expect(screen.getByLabelText('Date')).toHaveTextContent('2024/6/15');

    await user.click(screen.getByLabelText('Date'));
    await user.click(screen.getByText('10'));

    expect(screen.getByLabelText('Date')).toHaveTextContent('2024/6/10');
  });

  it('navigates to next month', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" value="2024-06-15" />);

    await user.click(screen.getByLabelText('Date'));
    expect(screen.getByText('2024年6月')).toBeInTheDocument();

    await user.click(screen.getByLabelText('次の月'));
    expect(screen.getByText('2024年7月')).toBeInTheDocument();
  });

  it('navigates to previous month', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" value="2024-06-15" />);

    await user.click(screen.getByLabelText('Date'));
    await user.click(screen.getByLabelText('前の月'));
    expect(screen.getByText('2024年5月')).toBeInTheDocument();
  });

  it('disables dates outside min/max range', async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Date"
        value="2024-06-15"
        min="2024-06-10"
        max="2024-06-20"
      />,
    );

    await user.click(screen.getByLabelText('Date'));

    // Day 5 should be disabled (before min)
    const day5 = screen.getByText('5');
    expect(day5).toBeDisabled();

    // Day 25 should be disabled (after max)
    const day25 = screen.getByText('25');
    expect(day25).toBeDisabled();

    // Day 15 should be enabled
    const day15 = screen.getByText('15');
    expect(day15).not.toBeDisabled();
  });

  it('disables prev/next month nav when at min/max boundary', async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Date"
        value="2024-06-15"
        min="2024-06-01"
        max="2024-06-30"
      />,
    );

    await user.click(screen.getByLabelText('Date'));
    expect(screen.getByLabelText('前の月')).toBeDisabled();
    expect(screen.getByLabelText('次の月')).toBeDisabled();
  });

  it('handles disabled state', () => {
    render(<DatePicker aria-label="Date" disabled />);
    expect(screen.getByLabelText('Date')).toBeDisabled();
  });

  it('applies size variants', () => {
    render(<DatePicker aria-label="Date" size="sm" />);
    const trigger = screen.getByLabelText('Date');
    expect(trigger.className).toContain('h-8');
  });

  it('renders hidden input with name for forms', () => {
    const { container } = render(
      <DatePicker aria-label="Date" name="start_date" value="2024-06-15" />,
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'start_date');
    expect(hidden).toHaveAttribute('value', '2024-06-15');
  });

  it('selects today via shortcut button', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    render(<DatePicker aria-label="Date" onValueChange={onChange} />);
    await user.click(screen.getByLabelText('Date'));
    await user.click(screen.getByText('今日'));
    expect(onChange).toHaveBeenCalledWith(todayStr);
  });

  it('supports keyboard navigation', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Date"
        value="2024-06-15"
        onValueChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Date'));

    // Focus should be on day 15
    const day15 = screen.getByText('15');
    expect(document.activeElement).toBe(day15);

    // ArrowRight → 16
    await user.keyboard('{ArrowRight}');
    const day16 = screen.getByText('16');
    expect(document.activeElement).toBe(day16);

    // Enter to select
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('2024-06-16');
  });

  it('merges className on trigger', () => {
    render(<DatePicker className="custom-class" aria-label="Date" />);
    expect(screen.getByLabelText('Date')).toHaveClass('custom-class');
  });

  it('supports custom placeholder', () => {
    render(<DatePicker aria-label="Date" placeholder="Select date" />);
    expect(screen.getByLabelText('Date')).toHaveTextContent('Select date');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label id="date-label">Date</label>
        <DatePicker aria-labelledby="date-label" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
