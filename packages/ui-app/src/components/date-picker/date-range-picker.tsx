import * as React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { inputVariants } from '@/components/input/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/popover/popover';
import {
  CalendarGrid,
  parseDate,
  formatDate,
  formatDisplay,
  isSameDay,
  isBetween,
  isDateDisabled,
} from './calendar';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DateRange {
  from: string;
  to: string;
}

export interface DateRangePickerProps {
  /** Selected range (YYYY-MM-DD) */
  value?: DateRange;
  /** Default range (uncontrolled) */
  defaultValue?: DateRange;
  /** Called when the range changes */
  onValueChange?: (value: DateRange) => void;
  /** Minimum selectable date in YYYY-MM-DD format */
  min?: string;
  /** Maximum selectable date in YYYY-MM-DD format */
  max?: string;
  /** Placeholder text when no range is selected */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Input name prefix for form submission (creates name-from / name-to) */
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

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      min,
      max,
      placeholder = '期間を選択',
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
    const [internalValue, setInternalValue] = React.useState<DateRange>(
      defaultValue ?? { from: '', to: '' },
    );

    // Selection phase: 'from' = picking start, 'to' = picking end
    const [phase, setPhase] = React.useState<'from' | 'to'>('from');
    // Pending "from" during selection (before "to" is confirmed)
    const [pendingFrom, setPendingFrom] = React.useState<Date | null>(null);
    // Hover preview for range highlight
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;
    const fromDate = parseDate(currentValue.from);
    const toDate = parseDate(currentValue.to);
    const minDate = parseDate(min);
    const maxDate = parseDate(max);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [viewYear, setViewYear] = React.useState(
      fromDate?.getFullYear() ?? today.getFullYear(),
    );
    const [viewMonth, setViewMonth] = React.useState(
      fromDate?.getMonth() ?? today.getMonth(),
    );
    const [focusedDay, setFocusedDay] = React.useState<Date | null>(null);

