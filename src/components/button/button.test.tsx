import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-primary-500');
  });

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-error-500');
  });

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('hover:bg-[--color-surface-muted]');
  });

  it('applies link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('underline-offset-4');
  });

  it('applies size variants', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toContain('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button').className).toContain('h-10');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button').className).toContain('w-9');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLButtonElement | null) => void>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('calls onClick handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
