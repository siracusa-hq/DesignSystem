import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  TimelineGrid,
  TimelineRow,
  TimelineBar,
  TimelineGroup,
  TimelineTodayLine,
  TimelineAxis,
  type TimelineItem,
  generateColumns,
  diffDays,
  addDays,
  startOfDay,
} from './timeline-grid';

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const ITEMS: TimelineItem[] = [
  { id: '1', label: '要件定義', start: new Date(2025, 3, 1), end: new Date(2025, 3, 7), color: 'primary', progress: 100 },
  { id: '2', label: 'UIデザイン', start: new Date(2025, 3, 5), end: new Date(2025, 3, 14), color: 'info', progress: 50 },
  { id: '3', label: 'テスト', start: new Date(2025, 3, 20), end: new Date(2025, 3, 28), color: 'error' },
];

const RANGE_START = new Date(2025, 3, 1);
const RANGE_END = new Date(2025, 3, 30);
const TOTAL_DAYS = 30;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

describe('diffDays', () => {
  it('returns 0 for the same day', () => {
    expect(diffDays(new Date(2025, 0, 1), new Date(2025, 0, 1))).toBe(0);
  });

  it('returns positive for later dates', () => {
    expect(diffDays(new Date(2025, 0, 1), new Date(2025, 0, 10))).toBe(9);
  });

  it('returns negative for earlier dates', () => {
    expect(diffDays(new Date(2025, 0, 10), new Date(2025, 0, 1))).toBe(-9);
  });

  it('ignores time portion', () => {
    const a = new Date(2025, 0, 1, 23, 59);
    const b = new Date(2025, 0, 2, 0, 1);
    expect(diffDays(a, b)).toBe(1);
  });
});

describe('addDays', () => {
  it('adds days correctly', () => {
    const result = addDays(new Date(2025, 0, 1), 5);
    expect(result.getDate()).toBe(6);
  });

  it('handles month boundaries', () => {
    const result = addDays(new Date(2025, 0, 30), 3);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(2);
  });
});

