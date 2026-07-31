import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DashboardGrid,
  DashboardSection,
  DashboardPanel,
} from '../components/dashboard-grid';

const meta: Meta<typeof DashboardGrid> = {
  title: 'Components/DashboardGrid',
  component: DashboardGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof DashboardGrid>;

/* Placeholder block for visual demonstration */
function Placeholder({ children, h }: { children: React.ReactNode; h?: string }) {
  return (
    <div
      className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] flex items-center justify-center p-4 text-sm text-[var(--color-on-surface-muted)]"
      style={{ minHeight: h ?? '80px' }}
    >
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <DashboardGrid>
      <DashboardPanel colSpan={3}><Placeholder>colSpan=3</Placeholder></DashboardPanel>
      <DashboardPanel colSpan={3}><Placeholder>colSpan=3</Placeholder></DashboardPanel>
      <DashboardPanel colSpan={3}><Placeholder>colSpan=3</Placeholder></DashboardPanel>
      <DashboardPanel colSpan={3}><Placeholder>colSpan=3</Placeholder></DashboardPanel>
      <DashboardPanel colSpan={8}><Placeholder h="200px">colSpan=8</Placeholder></DashboardPanel>
      <DashboardPanel colSpan={4}><Placeholder h="200px">colSpan=4</Placeholder></DashboardPanel>
      <DashboardPanel colSpan={12}><Placeholder>colSpan=12 (full width)</Placeholder></DashboardPanel>
    </DashboardGrid>
  ),
};

export const WithSections: Story = {
  render: () => (
    <DashboardGrid>
      <DashboardSection title="KPI" description="Key performance indicators">
        <DashboardPanel colSpan={3}><Placeholder>Metric 1</Placeholder></DashboardPanel>
        <DashboardPanel colSpan={3}><Placeholder>Metric 2</Placeholder></DashboardPanel>
        <DashboardPanel colSpan={3}><Placeholder>Metric 3</Placeholder></DashboardPanel>
        <DashboardPanel colSpan={3}><Placeholder>Metric 4</Placeholder></DashboardPanel>
      </DashboardSection>
      <DashboardSection title="Charts">
        <DashboardPanel colSpan={6}><Placeholder h="200px">Chart A</Placeholder></DashboardPanel>
        <DashboardPanel colSpan={6}><Placeholder h="200px">Chart B</Placeholder></DashboardPanel>
      </DashboardSection>
      <DashboardSection title="Details">
        <DashboardPanel colSpan={12}><Placeholder>Data Table</Placeholder></DashboardPanel>
      </DashboardSection>
    </DashboardGrid>
  ),
};

export const GapVariants: Story = {
  name: 'Gap Variants',
  render: () => (
    <div className="flex flex-col gap-8">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm font-medium mb-2">gap=&quot;{gap}&quot;</p>
          <DashboardGrid gap={gap}>
            <DashboardPanel colSpan={4}><Placeholder>{gap}</Placeholder></DashboardPanel>
            <DashboardPanel colSpan={4}><Placeholder>{gap}</Placeholder></DashboardPanel>
            <DashboardPanel colSpan={4}><Placeholder>{gap}</Placeholder></DashboardPanel>
          </DashboardGrid>
        </div>
      ))}
    </div>
  ),
};

export const ResponsiveColSpan: Story = {
  name: 'Responsive ColSpan',
  render: () => (
    <DashboardGrid>
      <DashboardPanel colSpan={{ default: 12, sm: 6, lg: 3 }}>
        <Placeholder>12 → sm:6 → lg:3</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={{ default: 12, sm: 6, lg: 3 }}>
        <Placeholder>12 → sm:6 → lg:3</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={{ default: 12, sm: 6, lg: 3 }}>
        <Placeholder>12 → sm:6 → lg:3</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={{ default: 12, sm: 6, lg: 3 }}>
        <Placeholder>12 → sm:6 → lg:3</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={{ default: 12, md: 8 }}>
        <Placeholder h="200px">12 → md:8</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={{ default: 12, md: 4 }}>
        <Placeholder h="200px">12 → md:4</Placeholder>
      </DashboardPanel>
    </DashboardGrid>
  ),
};

export const RowSpan: Story = {
  name: 'Row Span',
  render: () => (
    <DashboardGrid>
      <DashboardPanel colSpan={4} rowSpan={2}>
        <Placeholder h="100%">colSpan=4, rowSpan=2</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={8}>
        <Placeholder>colSpan=8</Placeholder>
      </DashboardPanel>
      <DashboardPanel colSpan={8}>
        <Placeholder>colSpan=8</Placeholder>
      </DashboardPanel>
    </DashboardGrid>
  ),
};
