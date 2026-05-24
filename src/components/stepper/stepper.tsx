import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Check, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/spinner';

/* --------------------------------------------------------
   Types
   -------------------------------------------------------- */

export type StepStatus = 'pending' | 'active' | 'completed' | 'error' | 'loading';
export type StepperConnector = 'line' | 'arrow' | 'chevron';

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
  connector?: StepperConnector;
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

const chevronSizeMap: Record<StepperSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

const indicatorHeight: Record<StepperSize, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
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
   Internal: StepConnector
   -------------------------------------------------------- */

function StepConnector({
  completed,
  orientation,
  connectorType,
  size,
}: {
  completed: boolean;
  orientation: StepperOrientation;
  connectorType: StepperConnector;
  size: StepperSize;
}) {
  const isH = orientation === 'horizontal';
  const lineColor = completed ? 'bg-primary-500' : 'bg-[var(--color-border)]';
  const iconColor = completed
    ? 'text-primary-500'
    : 'text-[var(--color-border)]';

  if (connectorType === 'arrow') {
    if (isH) {
      return (
        <div
          className={cn('flex items-center flex-1', indicatorHeight[size])}
          aria-hidden="true"
        >
          <div className="flex items-center flex-1 mx-1.5">
            <div
              className={cn(
                'h-0.5 flex-1 transition-colors duration-normal',
                lineColor,
              )}
            />
            <div
              className={cn(
                'w-0 h-0 shrink-0 border-y-[5px] border-y-transparent border-l-[7px] transition-colors duration-normal',
                completed
                  ? 'border-l-primary-500'
                  : 'border-l-[var(--color-border)]',
              )}
            />
          </div>
        </div>
      );
    }
    return (
      <div
        className="flex flex-col items-center min-h-6"
        aria-hidden="true"
      >
        <div
          className={cn(
            'w-0.5 flex-1 transition-colors duration-normal',
            lineColor,
          )}
        />
        <div
          className={cn(
            'w-0 h-0 shrink-0 border-x-[5px] border-x-transparent border-t-[7px] transition-colors duration-normal',
            completed
              ? 'border-t-primary-500'
              : 'border-t-[var(--color-border)]',
          )}
        />
      </div>
    );
  }

  if (connectorType === 'chevron') {
    const cSize = chevronSizeMap[size];
    if (isH) {
      return (
        <div
          className={cn('flex items-center flex-1', indicatorHeight[size])}
          aria-hidden="true"
        >
          <div
            className={cn(
              'flex items-center flex-1 mx-1 transition-colors duration-normal',
              iconColor,
            )}
          >
            <div className={cn('h-0.5 flex-1', lineColor)} />
            <ChevronRight
              size={cSize}
              className="shrink-0 mx-0.5"
              strokeWidth={2.5}
            />
            <div className={cn('h-0.5 flex-1', lineColor)} />
          </div>
        </div>
      );
    }
    return (
      <div
        className={cn(
          'flex flex-col items-center min-h-6 transition-colors duration-normal',
          iconColor,
        )}
        aria-hidden="true"
      >
        <div className={cn('w-0.5 flex-1', lineColor)} />
        <ChevronDown
          size={cSize}
          className="shrink-0 my-0.5"
          strokeWidth={2.5}
        />
        <div className={cn('w-0.5 flex-1', lineColor)} />
      </div>
    );
  }

  // Default: line
  if (isH) {
    return (
      <div
        className={cn('flex items-center flex-1', indicatorHeight[size])}
        aria-hidden="true"
      >
        <div
          className={cn(
            'h-0.5 flex-1 mx-2 transition-colors duration-normal',
            lineColor,
          )}
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'w-0.5 min-h-6 transition-colors duration-normal',
        lineColor,
      )}
      aria-hidden="true"
    />
  );
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
      connector: connectorType = 'line',
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

          const connectorEl = !isLast ? (
            <StepConnector
              completed={index < activeStep}
              orientation={orientation}
              connectorType={connectorType}
              size={size}
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
                {connectorEl}
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
                {connectorEl}
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
