import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/spinner';

/* --------------------------------------------------------
   Types
   -------------------------------------------------------- */

export type StepStatus = 'pending' | 'active' | 'completed' | 'error' | 'loading';

export interface StepItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status?: StepStatus;
}

type StepperOrientation = 'horizontal' | 'vertical';
type StepperSize = 'sm' | 'md' | 'lg';

export interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, 'children'> {
  steps: StepItem[];
  activeStep: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  clickable?: boolean;
  onStepClick?: (index: number) => void;
}

/* --------------------------------------------------------
   CVA Variants
   -------------------------------------------------------- */

export const stepIndicatorVariants = cva(
  'flex items-center justify-center rounded-full font-medium shrink-0 transition-colors duration-normal border-2',
  {
    variants: {
      status: {
        pending:
          'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-on-surface-muted)]',
        active: 'border-primary-500 bg-primary-500 text-white',
        completed: 'border-primary-500 bg-primary-500 text-white',
        error: 'border-error-500 bg-error-500 text-white',
        loading: 'border-primary-500 bg-primary-500 text-white',
      },
      size: {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'md',
    },
  },
);

const connectorVariants = cva('transition-colors duration-normal', {
  variants: {
    completed: {
      true: 'bg-primary-500',
      false: 'bg-[var(--color-border)]',
    },
    orientation: {
      horizontal: 'h-0.5 flex-1 mx-2',
      vertical: 'w-0.5 min-h-6',
    },
  },
  defaultVariants: {
    completed: false,
    orientation: 'horizontal',
  },
});

const spinnerSizeMap: Record<StepperSize, 'sm' | 'sm' | 'sm'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'sm',
};

const checkSizeMap: Record<StepperSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

/* --------------------------------------------------------
   Internal: StepIndicator
   -------------------------------------------------------- */

function StepIndicatorContent({
  step,
  index,
  status,
  size,
}: {
  step: StepItem;
  index: number;
  status: StepStatus;
  size: StepperSize;
}) {
  if (step.icon && status !== 'completed' && status !== 'loading') {
    return <>{step.icon}</>;
  }
  if (status === 'loading') {
    return <Spinner size={spinnerSizeMap[size]} className="text-current" />;
  }
  if (status === 'completed') {
    const s = checkSizeMap[size];
    return <Check size={s} strokeWidth={3} />;
  }
  return <>{index + 1}</>;
}

/* --------------------------------------------------------
   Stepper
   -------------------------------------------------------- */

export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      className,
      steps,
      activeStep,
      orientation = 'horizontal',
      size = 'md',
      clickable = false,
      onStepClick,
      ...props
    },
    ref,
  ) => {
    return (
      <ol
        ref={ref}
        role="list"
        aria-label="Progress"
        className={cn(
          orientation === 'horizontal'
            ? 'flex items-start'
            : 'flex flex-col',
          className,
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const derivedStatus: StepStatus =
            step.status ??
            (index < activeStep
              ? 'completed'
              : index === activeStep
                ? 'active'
                : 'pending');

          const isLast = index === steps.length - 1;
          const isClickable =
            clickable &&
            (derivedStatus === 'completed' || derivedStatus === 'active');

          const handleClick = () => {
            if (isClickable && onStepClick) onStepClick(index);
          };

          const connector = !isLast ? (
            <div
              className={cn(
                connectorVariants({
                  completed: index < activeStep,
                  orientation,
                }),
              )}
              aria-hidden="true"
            />
          ) : null;

          const indicatorButton = (
            <button
              type="button"
              className={cn(
                stepIndicatorVariants({ status: derivedStatus, size }),
                isClickable &&
                  'cursor-pointer hover:ring-2 hover:ring-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2',
                !isClickable && 'cursor-default',
                'touch:min-h-[--touch-target-min] touch:min-w-[--touch-target-min]',
              )}
              onClick={handleClick}
              disabled={!isClickable}
              tabIndex={isClickable ? 0 : -1}
              aria-label={`Step ${index + 1}: ${step.label}${derivedStatus === 'completed' ? ' (completed)' : derivedStatus === 'error' ? ' (error)' : derivedStatus === 'loading' ? ' (loading)' : ''}`}
            >
              <StepIndicatorContent
                step={step}
                index={index}
                status={derivedStatus}
                size={size}
              />
            </button>
          );

          const labelEl = (
            <span
              className={cn(
                'text-sm font-medium',
                derivedStatus === 'active' &&
                  'text-[var(--color-on-surface)]',
                derivedStatus === 'pending' &&
                  'text-[var(--color-on-surface-secondary)]',
                derivedStatus === 'completed' &&
                  'text-[var(--color-on-surface-secondary)]',
                derivedStatus === 'loading' &&
                  'text-[var(--color-on-surface)]',
                derivedStatus === 'error' &&
                  'text-error-600 dark:text-error-400',
              )}
            >
              {step.label}
            </span>
          );

          const descEl = step.description ? (
            <span className="text-xs text-[var(--color-on-surface-muted)] max-w-[140px]">
              {step.description}
            </span>
          ) : null;

          if (orientation === 'horizontal') {
            return (
              <React.Fragment key={index}>
                <li
                  role="listitem"
                  aria-current={
                    derivedStatus === 'active' ? 'step' : undefined
                  }
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  {indicatorButton}
                  {labelEl}
                  {descEl}
                </li>
                {connector}
              </React.Fragment>
            );
          }

          // Vertical
          return (
            <li
              key={index}
              role="listitem"
              aria-current={
                derivedStatus === 'active' ? 'step' : undefined
              }
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                {indicatorButton}
                {connector}
              </div>
              <div className={cn('flex flex-col gap-0.5', !isLast && 'pb-6')}>
                {labelEl}
                {descEl}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
Stepper.displayName = 'Stepper';
