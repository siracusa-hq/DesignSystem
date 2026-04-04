import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { CalendarView, type CalendarEvent } from './calendar-view';

const SAMPLE_EVENTS: CalendarEvent[] = [
  { date: '2024-06-05', title: 'ミーティング', color: 'primary' },
  { date: '2024-06-05', title: 'レビュー', color: 'error' },
  { date: '2024-06-10', title: 'デプロイ', color: 'success' },
  { date: '2024-06-20', title: 'リリース', color: 'warning' },
];

/* ================================================================== */
/*  MONTH VIEW                                                         */
/* ================================================================== */

describe('CalendarView — month', () => {
  it('renders the current month by default', () => {
    render(<CalendarView />);
    const today = new Date();
    expect(
      screen.getByText(`${today.getFullYear()}年${today.getMonth() + 1}月`),
    ).toBeInTheDocument();
  });

  it('renders a specified default month', () => {
    render(<CalendarView defaultMonth="2024-06" />);
    expect(screen.getByText('2024年6月')).toBeInTheDocument();
  });

  it('renders controlled month', () => {
    render(<CalendarView month="2024-12" />);
    expect(screen.getByText('2024年12月')).toBeInTheDocument();
  });

  it('displays events on their dates', () => {
    render(<CalendarView defaultMonth="2024-06" events={SAMPLE_EVENTS} />);
    const day5 = screen.getByLabelText('6月5日 2件のイベント');
    expect(within(day5).getByText('ミーティング')).toBeInTheDocument();
    expect(within(day5).getByText('レビュー')).toBeInTheDocument();
  });

  it('truncates events when more than 3', () => {
    const manyEvents: CalendarEvent[] = [
      { date: '2024-06-15', title: 'A' },
      { date: '2024-06-15', title: 'B' },
      { date: '2024-06-15', title: 'C' },
      { date: '2024-06-15', title: 'D' },
    ];
    render(<CalendarView defaultMonth="2024-06" events={manyEvents} />);
    const day15 = screen.getByLabelText('6月15日 4件のイベント');
    expect(within(day15).getByText('+1件')).toBeInTheDocument();
  });

  it('navigates to next month', async () => {
    const user = userEvent.setup();
    render(<CalendarView defaultMonth="2024-06" />);
    await user.click(screen.getByLabelText('次の月'));
    expect(screen.getByText('2024年7月')).toBeInTheDocument();
  });

  it('navigates to previous month', async () => {
    const user = userEvent.setup();
    render(<CalendarView defaultMonth="2024-06" />);
    await user.click(screen.getByLabelText('前の月'));
    expect(screen.getByText('2024年5月')).toBeInTheDocument();
  });

  it('calls onMonthChange when navigating', async () => {
    const onMonthChange = vi.fn();
    const user = userEvent.setup();
    render(<CalendarView defaultMonth="2024-06" onMonthChange={onMonthChange} />);
    await user.click(screen.getByLabelText('次の月'));
    expect(onMonthChange).toHaveBeenCalledWith('2024-07');
  });

  it('calls onDateClick with date and events', async () => {
    const onDateClick = vi.fn();
    const user = userEvent.setup();
    render(
      <CalendarView defaultMonth="2024-06" events={SAMPLE_EVENTS} onDateClick={onDateClick} />,
    );
    await user.click(screen.getByLabelText('6月5日 2件のイベント'));
    expect(onDateClick).toHaveBeenCalledWith('2024-06-05', [SAMPLE_EVENTS[0], SAMPLE_EVENTS[1]]);
  });

  it('calls onDateClick for empty dates with empty events array', async () => {
    const onDateClick = vi.fn();
    const user = userEvent.setup();
    render(<CalendarView defaultMonth="2024-06" onDateClick={onDateClick} />);
    await user.click(screen.getByLabelText('6月1日'));
    expect(onDateClick).toHaveBeenCalledWith('2024-06-01', []);
  });

  it('supports renderDay for custom cell content', () => {
    render(
      <CalendarView
        defaultMonth="2024-06"
        events={SAMPLE_EVENTS}
        renderDay={(date, events) => (
          <span data-testid={`custom-${date.getDate()}`}>
            {events.length > 0 ? `${events.length}件` : ''}
          </span>
        )}
      />,
    );
    expect(screen.getByTestId('custom-5')).toHaveTextContent('2件');
    expect(screen.getByTestId('custom-1')).toHaveTextContent('');
  });

  it('highlights today', () => {
    render(<CalendarView />);
    const today = new Date();
    const todayLabel = `${today.getMonth() + 1}月${today.getDate()}日`;
    const todayCell = screen.getByLabelText(todayLabel);
    const dayNumber = within(todayCell).getByText(String(today.getDate()));
    expect(dayNumber.className).toContain('bg-primary-500');
  });

  it('wraps across year boundary (December → January)', async () => {
    const user = userEvent.setup();
    render(<CalendarView defaultMonth="2024-12" />);
    await user.click(screen.getByLabelText('次の月'));
    expect(screen.getByText('2025年1月')).toBeInTheDocument();
  });

  it('wraps across year boundary (January → December)', async () => {
    const user = userEvent.setup();
    render(<CalendarView defaultMonth="2025-01" />);
    await user.click(screen.getByLabelText('前の月'));
    expect(screen.getByText('2024年12月')).toBeInTheDocument();
  });

  it('merges className', () => {
    const { container } = render(<CalendarView className="custom-class" />);
    expect(container.firstElementChild).toHaveClass('custom-class');
  });

  it('renders proper ARIA grid > row > gridcell structure', () => {
    const { container } = render(<CalendarView defaultMonth="2024-06" />);
    const grid = container.querySelector('[role="grid"]');
    expect(grid).toBeInTheDocument();
    const rows = grid!.querySelectorAll('[role="row"]');
    expect(rows.length).toBeGreaterThanOrEqual(4);
    rows.forEach((row) => {
      const cells = row.querySelectorAll('[role="gridcell"]');
      expect(cells.length).toBe(7);
    });
  });

  it('has visible cell borders (border-r and border-b on day cells)', () => {
    const { container } = render(<CalendarView defaultMonth="2024-06" />);
    const dayButton = container.querySelector('button[data-date="2024-06-01"]');
    expect(dayButton).toBeInTheDocument();
    expect(dayButton!.className).toContain('border-r');
    expect(dayButton!.className).toContain('border-b');
  });

  it('applies Sunday background and text color', () => {
    // 2024-06-02 is Sunday
    const { container } = render(<CalendarView defaultMonth="2024-06" />);
    const sundayCell = container.querySelector('button[data-date="2024-06-02"]');
    expect(sundayCell!.className).toContain('--color-error-50');
  });

  it('applies Saturday background and text color', () => {
    // 2024-06-01 is Saturday
    const { container } = render(<CalendarView defaultMonth="2024-06" />);
    const saturdayCell = container.querySelector('button[data-date="2024-06-01"]');
    expect(saturdayCell!.className).toContain('--color-info-50');
  });

  it('applies holiday styling to weekday dates in holidays prop', () => {
    // 2024-06-11 is Tuesday but marked as holiday
    const { container } = render(
      <CalendarView defaultMonth="2024-06" holidays={['2024-06-11']} />,
    );
    const holidayCell = container.querySelector('button[data-date="2024-06-11"]');
    expect(holidayCell!.className).toContain('--color-error-50');
  });

  it('applies Saturday/Sunday text color to weekday headers', () => {
    const { container } = render(<CalendarView defaultMonth="2024-06" />);
    const headers = container.querySelectorAll('.grid.grid-cols-7.border-b > div');
    // Index 0 = 日 (Sunday) → error text, Index 6 = 土 (Saturday) → info text
    expect(headers[0].className).toContain('--color-error-500');
    expect(headers[6].className).toContain('--color-info-500');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CalendarView defaultMonth="2024-06" events={SAMPLE_EVENTS} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ================================================================== */
/*  WEEK VIEW                                                          */
/* ================================================================== */

describe('CalendarView — week', () => {
  it('renders week header with date range', () => {
    // 2024-06-05 is Wednesday → week = Sun 6/2 – Sat 6/8
    render(<CalendarView view="week" defaultDate="2024-06-05" />);
    expect(screen.getByText('2024年6月2日〜8日')).toBeInTheDocument();
  });

  it('renders 24 time rows', () => {
    const { container } = render(<CalendarView view="week" defaultDate="2024-06-05" />);
    const grid = container.querySelector('[role="grid"]');
    const rows = grid!.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(24);
  });

  it('navigates to next week', async () => {
    const user = userEvent.setup();
    render(<CalendarView view="week" defaultDate="2024-06-05" />);
    await user.click(screen.getByLabelText('次の週'));
    expect(screen.getByText('2024年6月9日〜15日')).toBeInTheDocument();
  });

  it('navigates to previous week', async () => {
    const user = userEvent.setup();
    render(<CalendarView view="week" defaultDate="2024-06-05" />);
    await user.click(screen.getByLabelText('前の週'));
    expect(screen.getByText('2024年5月26日〜6月1日')).toBeInTheDocument();
  });

  it('calls onDateChange on navigation', async () => {
    const onDateChange = vi.fn();
    const user = userEvent.setup();
    render(<CalendarView view="week" defaultDate="2024-06-05" onDateChange={onDateChange} />);
    await user.click(screen.getByLabelText('次の週'));
    expect(onDateChange).toHaveBeenCalledWith('2024-06-12');
  });

  it('displays events at their scheduled hour', () => {
    const events: CalendarEvent[] = [
      { date: '2024-06-05', title: '朝会', startTime: '09:00', color: 'primary' },
    ];
    render(<CalendarView view="week" defaultDate="2024-06-05" events={events} />);
    expect(screen.getByText('朝会')).toBeInTheDocument();
  });

  it('has half-hour dashed lines in time cells', () => {
    const { container } = render(<CalendarView view="week" defaultDate="2024-06-05" />);
    const dashedDivs = container.querySelectorAll('.border-dashed');
    // 24 hours × 7 days = 168 dashed lines
    expect(dashedDivs.length).toBe(168);
  });

  it('time grid container is scrollable', () => {
    const { container } = render(<CalendarView view="week" defaultDate="2024-06-05" />);
    const grid = container.querySelector('[role="grid"]');
    expect(grid!.className).toContain('overflow-y-auto');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CalendarView view="week" defaultDate="2024-06-05" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ================================================================== */
/*  DAY VIEW                                                           */
/* ================================================================== */

describe('CalendarView — day', () => {
  it('renders day header with date and day-of-week', () => {
    // 2024-06-05 is Wednesday (水)
    render(<CalendarView view="day" defaultDate="2024-06-05" />);
    expect(screen.getByText('2024年6月5日（水）')).toBeInTheDocument();
  });

  it('renders 24 time rows', () => {
    const { container } = render(<CalendarView view="day" defaultDate="2024-06-05" />);
    const grid = container.querySelector('[role="grid"]');
    const rows = grid!.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(24);
  });

  it('navigates to next day', async () => {
    const user = userEvent.setup();
    render(<CalendarView view="day" defaultDate="2024-06-05" />);
    await user.click(screen.getByLabelText('次の日'));
    expect(screen.getByText('2024年6月6日（木）')).toBeInTheDocument();
  });

  it('navigates to previous day', async () => {
    const user = userEvent.setup();
    render(<CalendarView view="day" defaultDate="2024-06-05" />);
    await user.click(screen.getByLabelText('前の日'));
    expect(screen.getByText('2024年6月4日（火）')).toBeInTheDocument();
  });

  it('calls onDateChange on navigation', async () => {
    const onDateChange = vi.fn();
    const user = userEvent.setup();
    render(<CalendarView view="day" defaultDate="2024-06-05" onDateChange={onDateChange} />);
    await user.click(screen.getByLabelText('次の日'));
    expect(onDateChange).toHaveBeenCalledWith('2024-06-06');
  });

  it('displays events with time range', () => {
    const events: CalendarEvent[] = [
      { date: '2024-06-05', title: '定例', startTime: '10:00', endTime: '11:00', color: 'primary' },
    ];
    render(<CalendarView view="day" defaultDate="2024-06-05" events={events} />);
    expect(screen.getByText('定例')).toBeInTheDocument();
    expect(screen.getByText('10:00〜11:00')).toBeInTheDocument();
  });

  it('has half-hour dashed lines in time cells', () => {
    const { container } = render(<CalendarView view="day" defaultDate="2024-06-05" />);
    const dashedDivs = container.querySelectorAll('.border-dashed');
    // 24 hours × 1 day column = 24 dashed lines
    expect(dashedDivs.length).toBe(24);
  });

  it('time grid container is scrollable', () => {
    const { container } = render(<CalendarView view="day" defaultDate="2024-06-05" />);
    const grid = container.querySelector('[role="grid"]');
    expect(grid!.className).toContain('overflow-y-auto');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CalendarView view="day" defaultDate="2024-06-05" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