describe('startOfDay', () => {
  it('strips time portion', () => {
    const result = startOfDay(new Date(2025, 5, 15, 14, 30, 45));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});

describe('generateColumns', () => {
  it('generates daily columns', () => {
    const cols = generateColumns(new Date(2025, 3, 1), new Date(2025, 3, 5), 'day');
    expect(cols).toHaveLength(5);
  });

  it('generates weekly columns', () => {
    const cols = generateColumns(new Date(2025, 3, 1), new Date(2025, 3, 30), 'week');
    expect(cols.length).toBeGreaterThanOrEqual(4);
    // All columns should be Mondays
    cols.forEach((col) => expect(col.getDay()).toBe(1));
  });

  it('generates monthly columns', () => {
    const cols = generateColumns(new Date(2025, 0, 1), new Date(2025, 5, 30), 'month');
    expect(cols).toHaveLength(6);
    // All columns should be 1st of month
    cols.forEach((col) => expect(col.getDate()).toBe(1));
  });
});

/* ------------------------------------------------------------------ */
/*  TimelineAxis                                                       */
/* ------------------------------------------------------------------ */

describe('TimelineAxis', () => {
  it('renders day numbers and month grouping', () => {
    const cols = generateColumns(new Date(2025, 3, 1), new Date(2025, 3, 3), 'day');
    render(<TimelineAxis columns={cols} granularity="day" />);
    // Day numbers in lower tier
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    // Month grouping in upper tier
    expect(screen.getByText('2025年4月')).toBeInTheDocument();
  });

  it('renders weekday names in day granularity', () => {
    const cols = generateColumns(new Date(2025, 3, 7), new Date(2025, 3, 7), 'day');
    render(<TimelineAxis columns={cols} granularity="day" />);
    // April 7 2025 = Monday
    expect(screen.getByText('月')).toBeInTheDocument();
  });

  it('renders month labels', () => {
    const cols = generateColumns(new Date(2025, 0, 1), new Date(2025, 2, 31), 'month');
    render(<TimelineAxis columns={cols} granularity="month" />);
    expect(screen.getByText('2025年1月')).toBeInTheDocument();
    expect(screen.getByText('2025年2月')).toBeInTheDocument();
    expect(screen.getByText('2025年3月')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  TimelineBar                                                        */
/* ------------------------------------------------------------------ */

describe('TimelineBar', () => {
  it('renders with item label', () => {
    render(
      <TimelineBar
        item={ITEMS[0]}
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
      />,
    );
    expect(screen.getByText('要件定義')).toBeInTheDocument();
  });

  it('has correct aria-label with date range', () => {
    render(
      <TimelineBar
        item={ITEMS[0]}
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
      />,
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('4/1〜4/7'),
    );
  });

  it('includes progress in aria-label when present', () => {
    render(
      <TimelineBar
        item={ITEMS[1]}
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
      />,
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('50%'),
    );
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <TimelineBar
        item={ITEMS[0]}
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
        onClick={handleClick}
      />,
    );
    await user.click(screen.getByText('要件定義'));
    expect(handleClick).toHaveBeenCalledWith(ITEMS[0]);
  });

  it('positions correctly based on date offset', () => {
    render(
      <TimelineBar
        item={ITEMS[2]} // starts April 20
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
      />,
    );
    const bar = screen.getByRole('img');
    // Offset: 19 days / 30 total = ~63.3%
    expect(bar.style.left).toMatch(/63\.\d+%/);
  });
});

/* ------------------------------------------------------------------ */
/*  TimelineTodayLine                                                  */
/* ------------------------------------------------------------------ */

describe('TimelineTodayLine', () => {
  it('renders when today is within range', () => {
    const today = new Date(2025, 3, 15);
    const { container } = render(
      <TimelineTodayLine
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
        today={today}
      />,
    );
    const line = container.firstChild as HTMLElement;
    expect(line).toBeInTheDocument();
    // Position: (14 + 0.5) / 30 * 100 ≈ 48.33%
    expect(line.style.left).toMatch(/48\.\d+%/);
  });

  it('does not render when today is outside range', () => {
    const today = new Date(2025, 5, 1); // June 1
    const { container } = render(
      <TimelineTodayLine
        rangeStart={RANGE_START}
        totalDays={TOTAL_DAYS}
        today={today}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  TimelineRow                                                        */
/* ------------------------------------------------------------------ */

describe('TimelineRow', () => {
  it('renders label in row header', () => {
    render(<TimelineRow label="タスクA" />);
    expect(screen.getByRole('rowheader')).toHaveTextContent('タスクA');
  });

  it('renders without label when not provided', () => {
    render(<TimelineRow />);
    expect(screen.queryByRole('rowheader')).toBeNull();
  });

  it('renders children in cell area', () => {
    render(
      <TimelineRow label="タスクB">
        <span data-testid="child">bar</span>
      </TimelineRow>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  TimelineGrid (integration)                                         */
/* ------------------------------------------------------------------ */

describe('TimelineGrid', () => {
  it('renders with role="grid"', () => {
    render(
      <TimelineGrid rangeStart={RANGE_START} rangeEnd={RANGE_END}>
        <TimelineRow label="タスク1">
          <TimelineBar item={ITEMS[0]} rangeStart={RANGE_START} totalDays={TOTAL_DAYS} />
        </TimelineRow>
      </TimelineGrid>,
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders multiple rows', () => {
    render(
      <TimelineGrid rangeStart={RANGE_START} rangeEnd={RANGE_END}>
        {ITEMS.map((item) => (
          <TimelineRow key={item.id} label={item.label}>
            <TimelineBar item={item} rangeStart={RANGE_START} totalDays={TOTAL_DAYS} />
          </TimelineRow>
        ))}
      </TimelineGrid>,
    );
    const rows = screen.getAllByRole('row');
    // 1 axis row + 3 data rows
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });

  it('applies custom row height via CSS variable', () => {
    render(
      <TimelineGrid rangeStart={RANGE_START} rangeEnd={RANGE_END} rowHeight="4rem">
        <TimelineRow label="Test" />
      </TimelineGrid>,
    );
    const grid = screen.getByRole('grid');
    expect(grid.style.getPropertyValue('--timeline-row-height')).toBe('4rem');
  });

  it('applies custom label width via CSS variable', () => {
    render(
      <TimelineGrid rangeStart={RANGE_START} rangeEnd={RANGE_END} labelWidth="15rem">
        <TimelineRow label="Test" />
      </TimelineGrid>,
    );
    const grid = screen.getByRole('grid');
    expect(grid.style.getPropertyValue('--timeline-label-width')).toBe('15rem');
  });

  it('passes a11y audit', async () => {
    const { container } = render(
      <TimelineGrid rangeStart={RANGE_START} rangeEnd={RANGE_END}>
        <TimelineRow label="タスク1">
          <TimelineBar item={ITEMS[0]} rangeStart={RANGE_START} totalDays={TOTAL_DAYS} />
        </TimelineRow>
      </TimelineGrid>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ------------------------------------------------------------------ */
/*  TimelineGroup                                                      */
/* ------------------------------------------------------------------ */

describe('TimelineGroup', () => {
  const MS_ITEM: TimelineItem = {
    id: 'ms1',
    label: 'マイルストーン1',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 20),
    color: 'primary',
    progress: 60,
  };

  it('renders group label with expand/collapse button', () => {
    render(
      <TimelineGroup label="MS1: リリース">
        <TimelineRow label="タスクA" />
      </TimelineGroup>,
    );
    expect(screen.getByText('MS1: リリース')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /折りたたむ/ })).toBeInTheDocument();
  });

  it('shows children when expanded (default)', () => {
    render(
      <TimelineGroup label="MS1">
        <TimelineRow label="子タスク" />
      </TimelineGroup>,
    );
    expect(screen.getByText('子タスク')).toBeInTheDocument();
  });

  it('hides children when defaultExpanded is false', () => {
    render(
      <TimelineGroup label="MS1" defaultExpanded={false}>
        <TimelineRow label="非表示タスク" />
      </TimelineGroup>,
    );
    expect(screen.queryByText('非表示タスク')).toBeNull();
  });

  it('toggles children on button click', async () => {
    const user = userEvent.setup();
    render(
      <TimelineGroup label="MS1">
        <TimelineRow label="トグルタスク" />
      </TimelineGroup>,
    );
    expect(screen.getByText('トグルタスク')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /折りたたむ/ }));
    expect(screen.queryByText('トグルタスク')).toBeNull();

    await user.click(screen.getByRole('button', { name: /展開する/ }));
    expect(screen.getByText('トグルタスク')).toBeInTheDocument();
  });

  it('calls onExpandedChange callback', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <TimelineGroup label="MS1" onExpandedChange={handler}>
        <TimelineRow label="タスク" />
      </TimelineGroup>,
    );
    await user.click(screen.getByRole('button', { name: /折りたたむ/ }));
    expect(handler).toHaveBeenCalledWith(false);
  });

  it('renders summary bar in group header', () => {
    render(
      <TimelineGroup
        label="MS1"
        bar={<TimelineBar item={MS_ITEM} rangeStart={RANGE_START} totalDays={TOTAL_DAYS} />}
      >
        <TimelineRow label="タスク" />
      </TimelineGroup>,
    );
    // The bar label should appear in the header
    expect(screen.getByText('マイルストーン1')).toBeInTheDocument();
  });

  it('works inside TimelineGrid with bar injection', () => {
    render(
      <TimelineGrid rangeStart={RANGE_START} rangeEnd={RANGE_END}>
        <TimelineGroup
          label="グループ1"
          bar={<TimelineBar item={MS_ITEM} rangeStart={RANGE_START} totalDays={TOTAL_DAYS} />}
        >
          <TimelineRow label="子タスク1">
            <TimelineBar item={ITEMS[0]} rangeStart={RANGE_START} totalDays={TOTAL_DAYS} />
          </TimelineRow>
        </TimelineGroup>
      </TimelineGrid>,
    );
    expect(screen.getByText('グループ1')).toBeInTheDocument();
    expect(screen.getByText('子タスク1')).toBeInTheDocument();
    expect(screen.getByText('マイルストーン1')).toBeInTheDocument();
  });
});
