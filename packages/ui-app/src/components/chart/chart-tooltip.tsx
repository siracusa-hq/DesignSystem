import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * ChartTooltip — Styled tooltip content for Recharts.
 *
 * Design: shadcn/ui-inspired grid layout with elevated shadow,
 * semi-transparent border, mono-spaced values, and rounded-square indicators.
 *
 * Usage with Recharts:
 * ```tsx
 * <RechartsTooltip
 *   content={<ChartTooltip />}
 *   cursor={{ stroke: 'var(--color-chart-cursor)', strokeWidth: 1 }}
 *   isAnimationActive={false}
 * />
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
  /** Indicator shape — "dot" (rounded square) | "line" | "dashed" */
  indicator?: 'dot' | 'line' | 'dashed';
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  indicator = 'dot',
  className,
}) => {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <div
      className={cn(
        'min-w-[8rem] rounded-lg border border-[var(--color-border)]/50 bg-[var(--color-surface-raised)] px-2.5 py-1.5 shadow-xl',
        'text-xs',
        className,
      )}
    >
      {displayLabel && (
        <p className="mb-1.5 font-medium text-[var(--color-on-surface)]">
          {displayLabel}
        </p>
      )}
      <div className="grid gap-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            {indicator === 'dot' && (
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: entry.color }}
              />
            )}
            {indicator === 'line' && (
              <span
                className="inline-block h-2.5 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
            )}
            {indicator === 'dashed' && (
              <span
                className="inline-block h-2.5 w-0 shrink-0 border-[1.5px] border-dashed"
                style={{ borderColor: entry.color }}
              />
            )}
            <span className="text-[var(--color-on-surface-muted)]">
              {entry.name}
            </span>
            <span className="ml-auto font-mono font-medium tabular-nums text-[var(--color-on-surface)]">
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
