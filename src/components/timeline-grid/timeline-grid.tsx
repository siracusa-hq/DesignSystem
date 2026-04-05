import * as React from 'react';
import { cn } from '@/lib/cn';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export type TimelineGranularity = 'day' | 'week' | 'month';

export type TimelineColorVariant =
  | 'primary'
  | 'error'
  | 'warning'
  | 'success'
  | 'info';

export interface TimelineItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Start date (inclusive) */
  start: Date;
  /** End date (inclusive) */
  end: Date;
  /** Color variant */
  color?: TimelineColorVariant;
  /** Progress percentage (0–100) */
  progress?: number;
  /** Optional group key for row grouping */
  group?: string;
}

/* ================================================================== */
/*  Date helpers                                                       */
/* ================================================================== */

/** Strip time portion for date-only comparison */
function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** Difference in calendar days between two dates */
function diffDays(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.round(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / msPerDay,
  );
}

/** Add N days to a date */
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Short date label: 1, 2, … 31 */
function formatDayNum(d: Date): string {
  return String(d.getDate());
}

/** M/D format */
function formatDay(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** Short month label */
const MONTH_SHORT = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
] as const;

/** Weekday abbreviation */
const WEEKDAY_SHORT = ['日', '月', '火', '水', '木', '金', '土'] as const;

