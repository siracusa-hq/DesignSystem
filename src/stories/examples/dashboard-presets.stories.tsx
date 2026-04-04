import type { Meta, StoryObj } from '@storybook/react';
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign, Users, FolderOpen, AlertCircle,
  Activity, TrendingUp, BarChart3, PieChart as PieChartIcon,
  Cpu, HardDrive, Wifi, Zap,
} from 'lucide-react';
import {
  DashboardGrid,
  DashboardSection,
  DashboardPanel,
} from '../../components/dashboard-grid';
import { StatCard } from '../../components/stat-card';
import { ChartContainer } from '../../components/chart-container';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/card';
import { getChartColors, getChartTheme, ChartTooltip, ChartLegend } from '../../components/chart';

const meta: Meta = {
  title: 'Examples/Dashboard Presets',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/* ── Sample Data ──────────────────────────────────────────────── */

const revenueData = [
  { month: 'Jul', revenue: 3800, cost: 2200 },
  { month: 'Aug', revenue: 4200, cost: 2400 },
  { month: 'Sep', revenue: 3600, cost: 2100 },
  { month: 'Oct', revenue: 5100, cost: 2800 },
  { month: 'Nov', revenue: 4800, cost: 2600 },
  { month: 'Dec', revenue: 5400, cost: 3000 },
  { month: 'Jan', revenue: 4900, cost: 2700 },
  { month: 'Feb', revenue: 5200, cost: 2900 },
  { month: 'Mar', revenue: 6100, cost: 3200 },
  { month: 'Apr', revenue: 5800, cost: 3100 },
  { month: 'May', revenue: 6400, cost: 3300 },
  { month: 'Jun', revenue: 7200, cost: 3500 },
];

const categoryData = [
  { name: 'SaaS', value: 42 },
  { name: 'Consulting', value: 28 },
  { name: 'License', value: 18 },
  { name: 'Support', value: 12 },
];

const trafficData = [
  { source: 'Organic', visits: 4200, conversions: 320 },
  { source: 'Direct', visits: 3100, conversions: 280 },
  { source: 'Referral', visits: 2400, conversions: 190 },
  { source: 'Social', visits: 1800, conversions: 120 },
  { source: 'Email', visits: 1200, conversions: 150 },
];

const sessionData = [
  { day: 'Mon', duration: 245, bounce: 42 },
  { day: 'Tue', duration: 268, bounce: 38 },
  { day: 'Wed', duration: 232, bounce: 45 },
  { day: 'Thu', duration: 278, bounce: 35 },
  { day: 'Fri', duration: 256, bounce: 40 },
  { day: 'Sat', duration: 198, bounce: 52 },
  { day: 'Sun', duration: 185, bounce: 55 },
];

const throughputData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  requests: Math.floor(800 + Math.random() * 600 + (i >= 9 && i <= 17 ? 400 : 0)),
  errors: Math.floor(2 + Math.random() * 8 + (i === 14 ? 25 : 0)),
}));

const latencyData = [
  { time: '00:00', p50: 45, p95: 120, p99: 280 },
  { time: '04:00', p50: 42, p95: 110, p99: 250 },
  { time: '08:00', p50: 52, p95: 145, p99: 320 },
  { time: '12:00', p50: 68, p95: 180, p99: 420 },
  { time: '16:00', p50: 72, p95: 195, p99: 450 },
  { time: '20:00', p50: 55, p95: 140, p99: 310 },
];

const errorDistribution = [
  { service: 'API Gateway', count: 42 },
  { service: 'Auth', count: 18 },
  { service: 'Database', count: 12 },
  { service: 'Storage', count: 8 },
  { service: 'Queue', count: 5 },
];

const formatCurrency = (v: number) => `¥${(v / 1000).toFixed(0)}K`;

/* ================================================================
   Overview Preset
   4 StatCards → Main chart (8col) + Pie (4col) → Activity table
   ================================================================ */

