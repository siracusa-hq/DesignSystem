import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ----- StatCard ----- */

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric label (e.g. "Total Revenue") */
  label: string;
  /** Formatted value (e.g. "¥1,234,567") */
  value: string;
  /** Trend text (e.g. "+12.5%", "-3") */
  trend?: string;
  /** Trend direction — controls color. Default: inferred from trend string. */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Optional icon rendered left of the value */
  icon?: React.ReactNode;
}

function inferDirection(trend?: string): 'up' | 'down' | 'neutral' {
  if (!trend) return 'neutral';
  if (trend.startsWith('+')) return 'up';
  if (trend.startsWith('-')) return 'down';
  return 'neutral';
}

const TREND_STYLES = {
  up: 'text-success-600 dark:text-success-400',
  down: 'text-error-600 dark:text-error-400',
  neutral: 'text-[var(--color-on-surface-muted)]',
} as const;

const TREND_ICON_COMPONENTS = {
  up: ChevronUp,
  down: ChevronDown,
  neutral: null,
} as const;

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, trend, trendDirection, icon, ...props }, ref) => {
    const direction = trendDirection ?? inferDirection(trend);

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 sm:p-5',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--color-on-surface-muted)] uppercase tracking-wider">
            {label}
          </p>
          {icon && (
            <span className="text-[var(--color-on-surface-muted)]">{icon}</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl sm:text-2xl font-bold tabular-nums">{value}</span>
          {trend && (
            <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', TREND_STYLES[direction])}>
              {(() => {
                const TrendIcon = TREND_ICON_COMPONENTS[direction];
                return TrendIcon ? <TrendIcon className="h-3 w-3" strokeWidth={2.5} /> : null;
              })()}
              {trend}
            </span>
          )}
        </div>
      </div>
    );
  },
);
StatCard.displayName = 'StatCard';
