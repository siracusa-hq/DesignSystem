import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const spinnerVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const BARS = 8;

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} role="status" aria-label="Loading" {...props}>
      <svg
        className={cn(spinnerVariants({ size }), className)}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        {Array.from({ length: BARS }, (_, i) => (
          <rect
            key={i}
            x="11"
            y="2"
            width="2"
            height="6"
            rx="1"
            opacity={1 - i * (0.85 / BARS)}
            transform={`rotate(${i * (360 / BARS)} 12 12)`}
            style={{
              animation: 'spinner-fade 0.8s ease-in-out infinite',
              animationDelay: `${-i * 0.1}s`,
            }}
          />
        ))}
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  ),
);
Spinner.displayName = 'Spinner';
