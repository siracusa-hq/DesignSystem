import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/button/button';
import {
  WEEKDAYS,
  formatDate,
  isSameDay,
} from '@/components/date-picker/calendar';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CalendarEvent {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Event title */
  title: string;
  /** Color variant for the dot indicator */
  color?: 'primary' | 'error' | 'warning' | 'success' | 'info';
  /** Optional start time (HH:MM) for day/week views */
  startTime?: string;
  /** Optional end time (HH:MM) for day/week views */
  endTime?: string;
}

export type CalendarViewMode = 'month' | 'week' | 'day';

export interface CalendarViewProps {
  /** View mode */
  view?: CalendarViewMode;
  /** Events / items to display on dates */
  events?: CalendarEvent[];
  /** Holiday dates in YYYY-MM-DD format (shown with Sunday styling) */
  holidays?: string[];
  /** Default visible month in YYYY-MM format (uncontrolled) */
  defaultMonth?: string;
  /** Default visible date in YYYY-MM-DD format (used for week/day views, uncontrolled) */
  defaultDate?: string;
  /** Controlled visible month in YYYY-MM format */
  month?: string;
  /** Controlled visible date in YYYY-MM-DD format (used for week/day views) */
  date?: string;
  /** Called when the visible month changes */
  onMonthChange?: (month: string) => void;
  /** Called when the visible date changes (week/day navigation) */
  onDateChange?: (date: string) => void;
  /** Called when a date cell is clicked */
  onDateClick?: (date: string, events: CalendarEvent[]) => void;
  /** Custom day cell renderer — overrides default rendering (month view only) */
  renderDay?: (date: Date, events: CalendarEvent[]) => React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseMonth(str: string | undefined): { year: number; month: number } | null {
  if (!str) return null;
  const [y, m] = str.split('-').map(Number);
  if (!y || !m) return null;
  return { year: y, month: m - 1 };
}

function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Get the Sunday-start week containing the given date */
function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
}

const DOT_COLORS: Record<string, string> = {
  primary: 'bg-primary-500',
  error: 'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
  success: 'bg-[var(--color-success)]',
  info: 'bg-[var(--color-info)]',
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
/** Default scroll offset: start at 6:30 → 6 hours × 48px = 288px */
const DEFAULT_SCROLL_TOP = 288;

/* Weekend / holiday cell styling */
const SATURDAY_BG = 'bg-[var(--color-info-50)]';
const SATURDAY_TEXT = 'text-[var(--color-info-500)]';
const SUNDAY_HOLIDAY_BG = 'bg-[var(--color-error-50)]';
const SUNDAY_HOLIDAY_TEXT = 'text-[var(--color-error-500)]';

function getDayTypeClasses(
  dayOfWeek: number,
  dateStr: string,
  holidaySet: Set<string>,
): { bg: string; text: string } {
  if (dayOfWeek === 0 || holidaySet.has(dateStr)) {
    return { bg: SUNDAY_HOLIDAY_BG, text: SUNDAY_HOLIDAY_TEXT };
  }
  if (dayOfWeek === 6) {
    return { bg: SATURDAY_BG, text: SATURDAY_TEXT };
  }
  return { bg: '', text: '' };
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

function EventDot({ event }: { event: CalendarEvent }) {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          DOT_COLORS[event.color ?? 'primary'],
        )}
      />
      <span className="truncate text-[10px] leading-tight text-[var(--color-on-surface)]">
        {event.title}
      </span>
    </div>
  );
}

