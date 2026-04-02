import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Stepper, type StepItem } from './stepper';

const defaultSteps: StepItem[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Confirm' },
];

describe('Stepper', () => {
  it('renders all steps', () => {
    render(<Stepper steps={defaultSteps} activeStep={0} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('sets aria-current="step" on active step', () => {
    render(<Stepper steps={defaultSteps} activeStep={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('derives completed status for steps before activeStep', () => {
    render(<Stepper steps={defaultSteps} activeStep={2} />);
    // Steps 0 and 1 should be completed (have check icons via aria-label)
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute(
      'aria-label',
      'Step 1: Account (completed)',
    );
    expect(buttons[1]).toHaveAttribute(
      'aria-label',
      'Step 2: Profile (completed)',
    );
  });

  it('derives pending status for steps after activeStep', () => {
    render(<Stepper steps={defaultSteps} activeStep={0} />);
    const buttons = screen.getAllByRole('button');
    // Step 2 and 3 should show their number
    expect(buttons[1]).toHaveAccessibleName('Step 2: Profile');
    expect(buttons[2]).toHaveAccessibleName('Step 3: Confirm');
  });

  it('respects explicit status override', () => {
    const steps: StepItem[] = [
      { label: 'Step 1' },
      { label: 'Step 2', status: 'error' },
      { label: 'Step 3' },
    ];
    render(<Stepper steps={steps} activeStep={0} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute(
      'aria-label',
      'Step 2: Step 2 (error)',
    );
  });

  it('shows loading state with spinner', () => {
    const steps: StepItem[] = [
      { label: 'Step 1', status: 'loading' },
      { label: 'Step 2' },
    ];
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner has role="status"
  });

  it('renders custom icons', () => {
    const steps: StepItem[] = [
      { label: 'Step 1', icon: <span data-testid="custom-icon">★</span> },
      { label: 'Step 2' },
    ];
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders horizontal orientation by default', () => {
    render(<Stepper steps={defaultSteps} activeStep={0} />);
    const list = screen.getByRole('list');
    expect(list.className).toContain('flex');
    expect(list.className).toContain('items-start');
  });

  it('renders vertical orientation', () => {
    render(
      <Stepper steps={defaultSteps} activeStep={0} orientation="vertical" />,
    );
    const list = screen.getByRole('list');
    expect(list.className).toContain('flex-col');
  });

  it('fires onStepClick for clickable completed steps', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={2}
        clickable
        onStepClick={onStepClick}
      />,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); // completed step
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('does not fire onStepClick for pending steps', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={0}
        clickable
        onStepClick={onStepClick}
      />,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[2]); // pending step, disabled
    expect(onStepClick).not.toHaveBeenCalled();
  });

  it('supports keyboard activation on clickable steps', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={2}
        clickable
        onStepClick={onStepClick}
      />,
    );
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    await user.keyboard('{Enter}');
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('renders descriptions', () => {
    const steps: StepItem[] = [
      { label: 'Step 1', description: 'First step description' },
      { label: 'Step 2' },
    ];
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByText('First step description')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    let ref: HTMLOListElement | null = null;
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={0}
        ref={(el) => {
          ref = el;
        }}
      />,
    );
    expect(ref).toBeInstanceOf(HTMLOListElement);
  });

  it('merges custom className', () => {
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={0}
        className="custom-stepper"
      />,
    );
    expect(screen.getByRole('list').className).toContain('custom-stepper');
  });

  it('renders arrow connector', () => {
    const { container } = render(
      <Stepper steps={defaultSteps} activeStep={1} connector="arrow" />,
    );
    // Arrow uses CSS border triangles (border-l-* classes)
    const triangles = container.querySelectorAll('.border-l-primary-500, .border-l-\\[var\\(--color-border\\)\\]');
    expect(triangles.length).toBeGreaterThanOrEqual(2);
  });

  it('renders chevron connector', () => {
    render(
      <Stepper steps={defaultSteps} activeStep={1} connector="chevron" />,
    );
    // Chevron connector renders — component should not throw
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders arrow connector in vertical orientation', () => {
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={1}
        orientation="vertical"
        connector="arrow"
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders chevron connector in vertical orientation', () => {
    render(
      <Stepper
        steps={defaultSteps}
        activeStep={1}
        orientation="vertical"
        connector="chevron"
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('has no accessibility violations (horizontal)', async () => {
    const { container } = render(
      <Stepper steps={defaultSteps} activeStep={1} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (vertical)', async () => {
    const { container } = render(
      <Stepper
        steps={defaultSteps}
        activeStep={1}
        orientation="vertical"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (arrow connector)', async () => {
    const { container } = render(
      <Stepper steps={defaultSteps} activeStep={1} connector="arrow" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (chevron connector)', async () => {
    const { container } = render(
      <Stepper steps={defaultSteps} activeStep={1} connector="chevron" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
