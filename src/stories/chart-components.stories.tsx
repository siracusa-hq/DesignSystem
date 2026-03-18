import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '../components/stat-card';
import { ChartContainer } from '../components/chart-container';
import { Button } from '../components/button';
import { Badge } from '../components/badge';
import { chartColors } from '../tokens/chart-theme';

/* ----- StatCard Stories ----- */

const statMeta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default statMeta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '¥1,234,567',
    trend: '+12.5%',
  },
};

export const NegativeTrend: Story = {
  args: {
    label: 'Open Issues',
    value: '18',
    trend: '-5',
    trendDirection: 'down',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Active Users',
    value: '1,024',
    trend: '+8%',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
};

export const Grid: Story = {
  name: 'Dashboard Grid',
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
      <StatCard label="Total Revenue" value="¥1,234,567" trend="+12.5%" />
      <StatCard label="Active Projects" value="24" trend="+3" />
      <StatCard label="Team Members" value="18" trend="+2" />
      <StatCard label="Open Issues" value="7" trend="-5" />
    </div>
  ),
};

export const NoTrend: Story = {
  args: {
    label: 'Deployments Today',
    value: '42',
  },
};

/* ----- ChartContainer Stories ----- */

export const ChartContainerDefault: Story = {
  name: 'ChartContainer',
  render: () => (
    <div className="max-w-2xl">
      <ChartContainer
        title="Revenue Over Time"
        description="Monthly breakdown for 2024"
        actions={
          <div className="flex gap-1">
            {['7D', '1M', '3M', '1Y'].map((p) => (
              <Button key={p} variant={p === '1M' ? 'default' : 'ghost'} size="sm" className="text-xs h-7 px-2.5">
                {p}
              </Button>
            ))}
          </div>
        }
      >
        {/* Placeholder for any chart library (Recharts, Chart.js, etc.) */}
        <div className="h-64 flex items-end gap-2 px-2">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor: chartColors.series[0],
                  opacity: i === 11 ? 1 : 0.7,
                }}
              />
              <span className="text-[10px] text-[var(--color-on-surface-muted)]">
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </ChartContainer>
    </div>
  ),
};

export const ChartColorPalette: Story = {
  name: 'Chart Color Palette',
  render: () => (
    <div className="max-w-lg">
      <ChartContainer title="Chart Color Palette" description="Curated color tokens for data visualization">
        <div className="flex flex-col gap-5">
          {/* Fill series */}
          <div>
            <p className="text-xs font-medium text-[var(--color-on-surface-muted)] mb-2.5">Fill Series</p>
            <div className="flex gap-1.5">
              {chartColors.series.map((color, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-[var(--color-on-surface-muted)] font-mono tabular-nums">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Stroke series */}
          <div>
            <p className="text-xs font-medium text-[var(--color-on-surface-muted)] mb-2.5">Stroke Series</p>
            <div className="flex gap-1.5">
              {chartColors.stroke.map((color, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-[var(--color-on-surface-muted)] font-mono tabular-nums">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Semantic */}
          <div>
            <p className="text-xs font-medium text-[var(--color-on-surface-muted)] mb-2.5">Semantic</p>
            <div className="flex gap-1.5">
              {Object.entries(chartColors.semantic).map(([name, color]) => (
                <div key={name} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-[var(--color-on-surface-muted)]">{name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Area Light */}
          <div>
            <p className="text-xs font-medium text-[var(--color-on-surface-muted)] mb-2.5">Area (Light)</p>
            <div className="flex gap-1.5">
              {chartColors.areaLight.map((color, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full h-10 rounded-lg border border-[var(--color-border)]" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-[var(--color-on-surface-muted)] font-mono tabular-nums">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartContainer>
    </div>
  ),
};

export const DashboardExample: Story = {
  name: 'Dashboard Composition',
  render: () => (
    <div className="max-w-5xl flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR" value="¥2.4M" trend="+18%" />
        <StatCard label="Customers" value="1,247" trend="+24" />
        <StatCard label="Churn Rate" value="2.3%" trend="-0.5%" trendDirection="up" />
        <StatCard label="ARPU" value="¥1,920" trend="+5%" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Monthly Revenue"
          actions={<Badge variant="success">+18% vs last year</Badge>}
        >
          <div className="h-48 flex items-end gap-1.5 px-1">
            {[35, 42, 58, 45, 62, 78, 65, 82, 72, 88, 92, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: `${h}%`, backgroundColor: chartColors.series[0], opacity: 0.8 }}
                />
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Revenue by Source">
          <div className="h-48 flex items-center justify-center gap-8">
            {/* Simple donut placeholder */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke={chartColors.series[0]} strokeWidth="5" strokeDasharray="44 56" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke={chartColors.series[1]} strokeWidth="5" strokeDasharray="28 72" strokeDashoffset="-44" />
                <circle cx="18" cy="18" r="14" fill="none" stroke={chartColors.series[2]} strokeWidth="5" strokeDasharray="18 82" strokeDashoffset="-72" />
                <circle cx="18" cy="18" r="14" fill="none" stroke={chartColors.series[3]} strokeWidth="5" strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: 'Direct', pct: '44%', color: chartColors.series[0] },
                { label: 'Organic', pct: '28%', color: chartColors.series[1] },
                { label: 'Referral', pct: '18%', color: chartColors.series[2] },
                { label: 'Social', pct: '10%', color: chartColors.series[3] },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-[var(--color-on-surface-secondary)]">{s.label}</span>
                  <span className="font-medium ml-auto tabular-nums">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  ),
};
