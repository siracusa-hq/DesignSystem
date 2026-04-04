import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DollarSign, Users, FolderOpen, AlertCircle, Activity, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import {
  DashboardGrid,
  DashboardSection,
  DashboardPanel,
} from '../../components/dashboard-grid';
import { StatCard } from '../../components/stat-card';
import { ChartContainer } from '../../components/chart-container';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/card';

const meta: Meta = {
  title: 'Examples/Dashboard Presets',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/* ── Shared chart placeholder ─────────────────────────────────── */

function ChartPlaceholder({ label, h = '200px' }: { label: string; h?: string }) {
  return (
    <div
      className="w-full rounded-md bg-[var(--color-surface-muted)] flex items-center justify-center text-sm text-[var(--color-on-surface-muted)]"
      style={{ height: h }}
    >
      {label}
    </div>
  );
}

/* ================================================================
   Overview Preset
   4 StatCards → Main chart (8col) + Side panel (4col) → Full-width table
   ================================================================ */

export const Overview: Story = {
  render: () => (
    <DashboardGrid>
      <DashboardSection title="Overview">
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Total Revenue" value="¥1,234,567" trend="+12.5%" icon={<DollarSign className="h-4 w-4" />} />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Active Projects" value="24" trend="+3" icon={<FolderOpen className="h-4 w-4" />} />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Team Members" value="18" trend="+2" icon={<Users className="h-4 w-4" />} />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Open Issues" value="7" trend="-5" trendDirection="down" icon={<AlertCircle className="h-4 w-4" />} />
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection title="Trends">
        <DashboardPanel colSpan={{ default: 12, lg: 8 }}>
          <ChartContainer title="Revenue Trend" description="Monthly revenue over the past 12 months">
            <ChartPlaceholder label="Line Chart — Revenue Trend" h="280px" />
          </ChartContainer>
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, lg: 4 }}>
          <ChartContainer title="Revenue by Category" description="Breakdown by product line">
            <ChartPlaceholder label="Pie Chart — Categories" h="280px" />
          </ChartContainer>
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection title="Recent Activity">
        <DashboardPanel colSpan={12}>
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder label="Data Table — Recent activity" h="160px" />
            </CardContent>
          </Card>
        </DashboardPanel>
      </DashboardSection>
    </DashboardGrid>
  ),
};

/* ================================================================
   Analytics Preset
   3 StatCards → 2 equal charts → 2 equal charts
   ================================================================ */

export const Analytics: Story = {
  render: () => (
    <DashboardGrid>
      <DashboardSection title="Key Metrics">
        <DashboardPanel colSpan={{ default: 12, sm: 4 }} minColSpan={3}>
          <StatCard label="Page Views" value="1.2M" trend="+18%" icon={<Activity className="h-4 w-4" />} />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, sm: 4 }} minColSpan={3}>
          <StatCard label="Conversion Rate" value="3.24%" trend="+0.5%" icon={<TrendingUp className="h-4 w-4" />} />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, sm: 4 }} minColSpan={3}>
          <StatCard label="Avg. Session" value="4m 32s" trend="-12s" trendDirection="down" icon={<BarChart3 className="h-4 w-4" />} />
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection title="Traffic Analysis">
        <DashboardPanel colSpan={{ default: 12, md: 6 }}>
          <ChartContainer title="Traffic Sources" description="Where users come from">
            <ChartPlaceholder label="Bar Chart — Traffic Sources" h="240px" />
          </ChartContainer>
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, md: 6 }}>
          <ChartContainer title="User Demographics" description="Age and region breakdown">
            <ChartPlaceholder label="Pie Chart — Demographics" h="240px" />
          </ChartContainer>
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection title="Engagement">
        <DashboardPanel colSpan={{ default: 12, md: 6 }}>
          <ChartContainer title="Bounce Rate" description="Daily bounce rate trend">
            <ChartPlaceholder label="Area Chart — Bounce Rate" h="240px" />
          </ChartContainer>
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, md: 6 }}>
          <ChartContainer title="Session Duration" description="Average time on site">
            <ChartPlaceholder label="Line Chart — Session Duration" h="240px" />
          </ChartContainer>
        </DashboardPanel>
      </DashboardSection>
    </DashboardGrid>
  ),
};

/* ================================================================
   Monitoring Preset
   4 StatCards → Full-width large chart (rowSpan=3) → 3 small charts
   ================================================================ */

export const Monitoring: Story = {
  render: () => (
    <DashboardGrid>
      <DashboardSection title="System Status">
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="CPU Usage" value="42%" trend="-3%" />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Memory" value="6.2 GB" trend="+0.4 GB" trendDirection="up" />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Disk I/O" value="120 MB/s" trend="+15%" icon={<Activity className="h-4 w-4" />} />
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 6, lg: 3 }} minColSpan={3}>
          <StatCard label="Error Rate" value="0.03%" trend="-0.01%" icon={<PieChart className="h-4 w-4" />} />
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection title="Live Monitoring">
        <DashboardPanel colSpan={12} rowSpan={3}>
          <ChartContainer title="Request Throughput" description="Real-time requests per second across all services">
            <ChartPlaceholder label="Large Area Chart — Request Throughput" h="320px" />
          </ChartContainer>
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection title="Service Breakdown">
        <DashboardPanel colSpan={{ default: 12, md: 4 }}>
          <ChartContainer title="API Latency" description="P50 / P95 / P99">
            <ChartPlaceholder label="Line Chart — Latency" h="200px" />
          </ChartContainer>
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, md: 4 }}>
          <ChartContainer title="Error Distribution" description="By service">
            <ChartPlaceholder label="Bar Chart — Errors" h="200px" />
          </ChartContainer>
        </DashboardPanel>
        <DashboardPanel colSpan={{ default: 12, md: 4 }}>
          <ChartContainer title="Active Connections" description="Database pool utilization">
            <ChartPlaceholder label="Gauge Chart — Connections" h="200px" />
          </ChartContainer>
        </DashboardPanel>
      </DashboardSection>
    </DashboardGrid>
  ),
};
