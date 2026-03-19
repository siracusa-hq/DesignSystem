import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * ChartLegend — Styled legend content for Recharts.
 *
 * Usage with Recharts:
 * ```tsx
 * <RechartsLegend content={<ChartLegend />} />
 * ```
 */

export interface ChartLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    type?: string;
    dataKey?: string;
  }>;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  payload,
  className,
}) => {
  if (!payload?.length) return null;

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3', className)}>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-muted)]">
          <span
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
ChartLegend.displayName = 'ChartLegend';
