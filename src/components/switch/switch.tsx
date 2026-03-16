import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 ring-offset-[--color-ring-offset] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-600 touch:min-h-[--touch-target-min]',
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-fast',
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0',
        md: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        lg: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(switchVariants({ size }), className)}
    {...props}
  >
    <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';
