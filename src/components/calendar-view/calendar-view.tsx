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
}

export interface CalendarViewProps {
  /** Events / items to display on dates */
  events?: CalendarEvent[];
  /** Default visible month in YYYY-MM format (uncontrolled) */
  defaultMonth?: string;
  /** Controlled visible month in YYYY-MM format */
  month?: string;
  /** Called when the visible month changes */
  onMonthChange?: (month: string) => void;
  /** Called when a date cell is clicked */
  onDateClick?: (date: string, events: CalendarEvent[]) => void;
  /** Custom day cell renderer — overrides default rendering */
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

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const DOT_COLORS: Record<string, string> = {
  primary: 'bg-primary-500',
  error: 'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
  success: 'bg-[var(--color-success)]',
  info: 'bg-[var(--color-info)]',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CalendarView = React.forwardRef<HTMLDivElement, CalendarViewProps>(
  (
    {
      events = [],
      defaultMonth,
      month: controlledMonth,
      onMonthChange,
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

    const defaultParsed = parseMonth(defaultMonth);
    const [internalYear, setInternalYear] = React.useState(
      defaultParsed?.year ?? today.getFullYear(),
    );
    const [internalMonth, setInternalMonth] = React.useState(
      defaultParsed?.month ?? today.getMonth(),
    );

    const controlledParsed = parseMonth(controlledMonth);
    const viewYear = controlledParsed?.year ?? internalYear;
    const viewMonth = controlledParsed?.month ?? internalMonth;

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

    /* Navigation */
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

      if (controlledParsed) {
        onMonthChange?.(formatMonth(newYear, newMonth));
      } else {
        setInternalYear(newYear);
        setInternalMonth(newMonth);
        onMonthChange?.(formatMonth(newYear, newMonth));
      }
    };

    /* Calendar grid — build rows of 7 for proper ARIA grid > row > gridcell */
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const startDay = getStartDayOfWeek(viewYear, viewMonth);

    const flatDays: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      flatDays.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      flatDays.push(new Date(viewYear, viewMonth, d));
    }
    // Pad end to fill the last row
    while (flatDays.length % 7 !== 0) {
      flatDays.push(null);
    }
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < flatDays.length; i += 7) {
      weeks.push(flatDays.slice(i, i + 7));
    }

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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateMonth(-1)}
            aria-label="前の月"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-semibold">
            {viewYear}年{viewMonth + 1}月
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateMonth(1)}
            aria-label="次の月"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-xs font-medium text-[var(--color-on-surface-muted)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div role="grid" aria-label={`${viewYear}年${viewMonth + 1}月`}>
          {weeks.map((week, wi) => (
            <div key={wi} role="row" className="grid grid-cols-7 gap-px">
              {week.map((date, di) => {
                if (!date) {
                  return <div key={`empty-${wi}-${di}`} role="gridcell" className="min-h-[4rem]" />;
                }

                const dateStr = formatDate(date);
                const dayEvents = eventsByDate.get(dateStr) ?? [];
                const isToday = isSameDay(date, today);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    role="gridcell"
                    data-date={dateStr}
                    aria-label={`${date.getMonth() + 1}月${date.getDate()}日${dayEvents.length > 0 ? ` ${dayEvents.length}件のイベント` : ''}`}
                    onClick={() => onDateClick?.(dateStr, dayEvents)}
                    className={cn(
                      'relative flex min-h-[4rem] flex-col items-start rounded-md p-1 text-left transition-colors duration-fast',
                      'hover:bg-[var(--color-surface-muted)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
                    )}
                  >
                    {/* Day number */}
                    <span
                      className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                        isToday && 'bg-primary-500 text-white font-semibold',
                      )}
                    >
                      {date.getDate()}
                    </span>

                    {/* Events / custom content */}
                    {renderDay ? (
                      renderDay(date, dayEvents)
                    ) : (
                      dayEvents.length > 0 && (
                        <div className="mt-0.5 flex w-full flex-col gap-0.5 overflow-hidden">
                          {dayEvents.slice(0, 3).map((event, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 min-w-0"
                            >
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
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[10px] text-[var(--color-on-surface-muted)]">
                              +{dayEvents.length - 3}件
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
CalendarView.displayName = 'CalendarView';
