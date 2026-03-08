import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Label } from './label';

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders as label element', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name').tagName).toBe('LABEL');
  });

  it('sets htmlFor attribute', () => {
    render(<Label htmlFor="email-input">Email</Label>);
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input');
  });

  it('shows required indicator', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('hides required indicator from screen readers', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not show required indicator when not required', () => {
    render(<Label>Email</Label>);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    let ref: HTMLLabelElement | null = null;
    render(<Label ref={(el) => { ref = el; }}>Test</Label>);
    expect(ref).toBeInstanceOf(HTMLLabelElement);
  });

  it('merges className', () => {
    render(<Label className="custom-class">Test</Label>);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="test">Test Label</Label>
        <input id="test" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
