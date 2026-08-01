import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/progress';
import { Card, CardHeader, CardTitle, CardContent } from '../components/card';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    showLabel: {
      control: 'boolean',
    },
    labelPosition: {
      control: 'select',
      options: ['right', 'top', 'floating'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 60,
    'aria-label': 'Progress',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      {(['default', 'success', 'warning', 'error', 'info'] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-on-surface-secondary)] capitalize">
              {variant}
            </span>
            <Progress value={65} variant={variant} aria-label={variant} />
          </div>
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[var(--color-on-surface-secondary)]">
            {size}
          </span>
          <Progress value={50} size={size} aria-label={`Size ${size}`} />
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 73,
    showLabel: true,
    'aria-label': 'Upload progress',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithLabelTop: Story = {
  args: {
    value: 45,
    showLabel: true,
    labelPosition: 'top',
    'aria-label': 'Task completion',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const CustomLabel: Story = {
  render: () => (
    <div className="w-80">
      <Progress
        value={60}
        showLabel={(v) => `${v} / 100 items`}
        aria-label="Items processed"
      />
    </div>
  ),
};

export const FloatingLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-10 w-80 pt-10">
      <Progress
        value={35}
        showLabel
        labelPosition="floating"
        aria-label="Upload progress"
      />
      <Progress
        value={72}
        showLabel
        labelPosition="floating"
        variant="success"
        aria-label="Completion"
      />
      <Progress
        value={50}
        showLabel={(v) => `${v} / 100`}
        labelPosition="floating"
        variant="info"
        aria-label="Items"
      />
    </div>
  ),
};

export const WithMarker: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      {(['default', 'success', 'warning', 'error', 'info'] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-on-surface-secondary)] capitalize">
              {variant}
            </span>
            <Progress
              value={55}
              variant={variant}
              showMarker
              aria-label={variant}
            />
          </div>
        ),
      )}
    </div>
  ),
};

export const FloatingLabelWithMarker: Story = {
  render: () => {
    const [value, setValue] = useState(40);

    useEffect(() => {
      const timer = setInterval(() => {
        setValue((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 600);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-80 pt-10">
        <Progress
          value={value}
          showLabel
          labelPosition="floating"
          showMarker
          aria-label="Auto progress"
        />
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-80">
      <Progress value={null} aria-label="Loading" />
    </div>
  ),
};

export const ValueTransition: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setValue((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 800);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-80">
        <Progress value={value} showLabel aria-label="Auto progress" />
      </div>
    );
  },
};

export const ZeroAndComplete: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[var(--color-on-surface-secondary)]">
          0%
        </span>
        <Progress value={0} aria-label="Empty" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[var(--color-on-surface-secondary)]">
          100%
        </span>
        <Progress value={100} variant="success" aria-label="Complete" />
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>report.pdf</span>
            <span className="text-[var(--color-on-surface-secondary)]">
              2.4 MB / 5.0 MB
            </span>
          </div>
          <Progress value={48} aria-label="Uploading report.pdf" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>data.csv</span>
            <span className="text-[var(--color-on-surface-secondary)]">
              Complete
            </span>
          </div>
          <Progress value={100} variant="success" aria-label="data.csv uploaded" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>image.png</span>
            <span className="text-error-500">Failed</span>
          </div>
          <Progress value={30} variant="error" aria-label="image.png upload failed" />
        </div>
      </CardContent>
    </Card>
  ),
};
