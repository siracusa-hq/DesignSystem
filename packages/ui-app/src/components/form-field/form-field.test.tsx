import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form-field';
import { Input } from '@/components/input/input';

describe('FormField', () => {
  const renderFormField = (props = {}) =>
    render(
      <FormField {...props}>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="Enter email" />
        </FormControl>
        <FormDescription>We will never share your email.</FormDescription>
        <FormMessage />
      </FormField>,
    );

  it('renders all sub-components', () => {
    renderFormField();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
  });

  it('connects label to input via htmlFor/id', () => {
    renderFormField();
    const label = screen.getByText('Email');
    const input = screen.getByPlaceholderText('Enter email');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('shows required indicator', () => {
    renderFormField({ required: true });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message', () => {
    renderFormField({ error: 'Email is required' });
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('sets aria-invalid on input when error exists', () => {
    renderFormField({ error: 'Invalid email' });
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    renderFormField();
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('sets aria-describedby to description when no error', () => {
    renderFormField();
    const input = screen.getByPlaceholderText('Enter email');
    const description = screen.getByText('We will never share your email.');
    expect(input.getAttribute('aria-describedby')).toBe(description.id);
  });

  it('sets aria-describedby to error message when error exists', () => {
    renderFormField({ error: 'Required' });
    const input = screen.getByPlaceholderText('Enter email');
    const errorMsg = screen.getByRole('alert');
    expect(input.getAttribute('aria-describedby')).toBe(errorMsg.id);
  });

  it('does not render FormMessage when no error', () => {
    renderFormField();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies disabled to input via context', () => {
    renderFormField({ disabled: true });
    expect(screen.getByPlaceholderText('Enter email')).toBeDisabled();
  });

  it('forwards ref on FormField', () => {
    let ref: HTMLDivElement | null = null;
    render(
      <FormField ref={(el) => { ref = el; }}>
        <FormLabel>Test</FormLabel>
        <FormControl>
          <Input />
        </FormControl>
      </FormField>,
    );
    expect(ref).toBeInstanceOf(HTMLDivElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderFormField();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with error', async () => {
    const { container } = renderFormField({ error: 'Email is required' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