/** Generate date columns based on range and granularity */
function generateColumns(
  rangeStart: Date,
  rangeEnd: Date,
  granularity: TimelineGranularity,
): Date[] {
  const cols: Date[] = [];
  const current = startOfDay(new Date(rangeStart));
  const end = startOfDay(new Date(rangeEnd));

  if (granularity === 'day') {
    while (current <= end) {
      cols.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  } else if (granularity === 'week') {
    // Align to Monday
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diff);
    while (current <= end) {
      cols.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
  } else {
    current.setDate(1);
    while (current <= end) {
      cols.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
  }

  return cols;
}

/** Get the number of day-units a column spans */
function getColumnSpanDays(d: Date, granularity: TimelineGranularity): number {
  if (granularity === 'day') return 1;
  if (granularity === 'week') return 7;
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/* ================================================================== */
/*  Month groupings for the upper axis tier                            */
/* ================================================================== */

interface MonthGroup {
  label: string;
  colSpan: number;
}

function buildMonthGroups(
  columns: Date[],
  granularity: TimelineGranularity,
): MonthGroup[] {
  if (granularity === 'month') return [];

  const groups: MonthGroup[] = [];
  let prev = '';

  for (const col of columns) {
    const label = `${col.getFullYear()}年${MONTH_SHORT[col.getMonth()]}`;
    if (label === prev) {
      groups[groups.length - 1].colSpan += 1;
    } else {
      groups.push({ label, colSpan: 1 });
      prev = label;
    }
  }
  return groups;
}

/* ================================================================== */
/*  Color tokens                                                       */
/* ================================================================== */

/*
 * Modern approach: muted / translucent bar fills with a subtle left border
 * accent for color identification — inspired by Linear / GitHub Projects.
 */

const BAR_BG: Record<string, string> = {
  primary:
    'bg-primary-100 dark:bg-primary-900/40 border-l-primary-500',
  error:
    'bg-[var(--color-error-100)] dark:bg-[var(--color-error-900)]/40 border-l-[var(--color-error-500)]',
  warning:
    'bg-[var(--color-warning-100)] dark:bg-[var(--color-warning-900)]/40 border-l-[var(--color-warning-500)]',
  success:
    'bg-[var(--color-success-100)] dark:bg-[var(--color-success-900)]/40 border-l-[var(--color-success-500)]',
  info:
    'bg-[var(--color-info-100)] dark:bg-[var(--color-info-900)]/40 border-l-[var(--color-info-500)]',
};

const BAR_TEXT: Record<string, string> = {
  primary: 'text-primary-700 dark:text-primary-300',
  error: 'text-[var(--color-error-700)] dark:text-[var(--color-error-300)]',
  warning: 'text-[var(--color-warning-700)] dark:text-[var(--color-warning-300)]',
  success: 'text-[var(--color-success-700)] dark:text-[var(--color-success-300)]',
  info: 'text-[var(--color-info-700)] dark:text-[var(--color-info-300)]',
};

const PROGRESS_FILL: Record<string, string> = {
  primary: 'bg-primary-500/25 dark:bg-primary-400/20',
  error: 'bg-[var(--color-error)]/25 dark:bg-[var(--color-error)]/20',
  warning: 'bg-[var(--color-warning)]/25 dark:bg-[var(--color-warning)]/20',
  success: 'bg-[var(--color-success)]/25 dark:bg-[var(--color-success)]/20',
  info: 'bg-[var(--color-info)]/25 dark:bg-[var(--color-info)]/20',
};

/* ================================================================== */
/*  TimelineBar                                                        */
/* ================================================================== */

export interface TimelineBarProps {
  /** The timeline item to render */
  item: TimelineItem;
  /** Range start for positioning */
  rangeStart: Date;
  /** Total number of day-units in the range */
  totalDays: number;
  /** Called when bar is clicked */
  onClick?: (item: TimelineItem) => void;
  /** Additional class name */
  className?: string;
}

export const TimelineBar = React.forwardRef<HTMLDivElement, TimelineBarProps>(
  ({ item, rangeStart, totalDays, onClick, className }, ref) => {
    const offsetDays = Math.max(0, diffDays(rangeStart, item.start));
    const durationDays = Math.max(1, diffDays(item.start, item.end) + 1);

    const leftPercent = (offsetDays / totalDays) * 100;
    const widthPercent = (durationDays / totalDays) * 100;

    const color = item.color ?? 'primary';
    const hasProgress =
      item.progress != null && item.progress >= 0 && item.progress <= 100;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${item.label}: ${formatDay(item.start)}〜${formatDay(item.end)}${hasProgress ? ` ${item.progress}%` : ''}`}
        data-timeline-item-id={item.id}
        className={cn(
          // Layout
          'absolute top-1.5 bottom-1.5 min-w-1',
          // Shape — subtle rounding, left accent border
          'rounded-[5px] border-l-[3px]',
          // Color
          BAR_BG[color],
          // Interaction
          'transition-all duration-normal',
          onClick
            ? 'cursor-pointer hover:shadow-sm hover:brightness-95 dark:hover:brightness-110 active:scale-[0.995]'
            : 'cursor-default',
          className,
        )}
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
        }}
        onClick={onClick ? () => onClick(item) : undefined}
      >
        {/* Progress fill */}
        {hasProgress && (
          <div
            className={cn(
              'absolute inset-0 rounded-r-[5px]',
              PROGRESS_FILL[color],
            )}
            style={{ width: `${item.progress}%` }}
          />
        )}

        {/* Label */}
        <span
          className={cn(
            'relative z-10 flex items-center gap-1 h-full px-2',
            'text-[11px] leading-none font-medium truncate',
            BAR_TEXT[color],
          )}
        >
          <span className="truncate">{item.label}</span>
          {hasProgress && (
            <span className="shrink-0 tabular-nums opacity-60 text-[10px]">
              {item.progress}%
            </span>
          )}
        </span>
      </div>
    );
  },
);
TimelineBar.displayName = 'TimelineBar';

/* ================================================================== */
/*  TimelineTodayLine                                                  */
/* ================================================================== */

export interface TimelineTodayLineProps {
  /** Range start for positioning */
  rangeStart: Date;
  /** Total number of day-units */
  totalDays: number;
  /** Override "today" for testing */
  today?: Date;
  /** Additional class name */
  className?: string;
}

export const TimelineTodayLine: React.FC<TimelineTodayLineProps> = ({
  rangeStart,
  totalDays,
  today: todayOverride,
  className,
}) => {
  const today = todayOverride ?? new Date();
  const offset = diffDays(rangeStart, today);

  if (offset < 0 || offset >= totalDays) return null;

  const leftPercent = ((offset + 0.5) / totalDays) * 100;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 w-px',
        'bg-primary-500/60 dark:bg-primary-400/60',
        className,
      )}
      style={{ left: `${leftPercent}%` }}
    />
  );
};
TimelineTodayLine.displayName = 'TimelineTodayLine';

/* ================================================================== */
/*  TimelineAxis                                                       */
/* ================================================================== */

export interface TimelineAxisProps {
  /** Column dates */
  columns: Date[];
  /** Granularity */
  granularity: TimelineGranularity;
  /** Today override */
  today?: Date;
  /** Additional class name */
  className?: string;
}

export const TimelineAxis = React.forwardRef<HTMLDivElement, TimelineAxisProps>(
  ({ columns, granularity, today: todayProp, className }, ref) => {
    const todayStr = React.useMemo(() => {
      const t = todayProp ?? new Date();
      return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
    }, [todayProp]);

    const monthGroups = React.useMemo(
      () => buildMonthGroups(columns, granularity),
      [columns, granularity],
    );

    const hasUpperTier = monthGroups.length > 0;

    return (
      <div ref={ref} role="row" aria-label="タイムライン軸" className={cn('select-none', className)}>
        {/* Upper tier — month groupings */}
        {hasUpperTier && (
          <div className="flex border-b border-[var(--color-border)]">
            {monthGroups.map((group, i) => (
              <div
                key={i}
                className="flex items-center justify-start px-2 py-1 text-[11px] font-semibold text-[var(--color-on-surface-secondary)] border-r border-[var(--color-border)] last:border-r-0"
                style={{ flex: group.colSpan }}
              >
                {group.label}
              </div>
            ))}
          </div>
        )}

        {/* Lower tier — individual columns */}
        <div className="flex">
          {columns.map((col, i) => {
            const isWeekend =
              granularity === 'day' &&
              (col.getDay() === 0 || col.getDay() === 6);
            const colKey = `${col.getFullYear()}-${col.getMonth()}-${col.getDate()}`;
            const isToday = granularity === 'day' && colKey === todayStr;

            let label: string;
            if (granularity === 'day') {
              label = formatDayNum(col);
            } else if (granularity === 'week') {
              label = `${formatDay(col)}〜`;
            } else {
              label = `${col.getFullYear()}年${MONTH_SHORT[col.getMonth()]}`;
            }

            return (
              <div
                key={i}
                role="columnheader"
                className={cn(
                  'flex-1 min-w-0 border-r border-[var(--color-border)] last:border-r-0',
                  'flex flex-col items-center justify-center py-1',
                  isWeekend && 'bg-[var(--color-surface-sunken)]',
                )}
              >
                {/* Day number / label */}
                <span
                  className={cn(
                    'text-[11px] leading-tight tabular-nums',
                    isToday
                      ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white font-semibold text-[10px]'
                      : cn(
                          'font-medium text-[var(--color-on-surface-muted)]',
                          isWeekend && 'opacity-60',
                        ),
                  )}
                >
                  {label}
                </span>

                {/* Weekday abbreviation for day granularity */}
                {granularity === 'day' && !isToday && (
                  <span
                    className={cn(
                      'text-[9px] leading-tight mt-px',
                      col.getDay() === 0
                        ? 'text-[var(--color-error)] font-medium'
                        : col.getDay() === 6
                          ? 'text-[var(--color-info)] font-medium'
                          : 'text-[var(--color-on-surface-muted)] opacity-50',
                    )}
                  >
                    {WEEKDAY_SHORT[col.getDay()]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
TimelineAxis.displayName = 'TimelineAxis';

/* ================================================================== */
/*  TimelineRow                                                        */
/* ================================================================== */

export interface TimelineRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label for the row (shown in left gutter) */
  label?: string;
  /** Children (typically TimelineBar + TimelineTodayLine) */
  children?: React.ReactNode;
  /** Additional class name */
  className?: string;
}

export const TimelineRow = React.forwardRef<HTMLDivElement, TimelineRowProps>(
  ({ label, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="row"
        className={cn(
          'group relative flex',
          'border-b border-[var(--color-border)]/60 last:border-b-0',
          'transition-colors duration-fast',
          'hover:bg-[var(--color-surface-sunken)] dark:hover:bg-[var(--color-surface-muted)]/50',
          className,
        )}
        {...props}
      >
        {label != null && (
          <div
            role="rowheader"
            className={cn(
              'sticky left-0 z-10',
              'flex w-[var(--timeline-label-width,12rem)] shrink-0 items-center',
              'border-r border-[var(--color-border)] px-3',
              // Opaque bg for sticky overlap
              'bg-[var(--color-surface)]',
              'group-hover:bg-[var(--color-surface-sunken)] dark:group-hover:bg-[var(--color-surface-muted)]/50',
              'transition-colors duration-fast',
            )}
          >
            <span className="truncate text-[13px] text-[var(--color-on-surface)]">
              {label}
            </span>
          </div>
        )}
        <div
          role="cell"
          className="relative flex-1 min-h-[var(--timeline-row-height,2.25rem)]"
        >
          {children}
        </div>
      </div>
    );
  },
);
TimelineRow.displayName = 'TimelineRow';

/* ================================================================== */
/*  TimelineGrid                                                       */
/* ================================================================== */

export interface TimelineGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Start of the visible range */
  rangeStart: Date;
  /** End of the visible range */
  rangeEnd: Date;
  /** Time granularity */
  granularity?: TimelineGranularity;
  /** Row height CSS value */
  rowHeight?: string;
  /** Label column width CSS value */
  labelWidth?: string;
  /** Show the today marker line */
  showToday?: boolean;
  /** Override "today" for testing */
  today?: Date;
  /** Column minimum width CSS value */
  columnMinWidth?: string;
  /** Children (TimelineRow elements) */
  children?: React.ReactNode;
  /** Additional class name */
  className?: string;
}

export const TimelineGrid = React.forwardRef<HTMLDivElement, TimelineGridProps>(
  (
    {
      rangeStart,
      rangeEnd,
      granularity = 'day',
      rowHeight = '2.25rem',
      labelWidth = '12rem',
      showToday = true,
      today: todayOverride,
      columnMinWidth = '1.75rem',
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const columns = React.useMemo(
      () => generateColumns(rangeStart, rangeEnd, granularity),
      [rangeStart, rangeEnd, granularity],
    );

    const totalDays = React.useMemo(() => {
      if (columns.length === 0) return 0;
      return columns.reduce(
        (sum, col) => sum + getColumnSpanDays(col, granularity),
        0,
      );
    }, [columns, granularity]);

    const gridMinWidth = `calc(${columns.length} * ${columnMinWidth} + var(--timeline-label-width, ${labelWidth}))`;

    return (
      <div
        ref={ref}
        role="grid"
        aria-label="タイムライン"
        className={cn(
          'overflow-auto',
          'rounded-lg border border-[var(--color-border)]',
          'bg-[var(--color-surface)]',
          className,
        )}
        style={
          {
            '--timeline-row-height': rowHeight,
            '--timeline-label-width': labelWidth,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <div style={{ minWidth: gridMinWidth }}>
          {/* ---- Sticky header ---- */}
          <div className="sticky top-0 z-30 flex bg-[var(--color-surface)]">
            {/* Label gutter header */}
            <div
              className={cn(
                'sticky left-0 z-40',
                'flex w-[var(--timeline-label-width)] shrink-0 items-end',
                'border-b border-r border-[var(--color-border)]',
                'bg-[var(--color-surface)]',
                'px-3 pb-1',
              )}
            />
            {/* Axis */}
            <div className="flex-1 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <TimelineAxis
                columns={columns}
                granularity={granularity}
                today={todayOverride}
              />
            </div>
          </div>

          {/* ---- Body with grid lines ---- */}
          <div className="relative">
            {/* Vertical grid lines (background layer) */}
            <div
              className="pointer-events-none absolute inset-0 flex"
              aria-hidden="true"
            >
              <div className="w-[var(--timeline-label-width)] shrink-0" />
              <div className="flex flex-1">
                {columns.map((col, i) => {
                  const isWeekend =
                    granularity === 'day' &&
                    (col.getDay() === 0 || col.getDay() === 6);
                  // Month boundary gets a slightly stronger line
                  const isMonthStart =
                    granularity === 'day' && col.getDate() === 1 && i > 0;

                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex-1',
                        // Grid line — extremely subtle by default
                        i < columns.length - 1 &&
                          (isMonthStart
                            ? 'border-r border-[var(--color-border)]'
                            : 'border-r border-[var(--color-border)]/30'),
                        // Weekend fill
                        isWeekend && 'bg-[var(--color-surface-sunken)]/50',
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Rows */}
            <div role="rowgroup">
              {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                return React.cloneElement(
                  child as React.ReactElement<TimelineRowProps>,
                  {
                    children: (
                      <>
                        {showToday && (
                          <TimelineTodayLine
                            rangeStart={rangeStart}
                            totalDays={totalDays}
                            today={todayOverride}
                          />
                        )}
                        {React.Children.map(
                          (child as React.ReactElement<TimelineRowProps>).props
                            .children,
                          (barChild) => {
                            if (
                              React.isValidElement(barChild) &&
                              (barChild.type as { displayName?: string })
                                ?.displayName === 'TimelineBar'
                            ) {
                              return React.cloneElement(
                                barChild as React.ReactElement<TimelineBarProps>,
                                { rangeStart, totalDays },
                              );
                            }
                            return barChild;
                          },
                        )}
                      </>
                    ),
                  },
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
TimelineGrid.displayName = 'TimelineGrid';

/* ================================================================== */
/*  Re-export helpers for advanced usage                               */
/* ================================================================== */

export { generateColumns, getColumnSpanDays, diffDays, addDays, formatDay, startOfDay };
