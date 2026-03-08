import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

describe('Select', () => {
  const renderSelect = (props = {}) =>
    render(
      <Select {...props}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    );

  it('renders the trigger', () => {
    renderSelect();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder', () => {
    renderSelect();
    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });

  it('shows selected value', () => {
    renderSelect({ value: 'apple' });
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('forwards ref on SelectTrigger', () => {
    let ref: HTMLButtonElement | null = null;
    render(
      <Select>
        <SelectTrigger ref={(el) => { ref = el; }} aria-label="Test">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className on trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom" aria-label="Test">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderSelect();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
