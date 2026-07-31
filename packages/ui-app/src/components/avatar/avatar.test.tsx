import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from './avatar';

describe('Avatar', () => {
  it('renders fallback when no image', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('shows fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="invalid.jpg" alt="User" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );

    const img = screen.getByRole('img');
    fireEvent.error(img);

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('hides fallback when image loads', () => {
    render(
      <Avatar>
        <AvatarImage src="valid.jpg" alt="User" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );

    const img = screen.getByRole('img');
    fireEvent.load(img);

    expect(screen.queryByText('AB')).not.toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain('h-12');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLSpanElement | null) => void>();
    render(
      <Avatar ref={ref}>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="User avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /* ----- Shape variant ----- */

  it('renders circle shape by default', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain('rounded-full');
    expect(avatar.className).not.toContain('rounded-lg');
  });

  it('renders square shape', () => {
    const { container } = render(
      <Avatar shape="square">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain('rounded-lg');
    expect(avatar.className).not.toContain('rounded-full');
  });

  /* ----- Colorful fallback ----- */

  it('uses colorful background even without colorSeed', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const fallback = screen.getByText('AB');
    expect(fallback.className).not.toContain('bg-[var(--color-surface-muted)]');
  });

  it('uses colorful background when colorSeed is provided', () => {
    render(
      <Avatar>
        <AvatarFallback colorSeed="alice@example.com">AL</AvatarFallback>
      </Avatar>,
    );
    const fallback = screen.getByText('AL');
    expect(fallback.className).not.toContain('bg-[var(--color-surface-muted)]');
  });

  it('produces same color for same seed', () => {
    const { container: c1 } = render(
      <Avatar>
        <AvatarFallback colorSeed="test@test.com">A</AvatarFallback>
      </Avatar>,
    );
    const { container: c2 } = render(
      <Avatar>
        <AvatarFallback colorSeed="test@test.com">A</AvatarFallback>
      </Avatar>,
    );
    const f1 = c1.querySelector('[class*="bg-"]')!;
    const f2 = c2.querySelector('[class*="bg-"]')!;
    expect(f1.className).toBe(f2.className);
  });

  /* ----- AvatarStatus ----- */

  it('renders status indicator', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarStatus status="online" />
      </Avatar>,
    );
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-label', 'Online');
    expect(status.className).toContain('bg-success-500');
  });

  it('renders busy status', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarStatus status="busy" />
      </Avatar>,
    );
    const status = screen.getByRole('status');
    expect(status.className).toContain('bg-error-500');
    expect(status).toHaveAttribute('aria-label', 'Busy');
  });

  it('avatar with status has no accessibility violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarStatus status="online" />
      </Avatar>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
