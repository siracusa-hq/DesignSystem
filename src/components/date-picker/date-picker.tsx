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
  isDateDisabled,
} from './calendar';

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
    const [focusedDay, setFocusedDay] = React.useState<Date | null>(null);

    // Sync view when value changes externally
    React.useEffect(() => {
      if (selectedDate) {
        setViewYear(selectedDate.getFullYear());
        setViewMonth(selectedDate.getMonth());
      }
    }, [selectedValue]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset view to selected date when opening
    React.useEffect(() => {
      if (open) {
        const anchor = selectedDate ?? today;
        setViewYear(anchor.getFullYear());
        setViewMonth(anchor.getMonth());
        setFocusedDay(anchor);
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

    const getDayClassName = (date: Date, { isToday }: { isToday: boolean }) => {
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      return cn(
        'rounded-md',
        // Default
        !isSelected && !isToday && 'hover:bg-[var(--color-surface-muted)]',
        // Today (not selected)
        isToday &&
          !isSelected &&
          'border border-primary-500 text-primary-500 font-semibold',
        // Selected
        isSelected &&
          'bg-primary-500 text-white font-semibold hover:bg-primary-600',
      );
    };

    return (
      <>
        {name && <input type="hidden" name={name} value={selectedValue} />}

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
              onTodayClick={() => handleSelect(today)}
              todayDisabled={isDateDisabled(today, minDate, maxDate)}
            />
          </PopoverContent>
        </Popover>
      </>
    );
  },
);
DatePicker.displayName = 'DatePicker';