    // Reset selection state when opening
    React.useEffect(() => {
      if (open) {
        const anchor = fromDate ?? today;
        setViewYear(anchor.getFullYear());
        setViewMonth(anchor.getMonth());
        setFocusedDay(anchor);
        // If a full range is already selected, start fresh on next interaction
        if (fromDate && toDate) {
          setPhase('from');
          setPendingFrom(null);
        } else if (fromDate && !toDate) {
          // Half-selected: continue picking "to"
          setPendingFrom(fromDate);
          setPhase('to');
        } else {
          setPhase('from');
          setPendingFrom(null);
        }
        setHoverDate(null);
      }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const commitRange = (from: Date, to: Date) => {
      // Ensure from <= to
      const [start, end] = from <= to ? [from, to] : [to, from];
      const range: DateRange = {
        from: formatDate(start),
        to: formatDate(end),
      };
      if (controlledValue === undefined) {
        setInternalValue(range);
      }
      onValueChange?.(range);
      setOpen(false);
      setPendingFrom(null);
      setPhase('from');
    };

    const handleSelect = (date: Date) => {
      if (phase === 'from') {
        setPendingFrom(date);
        setPhase('to');
      } else {
        // phase === 'to'
        commitRange(pendingFrom!, date);
      }
    };

    const navigateMonth = (delta: number) => {
      setViewMonth((prev) => {
        let m = prev + delta;
        if (m < 0) {
          m = 11;
          setViewYear((y) => y - 1);
        } else if (m > 11) {
          m = 0;
          setViewYear((y) => y + 1);
        }
        return m;
      });
    };

    /* Day styling --------------------------------------------------- */
    const getDayClassName = (date: Date, { isToday }: { isToday: boolean }) => {
      // Determine effective range for highlighting
      let rangeFrom: Date | null = null;
      let rangeTo: Date | null = null;

      if (phase === 'to' && pendingFrom) {
        // Actively selecting: show preview range
        rangeFrom = pendingFrom;
        rangeTo = hoverDate;
      } else if (fromDate && toDate) {
        // Committed range
        rangeFrom = fromDate;
        rangeTo = toDate;
      }

      // Normalize order
      if (rangeFrom && rangeTo && rangeFrom > rangeTo) {
        [rangeFrom, rangeTo] = [rangeTo, rangeFrom];
      }

      const isRangeStart = rangeFrom ? isSameDay(date, rangeFrom) : false;
      const isRangeEnd = rangeTo ? isSameDay(date, rangeTo) : false;
      const isInRange =
        rangeFrom && rangeTo ? isBetween(date, rangeFrom, rangeTo) : false;

      // Pending from highlight (when no "to" yet and not hovering)
      const isPendingFrom =
        phase === 'to' && pendingFrom && !hoverDate
          ? isSameDay(date, pendingFrom)
          : false;

      return cn(
        // Range endpoints: rounded on the outer edge, flat on the inner edge
        isRangeStart &&
          isRangeEnd &&
          'rounded-md bg-primary-500 text-white font-semibold hover:bg-primary-600',
        isRangeStart &&
          !isRangeEnd &&
          'rounded-l-md rounded-r-none bg-primary-500 text-white font-semibold hover:bg-primary-600',
        isRangeEnd &&
          !isRangeStart &&
          'rounded-r-md rounded-l-none bg-primary-500 text-white font-semibold hover:bg-primary-600',
        // In-range
        isInRange &&
          !isRangeStart &&
          !isRangeEnd &&
          'rounded-none bg-primary-100 dark:bg-primary-900/30 text-[var(--color-on-surface)]',
        // Pending "from" with no hover
        isPendingFrom &&
          'rounded-md bg-primary-500 text-white font-semibold hover:bg-primary-600',
        // Today (not part of range)
        isToday &&
          !isRangeStart &&
          !isRangeEnd &&
          !isInRange &&
          !isPendingFrom &&
          'rounded-md border border-primary-500 text-primary-500 font-semibold',
        // Default (not part of anything)
        !isRangeStart &&
          !isRangeEnd &&
          !isInRange &&
          !isToday &&
          !isPendingFrom &&
          'rounded-md hover:bg-[var(--color-surface-muted)]',
      );
    };

    /* Display text -------------------------------------------------- */
    const SEPARATOR = '\u301C'; // 〜
    const displayText =
      fromDate && toDate
        ? `${formatDisplay(fromDate)} ${SEPARATOR} ${formatDisplay(toDate)}`
        : fromDate
          ? `${formatDisplay(fromDate)} ${SEPARATOR}`
          : placeholder;
    const hasValue = !!(fromDate && toDate);

    /* Hover tracking for range preview ------------------------------ */
    const handlePointerMove = (e: React.PointerEvent) => {
      if (phase !== 'to') return;
      const target = (e.target as HTMLElement).closest('[data-date]');
      if (target) {
        const d = parseDate(target.getAttribute('data-date') ?? '');
        if (d && (!hoverDate || !isSameDay(d, hoverDate))) {
          setHoverDate(d);
        }
      }
    };

    const handlePointerLeave = () => {
      setHoverDate(null);
    };

    return (
      <>
        {name && (
          <>
            <input
              type="hidden"
              name={`${name}-from`}
              value={currentValue.from}
            />
            <input
              type="hidden"
              name={`${name}-to`}
              value={currentValue.to}
            />
          </>
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
                !hasValue && 'text-[var(--color-on-surface-muted)]',
                className,
              )}
            >
              <span className="truncate">{displayText}</span>
              <Calendar className="h-4 w-4 shrink-0 opacity-60" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-3"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* Phase indicator */}
            <div className="mb-2 text-xs text-center text-[var(--color-on-surface-muted)]">
              {phase === 'from' ? '開始日を選択' : '終了日を選択'}
            </div>

            <CalendarGrid
              viewYear={viewYear}
              viewMonth={viewMonth}
              onNavigateMonth={navigateMonth}
              onSelectDate={handleSelect}
              minDate={minDate}
              maxDate={maxDate}
              getDayClassName={getDayClassName}
              focusedDay={focusedDay}
              onFocusedDayChange={setFocusedDay}
              onTodayClick={null}
            />
          </PopoverContent>
        </Popover>
      </>
    );
  },
);
DateRangePicker.displayName = 'DateRangePicker';
