import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/cn';

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
));
RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-4 w-4 rounded-full border border-[--color-border-input] transition-colors duration-fast',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 ring-offset-[--color-ring-offset]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary-500',
      'touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="currentColor"
        className="text-primary-500"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';