export const Overview: Story = {
  render: () => {
    const colors = getChartColors();
    const theme = getChartTheme();

    return (
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
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[1]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={{ stroke: theme.axisColor }} tickLine={false} />
                  <YAxis tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                  <RechartsTooltip content={<ChartTooltip formatter={(v) => `¥${v.toLocaleString()}`} />} />
                  <RechartsLegend content={<ChartLegend />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke={colors[0]} strokeWidth={2} fill="url(#gradRev)" />
                  <Area type="monotone" dataKey="cost" name="Cost" stroke={colors[1]} strokeWidth={2} fill="url(#gradCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 12, lg: 4 }}>
            <ChartContainer title="Revenue by Category" description="Breakdown by product line">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltip />} cursor={false} />
                  <RechartsLegend content={<ChartLegend />} />
                </PieChart>
              </ResponsiveContainer>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-(--color-border)">
                        <th className="text-left py-2 px-3 font-medium text-(--color-on-surface-muted)">Action</th>
                        <th className="text-left py-2 px-3 font-medium text-(--color-on-surface-muted)">User</th>
                        <th className="text-left py-2 px-3 font-medium text-(--color-on-surface-muted)">Target</th>
                        <th className="text-left py-2 px-3 font-medium text-(--color-on-surface-muted)">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { action: 'Created', user: 'Tanaka', target: 'Project Alpha', time: '2 min ago' },
                        { action: 'Updated', user: 'Suzuki', target: 'Invoice #1234', time: '15 min ago' },
                        { action: 'Exported', user: 'Yamada', target: 'Q4 Data', time: '2 hours ago' },
                        { action: 'Submitted', user: 'Takahashi', target: 'Review Request', time: '3 hours ago' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-(--color-border) last:border-0">
                          <td className="py-2 px-3">{row.action}</td>
                          <td className="py-2 px-3">{row.user}</td>
                          <td className="py-2 px-3">{row.target}</td>
                          <td className="py-2 px-3 text-(--color-on-surface-muted)">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </DashboardPanel>
        </DashboardSection>
      </DashboardGrid>
    );
  },
};

/* ================================================================
   Analytics Preset
   3 StatCards → 2 charts → 2 charts
   ================================================================ */

export const Analytics: Story = {
  render: () => {
    const colors = getChartColors();
    const theme = getChartTheme();

    return (
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
            <ChartContainer title="Traffic Sources" description="Visits and conversions by source">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trafficData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="source" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={{ stroke: theme.axisColor }} tickLine={false} />
                  <YAxis tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: theme.cursorFill, opacity: 0.5 }} />
                  <RechartsLegend content={<ChartLegend />} />
                  <Bar dataKey="visits" name="Visits" fill={colors[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" name="Conversions" fill={colors[2]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 12, md: 6 }}>
            <ChartContainer title="User Demographics" description="Distribution by segment">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={[{ name: '18-24', value: 22 }, { name: '25-34', value: 35 }, { name: '35-44', value: 24 }, { name: '45+', value: 19 }]} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {[0, 1, 2, 3].map((i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltip />} cursor={false} />
                  <RechartsLegend content={<ChartLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
        </DashboardSection>

        <DashboardSection title="Engagement">
          <DashboardPanel colSpan={{ default: 12, md: 6 }}>
            <ChartContainer title="Bounce Rate" description="Daily bounce rate trend (%)">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={sessionData}>
                  <defs>
                    <linearGradient id="gradBounce" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[3]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[3]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={{ stroke: theme.axisColor }} tickLine={false} />
                  <YAxis tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} unit="%" />
                  <RechartsTooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                  <Area type="monotone" dataKey="bounce" name="Bounce Rate" stroke={colors[3]} strokeWidth={2} fill="url(#gradBounce)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 12, md: 6 }}>
            <ChartContainer title="Session Duration" description="Average time on site (seconds)">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={{ stroke: theme.axisColor }} tickLine={false} />
                  <YAxis tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} unit="s" />
                  <RechartsTooltip content={<ChartTooltip formatter={(v) => `${v}s`} />} />
                  <Line type="monotone" dataKey="duration" name="Duration" stroke={colors[0]} strokeWidth={2} dot={{ r: 4, fill: colors[0] }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
        </DashboardSection>
      </DashboardGrid>
    );
  },
};

/* ================================================================
   Monitoring Preset
   6 StatCards → Full-width large chart → 3 small charts
   ================================================================ */

export const Monitoring: Story = {
  render: () => {
    const colors = getChartColors();
    const theme = getChartTheme();

    return (
      <DashboardGrid>
        <DashboardSection title="System Status">
          <DashboardPanel colSpan={{ default: 6, md: 4, lg: 2 }} minColSpan={2}>
            <StatCard label="CPU Usage" value="42%" trend="-3%" icon={<Cpu className="h-4 w-4" />} />
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 6, md: 4, lg: 2 }} minColSpan={2}>
            <StatCard label="Memory" value="6.2 GB" trend="+0.4 GB" trendDirection="up" icon={<HardDrive className="h-4 w-4" />} />
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 6, md: 4, lg: 2 }} minColSpan={2}>
            <StatCard label="Disk I/O" value="120 MB/s" trend="+15%" icon={<Activity className="h-4 w-4" />} />
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 6, md: 4, lg: 2 }} minColSpan={2}>
            <StatCard label="Network" value="2.4 Gbps" trend="+8%" icon={<Wifi className="h-4 w-4" />} />
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 6, md: 4, lg: 2 }} minColSpan={2}>
            <StatCard label="Error Rate" value="0.03%" trend="-0.01%" icon={<PieChartIcon className="h-4 w-4" />} />
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 6, md: 4, lg: 2 }} minColSpan={2}>
            <StatCard label="Uptime" value="99.97%" trend="+0.02%" icon={<Zap className="h-4 w-4" />} />
          </DashboardPanel>
        </DashboardSection>

        <DashboardSection title="Live Monitoring">
          <DashboardPanel colSpan={12} rowSpan={3}>
            <ChartContainer title="Request Throughput" description="Requests per second across all services (24h)">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={throughputData}>
                  <defs>
                    <linearGradient id="gradReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradErr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[3]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[3]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={{ stroke: theme.axisColor }} tickLine={false} />
                  <YAxis tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<ChartTooltip />} />
                  <RechartsLegend content={<ChartLegend />} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke={colors[0]} strokeWidth={2} fill="url(#gradReq)" />
                  <Area type="monotone" dataKey="errors" name="Errors" stroke={colors[3]} strokeWidth={2} fill="url(#gradErr)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
        </DashboardSection>

        <DashboardSection title="Service Breakdown">
          <DashboardPanel colSpan={{ default: 12, md: 4 }}>
            <ChartContainer title="API Latency" description="P50 / P95 / P99 (ms)">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={{ stroke: theme.axisColor }} tickLine={false} />
                  <YAxis tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} unit="ms" />
                  <RechartsTooltip content={<ChartTooltip formatter={(v) => `${v}ms`} />} />
                  <RechartsLegend content={<ChartLegend />} />
                  <Line type="monotone" dataKey="p50" name="P50" stroke={colors[0]} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="p95" name="P95" stroke={colors[2]} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="p99" name="P99" stroke={colors[3]} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 12, md: 4 }}>
            <ChartContainer title="Error Distribution" description="By service">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={errorDistribution} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="service" tick={{ fill: theme.textColor, fontSize: theme.fontSize }} axisLine={false} tickLine={false} width={80} />
                  <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: theme.cursorFill, opacity: 0.5 }} />
                  <Bar dataKey="count" name="Errors" fill={colors[3]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
          <DashboardPanel colSpan={{ default: 12, md: 4 }}>
            <ChartContainer title="Active Connections" description="Database pool utilization">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[{ name: 'Active', value: 67 }, { name: 'Idle', value: 23 }, { name: 'Available', value: 10 }]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    <Cell fill={colors[0]} />
                    <Cell fill={colors[2]} />
                    <Cell fill={colors[4]} />
                  </Pie>
                  <RechartsTooltip content={<ChartTooltip />} cursor={false} />
                  <RechartsLegend content={<ChartLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DashboardPanel>
        </DashboardSection>
      </DashboardGrid>
    );
  },
};
