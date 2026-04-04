import * as React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { inputVariants } from '@/components/input/input';
import { Button } from '@/components/button/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/popover/popover';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isDateDisabled(
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DatePickerProps {
  /** Selected date in YYYY-MM-DD format */
  value?: string;
  /** Default date in YYYY-MM-DD format (uncontrolled) */
  defaultValue?: string;
  /** Called when the selected date changes */
  onValueChange?: (value: string) => void;
  /** Minimum selectable date in YYYY-MM-DD format */
  min?: string;
  /** Maximum selectable date in YYYY-MM-DD format */
  max?: string;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Input name for form submission */
  name?: string;
  /** Accessible label */
  'aria-label'?: string;
  /** ID of element labelling this picker */
  'aria-labelledby'?: string;
  /** Whether the value is invalid */
  'aria-invalid'?: boolean | 'true' | 'false';
  /** HTML id */
  id?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      min,
      max,
      placeholder = '日付を選択',
      size,
      disabled,
      className,
      name,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-invalid': ariaInvalid,
      id,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? '',
    );

    const selectedValue =
      controlledValue !== undefined ? controlledValue : internalValue;
    const selectedDate = parseDate(selectedValue);
    const minDate = parseDate(min);
    const maxDate = parseDate(max);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [viewYear, setViewYear] = React.useState(
      selectedDate?.getFullYear() ?? today.getFullYear(),
    );
    const [viewMonth, setViewMonth] = React.useState(
      selectedDate?.getMonth() ?? today.getMonth(),
    );

    // Sync view when value changes externally
    React.useEffect(() => {
      if (selectedDate) {
        setViewYear(selectedDate.getFullYear());
        setViewMonth(selectedDate.getMonth());
      }
    }, [selectedValue]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset view to selected date when opening
    React.useEffect(() => {
      if (open && selectedDate) {
        setViewYear(selectedDate.getFullYear());
        setViewMonth(selectedDate.getMonth());
      }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = (date: Date) => {
      const formatted = formatDate(date);
      if (controlledValue === undefined) {
        setInternalValue(formatted);
      }
      onValueChange?.(formatted);
      setOpen(false);
    };

    const navigateMonth = (delta: number) => {
      let newMonth = viewMonth + delta;
      let newYear = viewYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      setViewMonth(newMonth);
      setViewYear(newYear);
    };

    /* Calendar grid ------------------------------------------------ */
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const startDay = getStartDayOfWeek(viewYear, viewMonth);

    const calendarDays: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push(new Date(viewYear, viewMonth, d));
    }

    // Keyboard navigation within the calendar grid
    const [focusedDay, setFocusedDay] = React.useState<Date | null>(null);
    const gridRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (open) {
        setFocusedDay(
          selectedDate && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear
            ? selectedDate
            : new Date(viewYear, viewMonth, 1),
        );
      }
    }, [open, viewMonth, viewYear]); // eslint-disable-line react-hooks/exhaustive-deps

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
            handleSelect(focusedDay);
          }
          return;
        default:
          return;
      }

      e.preventDefault();

      if (next) {
        // Navigate month if needed
        if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
          setViewMonth(next.getMonth());
          setViewYear(next.getFullYear());
        }
        setFocusedDay(next);
      }
    };

    // Focus the active day button when focusedDay changes
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
        {/* Hidden input for form submission */}
        {name && (
          <input type="hidden" name={name} value={selectedValue} />
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={ref}
              type="button"
              id={id}
              disabled={disabled}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-invalid={ariaInvalid}
              aria-haspopup="dialog"
              className={cn(
                inputVariants({ size }),
                'cursor-pointer items-center justify-between text-left',
                !selectedDate && 'text-[var(--color-on-surface-muted)]',
                className,
              )}
            >
              <span className="truncate">
                {selectedDate ? formatDisplay(selectedDate) : placeholder}
              </span>
              <Calendar className="h-4 w-4 shrink-0 opacity-60" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-3"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={isPrevDisabled}
                onClick={() => navigateMonth(-1)}
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

                const isSelected = selectedDate
                  ? isSameDay(date, selectedDate)
                  : false;
                const isToday = isSameDay(date, today);
                const isDisabled = isDateDisabled(date, minDate, maxDate);
                const isFocused = focusedDay
                  ? isSameDay(date, focusedDay)
                  : false;

                return (
                  <button
                    key={formatDate(date)}
                    type="button"
                    role="gridcell"
                    data-date={formatDate(date)}
                    tabIndex={isFocused ? 0 : -1}
                    disabled={isDisabled}
                    aria-selected={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => handleSelect(date)}
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors duration-fast',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
                      'disabled:pointer-events-none disabled:opacity-35',
                      // Default
                      !isSelected &&
                        !isToday &&
                        'hover:bg-[var(--color-surface-muted)]',
                      // Today (not selected)
                      isToday &&
                        !isSelected &&
                        'border border-primary-500 text-primary-500 font-semibold',
                      // Selected
                      isSelected &&
                        'bg-primary-500 text-white font-semibold hover:bg-primary-600',
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            <div className="mt-2 border-t border-[var(--color-border)] pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                disabled={isDateDisabled(today, minDate, maxDate)}
                onClick={() => handleSelect(today)}
              >
                今日
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    );
  },
);
DatePicker.displayName = 'DatePicker';
