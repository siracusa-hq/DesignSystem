import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DateRangePicker } from './date-range-picker';

describe('DateRangePicker', () => {
  it('renders a trigger button with placeholder', () => {
    render(<DateRangePicker aria-label="Period" />);
    const trigger = screen.getByLabelText('Period');
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveTextContent('期間を選択');
  });

  it('displays selected range', () => {
    render(
      <DateRangePicker
        aria-label="Period"
        value={{ from: '2024-06-10', to: '2024-06-20' }}
      />,
    );
    expect(screen.getByLabelText('Period')).toHaveTextContent(
      '2024/6/10 \u301C 2024/6/20',
    );
  });

  it('opens calendar and shows phase indicator', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Period" />);
    await user.click(screen.getByLabelText('Period'));
    expect(screen.getByText('開始日を選択')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a date range (from → to)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        value={{ from: '2024-06-15', to: '2024-06-20' }}
        onValueChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Period'));
    // Phase 1: select from
    await user.click(screen.getByText('10'));
    // Phase indicator should change
    expect(screen.getByText('終了日を選択')).toBeInTheDocument();
    // Phase 2: select to
    await user.click(screen.getByText('18'));

    expect(onChange).toHaveBeenCalledWith({
      from: '2024-06-10',
      to: '2024-06-18',
    });
  });

  it('auto-sorts when to < from', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        value={{ from: '2024-06-15', to: '2024-06-20' }}
        onValueChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Period'));
    // Pick "from" = 20, "to" = 5 (reversed)
    await user.click(screen.getByText('20'));
    await user.click(screen.getByText('5'));

    expect(onChange).toHaveBeenCalledWith({
      from: '2024-06-05',
      to: '2024-06-20',
    });
  });

  it('works in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        defaultValue={{ from: '2024-06-10', to: '2024-06-20' }}
      />,
    );

    const trigger = screen.getByLabelText('Period');
    expect(trigger).toHaveTextContent('2024/6/10 \u301C 2024/6/20');

    await user.click(trigger);
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('15'));

    expect(screen.getByLabelText('Period')).toHaveTextContent(
      '2024/6/1 \u301C 2024/6/15',
    );
  });

  it('navigates months', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        value={{ from: '2024-06-10', to: '2024-06-20' }}
      />,
    );

    await user.click(screen.getByLabelText('Period'));
    expect(screen.getByText('2024年6月')).toBeInTheDocument();

    await user.click(screen.getByLabelText('次の月'));
    expect(screen.getByText('2024年7月')).toBeInTheDocument();
  });

  it('disables dates outside min/max range', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        value={{ from: '2024-06-10', to: '2024-06-20' }}
        min="2024-06-05"
        max="2024-06-25"
      />,
    );

    await user.click(screen.getByLabelText('Period'));
    expect(screen.getByText('3')).toBeDisabled();
    expect(screen.getByText('28')).toBeDisabled();
    expect(screen.getByText('15')).not.toBeDisabled();
  });

  it('handles disabled state', () => {
    render(<DateRangePicker aria-label="Period" disabled />);
    expect(screen.getByLabelText('Period')).toBeDisabled();
  });

  it('applies size variants', () => {
    render(<DateRangePicker aria-label="Period" size="sm" />);
    expect(screen.getByLabelText('Period').className).toContain('h-8');
  });

  it('renders hidden inputs with name for forms', () => {
    const { container } = render(
      <DateRangePicker
        aria-label="Period"
        name="period"
        value={{ from: '2024-06-10', to: '2024-06-20' }}
      />,
    );
    const fromInput = container.querySelector(
      'input[name="period-from"]',
    ) as HTMLInputElement;
    const toInput = container.querySelector(
      'input[name="period-to"]',
    ) as HTMLInputElement;
    expect(fromInput).toHaveAttribute('value', '2024-06-10');
    expect(toInput).toHaveAttribute('value', '2024-06-20');
  });

  it('supports custom placeholder', () => {
    render(
      <DateRangePicker aria-label="Period" placeholder="Select period" />,
    );
    expect(screen.getByLabelText('Period')).toHaveTextContent('Select period');
  });

  it('supports keyboard selection', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        value={{ from: '2024-06-10', to: '2024-06-20' }}
        onValueChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Period'));

    // Focus should be on day 10 (from date)
    const day10 = screen.getByText('10');
    expect(document.activeElement).toBe(day10);

    // Enter to select as "from"
    await user.keyboard('{Enter}');
    expect(screen.getByText('終了日を選択')).toBeInTheDocument();

    // Arrow right 3 times → day 13
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    const day13 = screen.getByText('13');
    expect(document.activeElement).toBe(day13);

    // Enter to select as "to"
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith({
      from: '2024-06-10',
      to: '2024-06-13',
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label id="period-label">Period</label>
        <DateRangePicker aria-labelledby="period-label" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
