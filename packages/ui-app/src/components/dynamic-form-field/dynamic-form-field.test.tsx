import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DynamicFormField, getFieldComponent } from './dynamic-form-field';

describe('DynamicFormField', () => {
  it('renders text input', () => {
    render(<DynamicFormField type="text" name="name" label="Name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<DynamicFormField type="email" name="email" label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders password input', () => {
    render(<DynamicFormField type="password" name="pass" label="Password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('renders textarea', () => {
    render(<DynamicFormField type="textarea" name="desc" label="Description" />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('renders checkbox inline', () => {
    render(<DynamicFormField type="checkbox" name="agree" label="Agree" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Agree')).toBeInTheDocument();
  });

  it('renders switch inline', () => {
    render(<DynamicFormField type="switch" name="notify" label="Notifications" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders select with options', () => {
    render(
      <DynamicFormField
        type="select"
        name="fruit"
        label="Fruit"
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ]}
      />,
    );
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders radio group with options', () => {
    render(
      <DynamicFormField
        type="radio"
        name="size"
        label="Size"
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'lg', label: 'Large' },
        ]}
      />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('renders date picker', () => {
    render(<DynamicFormField type="date" name="dob" label="Date of Birth" />);
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    const hidden = document.querySelector('input[type="hidden"][name="dob"]');
    expect(hidden).toBeInTheDocument();
  });

  it('renders number input', () => {
    render(<DynamicFormField type="number" name="qty" label="Quantity" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Increment')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <DynamicFormField type="text" name="name" label="Name" error="Required" />,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows description', () => {
    render(
      <DynamicFormField
        type="text"
        name="name"
        label="Name"
        description="Enter your full name"
      />,
    );
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });
});

describe('getFieldComponent', () => {
  it('returns correct component names', () => {
    expect(getFieldComponent('text')).toBe('Input');
    expect(getFieldComponent('number')).toBe('NumberInput');
    expect(getFieldComponent('textarea')).toBe('Textarea');
    expect(getFieldComponent('select')).toBe('Select');
    expect(getFieldComponent('combobox')).toBe('Combobox');
    expect(getFieldComponent('checkbox')).toBe('Checkbox');
    expect(getFieldComponent('radio')).toBe('RadioGroup');
    expect(getFieldComponent('switch')).toBe('Switch');
    expect(getFieldComponent('date')).toBe('DatePicker');
    expect(getFieldComponent('datetime')).toBe('Input');
    expect(getFieldComponent('time')).toBe('Input');
    expect(getFieldComponent('file')).toBe('Input');
  });
});
