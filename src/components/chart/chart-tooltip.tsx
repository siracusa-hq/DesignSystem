import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * ChartTooltip — Styled tooltip content for Recharts.
 *
 * Usage with Recharts:
 * ```tsx
 * <RechartsTooltip content={<ChartTooltip />} />
 * ```
 */

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  /** Custom value formatter (e.g. currency, percentage) */
  formatter?: (value: number, name: string) => string;
  /** Custom label formatter */
  labelFormatter?: (label: string) => string;
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className,
}) => {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 shadow-md',
        'text-xs',
        className,
      )}
    >
      {displayLabel && (
        <p className="font-medium text-[var(--color-on-surface)] mb-1">
          {displayLabel}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[var(--color-on-surface-muted)]">
              {entry.name}
            </span>
            <span className="ml-auto font-medium tabular-nums text-[var(--color-on-surface)]">
              {formatter
                ? formatter(entry.value, entry.name)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
ChartTooltip.displayName = 'ChartTooltip';
