import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

function renderGroup(props?: {
  type?: 'single' | 'multiple';
  variant?: 'default' | 'outline';
  disabled?: boolean;
  defaultValue?: string | string[];
}) {
  const type = props?.type ?? 'single';
  return render(
    <ToggleGroup
      type={type}
      variant={props?.variant}
      disabled={props?.disabled}
      defaultValue={type === 'multiple' ? (props?.defaultValue as string[]) : (props?.defaultValue as string)}
    >
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>,
  );
}

describe('ToggleGroup', () => {
  it('renders items', () => {
    renderGroup();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Italic')).toBeInTheDocument();
    expect(screen.getByText('Underline')).toBeInTheDocument();
  });

  it('selects item on click (single mode)', async () => {
    const user = userEvent.setup();
    renderGroup({ type: 'single' });

    await user.click(screen.getByText('Bold'));
    expect(screen.getByText('Bold').closest('button')).toHaveAttribute('data-state', 'on');

    await user.click(screen.getByText('Italic'));
    expect(screen.getByText('Italic').closest('button')).toHaveAttribute('data-state', 'on');
    expect(screen.getByText('Bold').closest('button')).toHaveAttribute('data-state', 'off');
  });

  it('supports multiple mode', async () => {
    const user = userEvent.setup();
    renderGroup({ type: 'multiple' });

    await user.click(screen.getByText('Bold'));
    await user.click(screen.getByText('Italic'));
    expect(screen.getByText('Bold').closest('button')).toHaveAttribute('data-state', 'on');
    expect(screen.getByText('Italic').closest('button')).toHaveAttribute('data-state', 'on');
  });

  it('applies outline variant classes', () => {
    renderGroup({ variant: 'outline' });
    const button = screen.getByText('Bold').closest('button');
    expect(button?.className).toContain('border');
  });

  it('disables all items when disabled', () => {
    renderGroup({ disabled: true });
    const buttons = screen.getAllByRole('radio');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderGroup({ type: 'single' });

    const boldButton = screen.getByText('Bold').closest('button')!;
    boldButton.focus();
    await user.keyboard('{Enter}');
    expect(boldButton).toHaveAttribute('data-state', 'on');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderGroup();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
