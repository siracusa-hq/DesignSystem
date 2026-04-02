import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { User, Settings, CreditCard, CheckCircle, Mail } from 'lucide-react';
import { Stepper, type StepItem } from '../components/stepper';
import { Button } from '../components/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/card';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    activeStep: {
      control: { type: 'number', min: 0, max: 4 },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    connector: {
      control: 'select',
      options: ['line', 'arrow', 'chevron'],
    },
    clickable: {
      control: 'boolean',
    },
  },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

const basicSteps: StepItem[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Review' },
  { label: 'Complete' },
];

export const Default: Story = {
  args: {
    steps: basicSteps,
    activeStep: 1,
  },
};

export const AllStates: Story = {
  render: () => (
    <Stepper
      steps={[
        { label: 'Completed', status: 'completed' },
        { label: 'Active', status: 'active' },
        { label: 'Loading', status: 'loading' },
        { label: 'Error', status: 'error' },
        { label: 'Pending', status: 'pending' },
      ]}
      activeStep={1}
    />
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stepper
      steps={[
        { label: 'Order Placed', description: 'Your order has been confirmed' },
        { label: 'Processing', description: 'We are preparing your items' },
        { label: 'Shipped', description: 'Your package is on the way' },
        { label: 'Delivered', description: 'Package delivered to your address' },
      ]}
      activeStep={2}
      orientation="vertical"
    />
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Stepper
      steps={[
        { label: 'Basic Info', description: 'Name and email' },
        { label: 'Verification', description: 'Identity check' },
        { label: 'Payment', description: 'Billing details' },
        { label: 'Confirmation', description: 'Review and submit' },
      ]}
      activeStep={1}
    />
  ),
};

export const WithCustomIcons: Story = {
  render: () => (
    <Stepper
      steps={[
        { label: 'Account', icon: <User size={16} /> },
        { label: 'Settings', icon: <Settings size={16} /> },
        { label: 'Payment', icon: <CreditCard size={16} /> },
        { label: 'Done', icon: <CheckCircle size={16} /> },
      ]}
      activeStep={1}
    />
  ),
};

export const Clickable: Story = {
  render: () => {
    const [active, setActive] = useState(2);
    return (
      <div className="flex flex-col gap-4 items-center">
        <Stepper
          steps={basicSteps}
          activeStep={active}
          clickable
          onStepClick={setActive}
        />
        <p className="text-sm text-[var(--color-on-surface-secondary)]">
          Click a completed or active step to navigate
        </p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-on-surface-secondary)]">
            {size}
          </span>
          <Stepper steps={basicSteps} activeStep={1} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const ConnectorArrow: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Stepper steps={basicSteps} activeStep={2} connector="arrow" />
      <Stepper
        steps={[
          { label: 'Order Placed', description: 'Confirmed' },
          { label: 'Processing', description: 'Preparing items' },
          { label: 'Shipped', description: 'On the way' },
          { label: 'Delivered', description: 'At your address' },
        ]}
        activeStep={2}
        orientation="vertical"
        connector="arrow"
      />
    </div>
  ),
};

export const ConnectorChevron: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Stepper steps={basicSteps} activeStep={2} connector="chevron" />
      <Stepper
        steps={[
          { label: 'Order Placed', description: 'Confirmed' },
          { label: 'Processing', description: 'Preparing items' },
          { label: 'Shipped', description: 'On the way' },
          { label: 'Delivered', description: 'At your address' },
        ]}
        activeStep={2}
        orientation="vertical"
        connector="chevron"
      />
    </div>
  ),
};

export const ConnectorComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['line', 'arrow', 'chevron'] as const).map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-on-surface-secondary)]">
            connector=&quot;{type}&quot;
          </span>
          <Stepper steps={basicSteps} activeStep={2} connector={type} />
        </div>
      ))}
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Stepper
      steps={[
        { label: 'Account' },
        { label: 'Payment', status: 'error' },
        { label: 'Review' },
      ]}
      activeStep={1}
    />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <Stepper
      steps={[
        { label: 'Submit' },
        { label: 'Processing', status: 'loading' },
        { label: 'Complete' },
      ]}
      activeStep={1}
    />
  ),
};

export const InteractiveWizard: Story = {
  render: () => {
    const [active, setActive] = useState(0);
    const steps: StepItem[] = [
      { label: 'Contact Info' },
      { label: 'Address' },
      { label: 'Confirmation' },
    ];

    const content = [
      'Enter your name, email, and phone number.',
      'Provide your shipping address.',
      'Review your information and confirm.',
    ];

    return (
      <Card className="w-[480px]">
        <CardHeader>
          <CardTitle>Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper steps={steps} activeStep={active} size="sm" />
          <div className="rounded-lg border border-[var(--color-border)] p-4 min-h-[80px]">
            <p className="text-sm text-[var(--color-on-surface-secondary)]">
              {content[active]}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={active === 0}
            onClick={() => setActive((p) => p - 1)}
          >
            Back
          </Button>
          <Button
            size="sm"
            onClick={() =>
              setActive((p) => Math.min(p + 1, steps.length - 1))
            }
          >
            {active === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    );
  },
};
