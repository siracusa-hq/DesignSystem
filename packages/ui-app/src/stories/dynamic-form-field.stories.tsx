import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DynamicFormField } from '../components/dynamic-form-field';
import { FormLayout, FormSection, FormActions } from '../components/form-layout';
import { Button } from '../components/button';

const meta: Meta<typeof DynamicFormField> = {
  title: 'Form/DynamicFormField',
  component: DynamicFormField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DynamicFormField>;

export const TextInput: Story = {
  args: { type: 'text', name: 'name', label: 'Full Name', placeholder: 'John Doe' },
};

export const AllFieldTypes: Story = {
  render: () => (
    <FormLayout className="w-96">
      <DynamicFormField type="text" name="name" label="Name" placeholder="John Doe" />
      <DynamicFormField type="email" name="email" label="Email" placeholder="john@example.com" />
      <DynamicFormField type="password" name="password" label="Password" />
      <DynamicFormField type="number" name="age" label="Age" min={0} max={120} />
      <DynamicFormField type="textarea" name="bio" label="Bio" placeholder="Tell us about yourself" />
      <DynamicFormField
        type="select"
        name="country"
        label="Country"
        options={[
          { value: 'jp', label: 'Japan' },
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
      />
      <DynamicFormField
        type="radio"
        name="plan"
        label="Plan"
        options={[
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' },
        ]}
      />
      <DynamicFormField type="date" name="birthday" label="Birthday" />
      <DynamicFormField type="checkbox" name="agree" label="I agree to the terms" />
      <DynamicFormField type="switch" name="notifications" label="Enable notifications" />
    </FormLayout>
  ),
};

export const WithValidationErrors: Story = {
  render: () => (
    <FormLayout className="w-96">
      <DynamicFormField
        type="text"
        name="name"
        label="Name"
        error="Name is required"
        required
      />
      <DynamicFormField
        type="email"
        name="email"
        label="Email"
        error="Please enter a valid email"
        required
        value="invalid-email"
      />
      <DynamicFormField
        type="select"
        name="role"
        label="Role"
        error="Please select a role"
        required
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ]}
      />
    </FormLayout>
  ),
};

export const DynamicForm: Story = {
  name: 'Dynamic Form (Interactive)',
  render: () => {
    const [values, setValues] = useState<Record<string, unknown>>({});
    const fields = [
      { type: 'text' as const, name: 'name', label: 'Name', required: true },
      { type: 'email' as const, name: 'email', label: 'Email', required: true },
      { type: 'number' as const, name: 'age', label: 'Age', min: 0, max: 120 },
      {
        type: 'select' as const,
        name: 'department',
        label: 'Department',
        options: [
          { value: 'eng', label: 'Engineering' },
          { value: 'sales', label: 'Sales' },
          { value: 'hr', label: 'HR' },
        ],
      },
      { type: 'checkbox' as const, name: 'active', label: 'Active member' },
    ];

    return (
      <FormLayout className="w-96">
        <FormSection title="User Registration" description="Fill in the details below">
          {fields.map((field) => (
            <DynamicFormField
              key={field.name}
              {...field}
              value={values[field.name]}
              onChange={(v) =>
                setValues((prev) => ({ ...prev, [field.name]: v }))
              }
            />
          ))}
        </FormSection>
        <FormActions>
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </FormActions>
      </FormLayout>
    );
  },
};
