import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '../components/chart-container';
import { getChartColors, getChartTheme, ChartTooltip, ChartLegend } from '../components/chart';

const meta: Meta = {
  title: 'Data Display/Chart',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '## Chart Components',
          '',
          'Recharts をラップしたチャートユーティリティ。',
          '`getChartColors()` と `getChartTheme()` でデザイントークンに準拠したスタイルを適用します。',
          '',
          '- `ChartTooltip` — ツールチップのスタイリング',
          '- `ChartLegend` — 凡例のスタイリング',
          '- `ChartContainer` — ヘッダー付きカードラッパー（既存）',
        ].join('\n'),
      },
    },
  },
};
export default meta;

/* ----------------------------------------------------------------
   Sample Data
   ---------------------------------------------------------------- */

const monthlyData = [
  { month: 'Jan', revenue: 4200, cost: 2400, profit: 1800 },
  { month: 'Feb', revenue: 3800, cost: 2200, profit: 1600 },
  { month: 'Mar', revenue: 5100, cost: 2800, profit: 2300 },
  { month: 'Apr', revenue: 4600, cost: 2600, profit: 2000 },
  { month: 'May', revenue: 5400, cost: 3000, profit: 2400 },
  { month: 'Jun', revenue: 6200, cost: 3200, profit: 3000 },
];

const pieData = [
  { name: 'Engineering', value: 42 },
  { name: 'Design', value: 18 },
  { name: 'Marketing', value: 24 },
  { name: 'Sales', value: 16 },
];

const formatCurrency = (v: number) => `¥${(v / 1000).toFixed(0)}K`;

/* ----------------------------------------------------------------
   Stories
   ---------------------------------------------------------------- */

export const BarChartExample: StoryObj = {
  name: 'Bar Chart',
  render: () => {
    const colors = getChartColors();
    const theme = getChartTheme();

    return (
      <ChartContainer title="月次売上" description="Revenue vs Cost (¥K)" className="w-[600px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: theme.textColor, fontSize: theme.fontSize }}
              axisLine={{ stroke: theme.axisColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.textColor, fontSize: theme.fontSize }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <RechartsTooltip
              content={<ChartTooltip formatter={(v) => `¥${v.toLocaleString()}`} />}
              cursor={{ fill: theme.cursorFill, opacity: 0.5 }}
            />
            <RechartsLegend content={<ChartLegend />} />
            <Bar dataKey="revenue" name="Revenue" fill={colors[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" name="Cost" fill={colors[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  },
};

export const LineChartExample: StoryObj = {
  name: 'Line Chart',
  render: () => {
    const colors = getChartColors();
    const theme = getChartTheme();

    return (
      <ChartContainer title="利益推移" description="Monthly profit trend" className="w-[600px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: theme.textColor, fontSize: theme.fontSize }}
              axisLine={{ stroke: theme.axisColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.textColor, fontSize: theme.fontSize }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <RechartsTooltip
              content={<ChartTooltip formatter={(v) => `¥${v.toLocaleString()}`} />}
              cursor={{ stroke: theme.cursorFill, strokeWidth: 1 }}
            />
            <RechartsLegend content={<ChartLegend />} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ r: 4, fill: colors[0] }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke={colors[4]}
              strokeWidth={2}
              dot={{ r: 4, fill: colors[4] }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  },
};

export const AreaChartExample: StoryObj = {
  name: 'Area Chart',
  render: () => {
    const colors = getChartColors();
    const theme = getChartTheme();

    return (
      <ChartContainer title="売上エリア" description="Stacked area view" className="w-[600px]">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[1]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[1]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: theme.textColor, fontSize: theme.fontSize }}
              axisLine={{ stroke: theme.axisColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.textColor, fontSize: theme.fontSize }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <RechartsTooltip
              content={<ChartTooltip formatter={(v) => `¥${v.toLocaleString()}`} />}
              cursor={{ stroke: theme.cursorFill, strokeWidth: 1 }}
            />
            <RechartsLegend content={<ChartLegend />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={colors[0]}
              strokeWidth={2}
              fill="url(#gradRevenue)"
            />
            <Area
              type="monotone"
              dataKey="cost"
              name="Cost"
              stroke={colors[1]}
              strokeWidth={2}
              fill="url(#gradCost)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  },
};

export const PieChartExample: StoryObj = {
  name: 'Pie Chart',
  render: () => {
    const colors = getChartColors();

    return (
      <ChartContainer title="部門構成比" description="Department distribution" className="w-[400px]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<ChartTooltip />} cursor={false} />
            <RechartsLegend content={<ChartLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  },
};
