import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

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
});
