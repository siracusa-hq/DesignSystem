import * as React from 'react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Strip time portion for date-only comparison */
function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** Difference in calendar days between two dates */
function diffDays(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / msPerDay);
}

/** Add N days to a date */
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Format date for display */
function formatDay(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatMonthLabel(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

/** Get Monday-start week label */
function getWeekLabel(d: Date): string {
  const start = new Date(d);
  // Align to Monday
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  const end = addDays(start, 6);
  return `${formatDay(start)}〜${formatDay(end)}`;
}

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
    // month
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
  // month: days in that month
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/* ------------------------------------------------------------------ */
/*  Color maps                                                         */
/* ------------------------------------------------------------------ */

const BAR_COLORS: Record<string, string> = {
  primary: 'bg-primary-500',
  error: 'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
  success: 'bg-[var(--color-success)]',
  info: 'bg-[var(--color-info)]',
};

const BAR_PROGRESS_COLORS: Record<string, string> = {
  primary: 'bg-primary-700',
  error: 'bg-[var(--color-error-700)]',
  warning: 'bg-[var(--color-warning-700)]',
  success: 'bg-[var(--color-success-700)]',
  info: 'bg-[var(--color-info-700)]',
};

const BAR_SUBTLE_COLORS: Record<string, string> = {
  primary: 'bg-primary-100',
  error: 'bg-[var(--color-error-100)]',
  warning: 'bg-[var(--color-warning-100)]',
  success: 'bg-[var(--color-success-100)]',
  info: 'bg-[var(--color-info-100)]',
};

/* ------------------------------------------------------------------ */
/*  TimelineBar                                                        */
/* ------------------------------------------------------------------ */

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
    const hasProgress = item.progress != null && item.progress >= 0 && item.progress <= 100;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${item.label}: ${formatDay(item.start)}〜${formatDay(item.end)}${hasProgress ? ` ${item.progress}%` : ''}`}
        data-timeline-item-id={item.id}
        className={cn(
          'absolute top-1 bottom-1 rounded-md cursor-default transition-opacity duration-fast',
          hasProgress ? BAR_SUBTLE_COLORS[color] : BAR_COLORS[color],
          onClick && 'cursor-pointer hover:opacity-80',
          className,
        )}
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
        }}
        onClick={onClick ? () => onClick(item) : undefined}
      >
        {hasProgress && (
          <div
            className={cn('absolute inset-y-0 left-0 rounded-md', BAR_COLORS[color])}
            style={{ width: `${item.progress}%` }}
          />
        )}
        <span
          className={cn(
            'relative z-10 block truncate px-2 py-0.5 text-xs leading-snug font-medium',
            hasProgress ? 'text-white' : 'text-white',
          )}
        >
          {item.label}
        </span>
      </div>
    );
  },
);
TimelineBar.displayName = 'TimelineBar';

/* ------------------------------------------------------------------ */
/*  TimelineTodayLine                                                  */
/* ------------------------------------------------------------------ */

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
        'pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-[var(--color-error)]',
        className,
      )}
      style={{ left: `${leftPercent}%` }}
    />
  );
};
TimelineTodayLine.displayName = 'TimelineTodayLine';

/* ------------------------------------------------------------------ */
/*  TimelineAxis                                                       */
/* ------------------------------------------------------------------ */

export interface TimelineAxisProps {
  /** Column dates */
  columns: Date[];
  /** Granularity */
  granularity: TimelineGranularity;
  /** Additional class name */
  className?: string;
}

export const TimelineAxis = React.forwardRef<HTMLDivElement, TimelineAxisProps>(
  ({ columns, granularity, className }, ref) => {
    return (
      <div
        ref={ref}
        role="row"
        aria-label="タイムライン軸"
        className={cn(
          'flex border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]',
          className,
        )}
      >
        {columns.map((col, i) => {
          const isWeekend =
            granularity === 'day' && (col.getDay() === 0 || col.getDay() === 6);

          let label: string;
          if (granularity === 'day') {
            label = formatDay(col);
          } else if (granularity === 'week') {
            label = getWeekLabel(col);
          } else {
            label = formatMonthLabel(col);
          }

          return (
            <div
              key={i}
              role="columnheader"
              className={cn(
                'flex-1 min-w-0 border-r border-[var(--color-border)] last:border-r-0',
                'px-1 py-1.5 text-center text-[10px] font-medium text-[var(--color-on-surface-muted)]',
                isWeekend && 'bg-[var(--color-surface-muted)] text-[var(--color-on-surface-muted)]',
              )}
            >
              <span className="truncate block">{label}</span>
              {granularity === 'day' && (
                <span className={cn(
                  'block text-[9px]',
                  col.getDay() === 0 && 'text-[var(--color-error)]',
                  col.getDay() === 6 && 'text-[var(--color-info)]',
                )}>
                  {['日', '月', '火', '水', '木', '金', '土'][col.getDay()]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);
TimelineAxis.displayName = 'TimelineAxis';

/* ------------------------------------------------------------------ */
/*  TimelineRow                                                        */
/* ------------------------------------------------------------------ */

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
          'group relative flex border-b border-[var(--color-border)] last:border-b-0',
          'hover:bg-[var(--color-surface-muted)] transition-colors duration-fast',
          className,
        )}
        {...props}
      >
        {label != null && (
          <div
            role="rowheader"
            className={cn(
              'sticky left-0 z-10 flex w-[var(--timeline-label-width,10rem)] shrink-0 items-center',
              'border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2',
              'text-xs font-medium text-[var(--color-on-surface)] truncate',
              'group-hover:bg-[var(--color-surface-muted)]',
            )}
          >
            <span className="truncate">{label}</span>
          </div>
        )}
        <div
          role="cell"
          className="relative flex-1 min-h-[var(--timeline-row-height,2rem)]"
        >
          {children}
        </div>
      </div>
    );
  },
);
TimelineRow.displayName = 'TimelineRow';

/* ------------------------------------------------------------------ */
/*  TimelineGrid                                                       */
/* ------------------------------------------------------------------ */

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
      rowHeight = '2.5rem',
      labelWidth = '10rem',
      showToday = true,
      today: todayOverride,
      columnMinWidth = '2rem',
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
      return columns.reduce((sum, col) => sum + getColumnSpanDays(col, granularity), 0);
    }, [columns, granularity]);

    // Min-width so columns don't collapse below threshold
    const gridMinWidth = `calc(${columns.length} * ${columnMinWidth} + var(--timeline-label-width, ${labelWidth}))`;

    return (
      <div
        ref={ref}
        role="grid"
        aria-label="タイムライン"
        className={cn(
          'overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]',
          className,
        )}
        style={{
          '--timeline-row-height': rowHeight,
          '--timeline-label-width': labelWidth,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        <div style={{ minWidth: gridMinWidth }}>
          {/* Axis header */}
          <div className="sticky top-0 z-30 flex">
            {/* Label gutter header */}
            <div
              className={cn(
                'sticky left-0 z-40 flex w-[var(--timeline-label-width)] shrink-0 items-center',
                'border-b border-r border-[var(--color-border)] bg-[var(--color-surface-muted)]',
                'px-3 py-1.5 text-[10px] font-medium text-[var(--color-on-surface-muted)]',
              )}
            />
            <div className="flex-1">
              <TimelineAxis columns={columns} granularity={granularity} />
            </div>
          </div>

          {/* Row body with column grid lines */}
          <div className="relative">
            {/* Vertical grid lines */}
            <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
              <div className="w-[var(--timeline-label-width)] shrink-0" />
              <div className="flex flex-1">
                {columns.map((col, i) => {
                  const isWeekend =
                    granularity === 'day' && (col.getDay() === 0 || col.getDay() === 6);
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 border-r border-[var(--color-border)] last:border-r-0',
                        isWeekend && 'bg-[var(--color-surface-muted)]/50',
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

                // Inject rangeStart/totalDays into row's bar children
                return React.cloneElement(child as React.ReactElement<TimelineRowProps>, {
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
                        (child as React.ReactElement<TimelineRowProps>).props.children,
                        (barChild) => {
                          if (
                            React.isValidElement(barChild) &&
                            (barChild.type as { displayName?: string })?.displayName ===
                              'TimelineBar'
                          ) {
                            return React.cloneElement(
                              barChild as React.ReactElement<TimelineBarProps>,
                              {
                                rangeStart,
                                totalDays,
                              },
                            );
                          }
                          return barChild;
                        },
                      )}
                    </>
                  ),
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
TimelineGrid.displayName = 'TimelineGrid';

/* ------------------------------------------------------------------ */
/*  Re-export helpers for advanced usage                               */
/* ------------------------------------------------------------------ */

export { generateColumns, getColumnSpanDays, diffDays, addDays, formatDay, startOfDay };
