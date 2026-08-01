import type { Meta, StoryObj } from '@storybook/react';
import { FormLayout, FormSection, FormActions } from '../components/form-layout';
import {
  FormField,
  FormLabel,
  FormControl,
} from '../components/form-field';
import { Input } from '../components/input';
import { Button } from '../components/button';

const meta: Meta<typeof FormLayout> = {
  title: 'Form/FormLayout',
  component: FormLayout,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof FormLayout>;

export const Vertical: Story = {
  render: () => (
    <FormLayout layout="vertical" className="w-96">
      <FormField>
        <FormLabel>First name</FormLabel>
        <FormControl><Input placeholder="John" /></FormControl>
      </FormField>
      <FormField>
        <FormLabel>Last name</FormLabel>
        <FormControl><Input placeholder="Doe" /></FormControl>
      </FormField>
      <FormField>
        <FormLabel>Email</FormLabel>
        <FormControl><Input type="email" placeholder="john@example.com" /></FormControl>
      </FormField>
      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </FormActions>
    </FormLayout>
  ),
};

export const Grid: Story = {
  render: () => (
    <FormLayout layout="grid" columns={2} className="w-[500px]">
      <FormField>
        <FormLabel>First name</FormLabel>
        <FormControl><Input placeholder="John" /></FormControl>
      </FormField>
      <FormField>
        <FormLabel>Last name</FormLabel>
        <FormControl><Input placeholder="Doe" /></FormControl>
      </FormField>
      <FormField>
        <FormLabel>Email</FormLabel>
        <FormControl><Input type="email" placeholder="john@example.com" /></FormControl>
      </FormField>
      <FormField>
        <FormLabel>Phone</FormLabel>
        <FormControl><Input type="tel" placeholder="+81-xxx" /></FormControl>
      </FormField>
    </FormLayout>
  ),
};

export const WithSections: Story = {
  render: () => (
    <FormLayout className="w-96">
      <FormSection title="Personal Information" description="Basic contact details">
        <FormField>
          <FormLabel>Name</FormLabel>
          <FormControl><Input placeholder="Full name" /></FormControl>
        </FormField>
        <FormField>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" placeholder="Email" /></FormControl>
        </FormField>
      </FormSection>
      <FormSection title="Account Settings">
        <FormField>
          <FormLabel>Username</FormLabel>
          <FormControl><Input placeholder="Username" /></FormControl>
        </FormField>
        <FormField>
          <FormLabel>Password</FormLabel>
          <FormControl><Input type="password" placeholder="Password" /></FormControl>
        </FormField>
      </FormSection>
      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button>Create Account</Button>
      </FormActions>
    </FormLayout>
  ),
};
