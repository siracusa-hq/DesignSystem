import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/button/button';

/* ------------------------------------------------------------------ */
/*  Helpers (shared)                                                   */
/* ------------------------------------------------------------------ */

export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplay(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateDisabled(
  date: Date,
  min: Date | null,
  max: Date | null,
): boolean {
  if (min) {
    const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    if (date < minDay) return true;
  }
  if (max) {
    const maxDay = new Date(max.getFullYear(), max.getMonth(), max.getDate());
    if (date > maxDay) return true;
  }
  return false;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isBetween(date: Date, from: Date, to: Date): boolean {
  const d = date.getTime();
  return d > from.getTime() && d < to.getTime();
}

/* ------------------------------------------------------------------ */
/*  CalendarGrid                                                       */
/* ------------------------------------------------------------------ */

export interface CalendarGridProps {
  /** Year/month currently displayed */
  viewYear: number;
  viewMonth: number;
  /** Navigate month by delta (-1 / +1) */
  onNavigateMonth: (delta: number) => void;
  /** Called when a day cell is clicked */
  onSelectDate: (date: Date) => void;
  /** Minimum selectable date */
  minDate: Date | null;
  /** Maximum selectable date */
  maxDate: Date | null;
  /** Render custom class names for each day cell */
  getDayClassName?: (date: Date, base: { isToday: boolean; isDisabled: boolean }) => string;
  /** Which day should be keyboard-focused? */
  focusedDay: Date | null;
  onFocusedDayChange: (date: Date) => void;
  /** Today shortcut handler (null to hide) */
  onTodayClick?: (() => void) | null;
  /** Whether today shortcut is disabled */
  todayDisabled?: boolean;
}

export function CalendarGrid({
  viewYear,
  viewMonth,
  onNavigateMonth,
  onSelectDate,
  minDate,
  maxDate,
  getDayClassName,
  focusedDay,
  onFocusedDayChange,
  onTodayClick,
  todayDisabled,
}: CalendarGridProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /* Calendar days -------------------------------------------------- */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDay = getStartDayOfWeek(viewYear, viewMonth);

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(viewYear, viewMonth, d));
  }

  /* Keyboard nav --------------------------------------------------- */
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedDay) return;

    let next: Date | null = null;

    switch (e.key) {
      case 'ArrowLeft':
        next = new Date(focusedDay);
        next.setDate(next.getDate() - 1);
        break;
      case 'ArrowRight':
        next = new Date(focusedDay);
        next.setDate(next.getDate() + 1);
        break;
      case 'ArrowUp':
        next = new Date(focusedDay);
        next.setDate(next.getDate() - 7);
        break;
      case 'ArrowDown':
        next = new Date(focusedDay);
        next.setDate(next.getDate() + 7);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isDateDisabled(focusedDay, minDate, maxDate)) {
          onSelectDate(focusedDay);
        }
        return;
      default:
        return;
    }

    e.preventDefault();

    if (next) {
      if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
        onNavigateMonth(
          next.getTime() > new Date(viewYear, viewMonth, 1).getTime() ? 1 : -1,
        );
      }
      onFocusedDayChange(next);
    }
  };

  // Focus the active day button
  React.useEffect(() => {
    if (focusedDay && gridRef.current) {
      const btn = gridRef.current.querySelector(
        `[data-date="${formatDate(focusedDay)}"]`,
      ) as HTMLButtonElement | null;
      btn?.focus();
    }
  }, [focusedDay]);

  const isPrevDisabled =
    minDate !== null &&
    viewYear === minDate.getFullYear() &&
    viewMonth <= minDate.getMonth();
  const isNextDisabled =
    maxDate !== null &&
    viewYear === maxDate.getFullYear() &&
    viewMonth >= maxDate.getMonth();

  return (
    <>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isPrevDisabled}
          onClick={() => onNavigateMonth(-1)}
          aria-label="前の月"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium">
          {viewYear}年{viewMonth + 1}月
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isNextDisabled}
          onClick={() => onNavigateMonth(1)}
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
            className="flex h-8 w-8 items-center justify-center text-xs font-medium text-[var(--color-on-surface-muted)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label={`${viewYear}年${viewMonth + 1}月`}
        className="grid grid-cols-7"
        onKeyDown={handleGridKeyDown}
      >
        {calendarDays.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="h-8 w-8" />;
          }

          const isToday = isSameDay(date, today);
          const isDisabled = isDateDisabled(date, minDate, maxDate);
          const isFocused = focusedDay ? isSameDay(date, focusedDay) : false;

          const customClassName = getDayClassName
            ? getDayClassName(date, { isToday, isDisabled })
            : '';

          return (
            <button
              key={formatDate(date)}
              type="button"
              role="gridcell"
              data-date={formatDate(date)}
              tabIndex={isFocused ? 0 : -1}
              disabled={isDisabled}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onSelectDate(date)}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center text-sm transition-colors duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
                'disabled:pointer-events-none disabled:opacity-35',
                customClassName,
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today shortcut */}
      {onTodayClick && (
        <div className="mt-2 border-t border-[var(--color-border)] pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            disabled={todayDisabled}
            onClick={onTodayClick}
          >
            今日
          </Button>
        </div>
      )}
    </>
  );
}
CalendarGrid.displayName = 'CalendarGrid';

/* Re-export isBetween for DateRangePicker */
export { isBetween };
