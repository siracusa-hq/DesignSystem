import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/cn';

export type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
>;

export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, defaultValue, value, ...props }, ref) => {
  const thumbCount = value?.length ?? defaultValue?.length ?? 1;
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      defaultValue={defaultValue}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full cursor-pointer grow overflow-hidden rounded-full bg-[var(--color-surface-sunken)]">
        <SliderPrimitive.Range className="absolute h-full bg-primary-500" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            'block size-4 cursor-pointer rounded-full border-2 border-primary-500 bg-[var(--color-surface-raised)] shadow-sm touch:size-6',
            'transition-colors',
            'hover:border-primary-600 hover:scale-110',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = 'Slider';