function EventList({
  events,
  maxVisible = 3,
}: {
  events: CalendarEvent[];
  maxVisible?: number;
}) {
  if (events.length === 0) return null;
  return (
    <div className="mt-0.5 flex w-full flex-col gap-0.5 overflow-hidden">
      {events.slice(0, maxVisible).map((event, idx) => (
        <EventDot key={idx} event={event} />
      ))}
      {events.length > maxVisible && (
        <span className="text-[10px] text-[var(--color-on-surface-muted)]">
          +{events.length - maxVisible}件
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CalendarView = React.forwardRef<HTMLDivElement, CalendarViewProps>(
  (
    {
      view = 'month',
      events = [],
      holidays = [],
      defaultMonth,
      defaultDate,
      month: controlledMonth,
      date: controlledDate,
      onMonthChange,
      onDateChange,
      onDateClick,
      renderDay,
      className,
    },
    ref,
  ) => {
    const today = React.useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);

    /* Scroll refs for week/day time grids — scroll to 6:30 on mount */
    const weekGridRef = React.useRef<HTMLDivElement>(null);
    const dayGridRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (weekGridRef.current) weekGridRef.current.scrollTop = DEFAULT_SCROLL_TOP;
      if (dayGridRef.current) dayGridRef.current.scrollTop = DEFAULT_SCROLL_TOP;
    }, [view]);

    /* --- Month-level state (for month view) --- */
    const defaultMonthParsed = parseMonth(defaultMonth);
    const [internalYear, setInternalYear] = React.useState(
      defaultMonthParsed?.year ?? today.getFullYear(),
    );
    const [internalMonth, setInternalMonth] = React.useState(
      defaultMonthParsed?.month ?? today.getMonth(),
    );

    const controlledMonthParsed = parseMonth(controlledMonth);
    const viewYear = controlledMonthParsed?.year ?? internalYear;
    const viewMonth = controlledMonthParsed?.month ?? internalMonth;

    /* --- Date-level state (for week/day views) --- */
    const defaultDateParsed = parseDate(defaultDate);
    const [internalDate, setInternalDate] = React.useState<Date>(
      defaultDateParsed ?? today,
    );
    const controlledDateParsed = parseDate(controlledDate);
    const viewDate = controlledDateParsed ?? internalDate;

    /* Group events by date string for O(1) lookup */
    const eventsByDate = React.useMemo(() => {
      const map = new Map<string, CalendarEvent[]>();
      for (const event of events) {
        const existing = map.get(event.date);
        if (existing) {
          existing.push(event);
        } else {
          map.set(event.date, [event]);
        }
      }
      return map;
    }, [events]);

    const holidaySet = React.useMemo(() => new Set(holidays), [holidays]);

    /* --- Navigation helpers --- */
    const navigateMonth = (delta: number) => {
      let newYear = viewYear;
      let newMonth = viewMonth + delta;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      if (controlledMonthParsed) {
        onMonthChange?.(formatMonth(newYear, newMonth));
      } else {
        setInternalYear(newYear);
        setInternalMonth(newMonth);
        onMonthChange?.(formatMonth(newYear, newMonth));
      }
    };

    const navigateWeek = (delta: number) => {
      const next = new Date(viewDate);
      next.setDate(next.getDate() + delta * 7);
      if (controlledDateParsed) {
        onDateChange?.(formatDate(next));
      } else {
        setInternalDate(next);
        onDateChange?.(formatDate(next));
      }
    };

    const navigateDay = (delta: number) => {
      const next = new Date(viewDate);
      next.setDate(next.getDate() + delta);
      if (controlledDateParsed) {
        onDateChange?.(formatDate(next));
      } else {
        setInternalDate(next);
        onDateChange?.(formatDate(next));
      }
    };

    /* ============================================================== */
    /*  MONTH VIEW                                                     */
    /* ============================================================== */
    if (view === 'month') {
      const daysInMonth = getDaysInMonth(viewYear, viewMonth);
      const startDay = getStartDayOfWeek(viewYear, viewMonth);

      const flatDays: (Date | null)[] = [];
      for (let i = 0; i < startDay; i++) flatDays.push(null);
      for (let d = 1; d <= daysInMonth; d++) flatDays.push(new Date(viewYear, viewMonth, d));
      while (flatDays.length % 7 !== 0) flatDays.push(null);

      const weeks: (Date | null)[][] = [];
      for (let i = 0; i < flatDays.length; i += 7) weeks.push(flatDays.slice(i, i + 7));

      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
            className,
          )}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateMonth(-1)} aria-label="前の月">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{viewYear}年{viewMonth + 1}月</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateMonth(1)} aria-label="次の月">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Grid wrapper — single border + rounded corners */}
          <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
              {WEEKDAYS.map((day, i) => (
                <div key={day} className={cn(
                  'flex h-8 items-center justify-center text-xs font-medium text-[var(--color-on-surface-muted)]',
                  i === 0 && SUNDAY_HOLIDAY_TEXT,
                  i === 6 && SATURDAY_TEXT,
                )}>
                  {day}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div role="grid" aria-label={`${viewYear}年${viewMonth + 1}月`}>
            {weeks.map((week, wi) => (
              <div key={wi} role="row" className="grid grid-cols-7">
                {week.map((date, di) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${wi}-${di}`}
                        role="gridcell"
                        className="min-h-16 border-r border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/30"
                      />
                    );
                  }

                  const dateStr = formatDate(date);
                  const dayEvents = eventsByDate.get(dateStr) ?? [];
                  const isToday = isSameDay(date, today);
                  const dayType = getDayTypeClasses(date.getDay(), dateStr, holidaySet);

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      role="gridcell"
                      data-date={dateStr}
                      aria-label={`${date.getMonth() + 1}月${date.getDate()}日${dayEvents.length > 0 ? ` ${dayEvents.length}件のイベント` : ''}`}
                      onClick={() => onDateClick?.(dateStr, dayEvents)}
                      className={cn(
                        'relative flex min-h-16 flex-col items-start p-1 text-left transition-colors duration-fast',
                        'border-r border-b border-[var(--color-border)]',
                        dayType.bg,
                        'hover:bg-[var(--color-surface-muted)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                          isToday && 'bg-primary-500 text-white font-semibold',
                          !isToday && dayType.text,
                        )}
                      >
                        {date.getDate()}
                      </span>
                      {renderDay ? renderDay(date, dayEvents) : <EventList events={dayEvents} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          </div>
        </div>
      );
    }

    /* ============================================================== */
    /*  WEEK VIEW                                                      */
    /* ============================================================== */
    if (view === 'week') {
      const weekDates = getWeekDates(viewDate);
      const weekStart = weekDates[0];
      const weekEnd = weekDates[6];

      const headerLabel = weekStart.getMonth() === weekEnd.getMonth()
        ? `${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月${weekStart.getDate()}日〜${weekEnd.getDate()}日`
        : `${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月${weekStart.getDate()}日〜${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;

      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
            className,
          )}
        >
          {/* Week navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateWeek(-1)} aria-label="前の週">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{headerLabel}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateWeek(1)} aria-label="次の週">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[3rem_repeat(7,1fr)] border-b border-[var(--color-border)] pb-2 mb-2">
            <div className="h-10" />
            {weekDates.map((date, i) => {
              const isToday = isSameDay(date, today);
              const dayType = getDayTypeClasses(date.getDay(), formatDate(date), holidaySet);
              return (
                <div key={i} className={cn('flex h-10 flex-col items-center justify-center gap-0.5 text-xs font-medium text-[var(--color-on-surface-muted)]', dayType.text)}>
                  <span>{WEEKDAYS[date.getDay()]}</span>
                  <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full text-xs', isToday && 'bg-primary-500 text-white font-semibold')}>
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time grid — 48px/hour, 16h visible ≈ 768px */}
          <div
            ref={weekGridRef}
            role="grid"
            aria-label={headerLabel}
            className="h-[768px] overflow-y-auto rounded-md border border-[var(--color-border)]"
          >
            {HOURS.map((hour) => (
              <div key={hour} role="row" className="grid grid-cols-[3rem_repeat(7,1fr)]">
                {/* Time label */}
                <div className="flex h-12 items-start justify-end pr-2 pt-px border-r border-[var(--color-border)] text-[10px] leading-none text-[var(--color-on-surface-muted)]">
                  {String(hour).padStart(2, '0')}:00
                </div>
                {/* Day columns */}
                {weekDates.map((date) => {
                  const dateStr = formatDate(date);
                  const dayEvents = eventsByDate.get(dateStr) ?? [];
                  const hourEvents = dayEvents.filter((e) => {
                    if (!e.startTime) return hour === 9;
                    const h = parseInt(e.startTime.split(':')[0], 10);
                    return h === hour;
                  });
                  const dayType = getDayTypeClasses(date.getDay(), dateStr, holidaySet);

                  return (
                    <button
                      key={`${dateStr}-${hour}`}
                      type="button"
                      role="gridcell"
                      data-date={dateStr}
                      data-hour={hour}
                      aria-label={`${date.getMonth() + 1}月${date.getDate()}日 ${String(hour).padStart(2, '0')}:00`}
                      onClick={() => onDateClick?.(dateStr, dayEvents)}
                      className={cn(
                        'flex flex-col h-12 overflow-hidden border-r border-[var(--color-border)] text-left',
                        dayType.bg,
                        'hover:bg-[var(--color-surface-muted)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]',
                      )}
                    >
                      {/* :00 half — solid bottom border */}
                      <div className="h-1/2 min-h-0 overflow-hidden border-b border-[var(--color-border)] p-0.5">
                        {hourEvents.map((event, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'rounded px-1 py-0.5 text-[10px] leading-tight truncate text-white',
                              DOT_COLORS[event.color ?? 'primary'],
                            )}
                          >
                            {event.startTime && (
                              <span className="font-medium">{event.startTime} </span>
                            )}
                            {event.title}
                          </div>
                        ))}
                      </div>
                      {/* :30 half — dashed bottom border */}
                      <div className="h-1/2 border-b border-dashed border-[var(--color-border)]" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* ============================================================== */
    /*  DAY VIEW                                                       */
    /* ============================================================== */
    const dateStr = formatDate(viewDate);
    const dayEvents = eventsByDate.get(dateStr) ?? [];
    const isToday = isSameDay(viewDate, today);
    const dayType = getDayTypeClasses(viewDate.getDay(), dateStr, holidaySet);

    const dayLabel = `${viewDate.getFullYear()}年${viewDate.getMonth() + 1}月${viewDate.getDate()}日（${WEEKDAYS[viewDate.getDay()]}）`;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
          className,
        )}
      >
        {/* Day navigation */}
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateDay(-1)} aria-label="前の日">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className={cn('text-sm font-semibold', isToday && 'text-primary-500', !isToday && dayType.text)}>
            {dayLabel}
            {isToday && <span className="ml-2 text-xs font-normal">（今日）</span>}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateDay(1)} aria-label="次の日">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Time grid — 48px/hour, 16h visible ≈ 768px */}
        <div
          ref={dayGridRef}
          role="grid"
          aria-label={dayLabel}
          className="h-[768px] overflow-y-auto rounded-md border border-[var(--color-border)]"
        >
          {HOURS.map((hour) => {
            const hourEvents = dayEvents.filter((e) => {
              if (!e.startTime) return hour === 9;
              const h = parseInt(e.startTime.split(':')[0], 10);
              return h === hour;
            });

            return (
              <div key={hour} role="row" className="grid grid-cols-[3.5rem_1fr]">
                {/* Time label */}
                <div className="flex h-12 items-start justify-end pr-2 pt-px border-r border-[var(--color-border)] text-xs leading-none text-[var(--color-on-surface-muted)]">
                  {String(hour).padStart(2, '0')}:00
                </div>
                {/* Event area */}
                <button
                  type="button"
                  role="gridcell"
                  data-date={dateStr}
                  data-hour={hour}
                  aria-label={`${String(hour).padStart(2, '0')}:00`}
                  onClick={() => onDateClick?.(dateStr, dayEvents)}
                  className={cn(
                    'flex flex-col h-12 overflow-hidden text-left',
                    dayType.bg,
                    'hover:bg-[var(--color-surface-muted)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]',
                  )}
                >
                  {/* :00 half — solid bottom border */}
                  <div className="h-1/2 min-h-0 overflow-hidden border-b border-[var(--color-border)] px-2 py-0.5">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      {hourEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'rounded px-2 py-0.5 text-xs leading-tight truncate text-white',
                            DOT_COLORS[event.color ?? 'primary'],
                          )}
                        >
                          {event.startTime && (
                            <span className="font-medium">
                              {event.startTime}
                              {event.endTime && `〜${event.endTime}`}{' '}
                            </span>
                          )}
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* :30 half — dashed bottom border */}
                  <div className="h-1/2 border-b border-dashed border-[var(--color-border)]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
CalendarView.displayName = 'CalendarView';
