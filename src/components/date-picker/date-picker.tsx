import * as React from 'react';
import { cn } from '@/lib/cn';
import { inputVariants, type InputProps } from '@/components/input/input';

export interface DatePickerProps extends InputProps {}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, size, ...props }, ref) => (
    <input
      ref={ref}
      type="date"
      className={cn(
        inputVariants({ size }),
        '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
        className,
      )}
      {...props}
    />
  ),
);
DatePicker.displayName = 'DatePicker';
