import type { Meta, StoryObj } from '@storybook/react';
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../components/form-field';
import { Input } from '../components/input';
import { Textarea } from '../components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/select';

const meta: Meta = {
  title: 'Form/FormField',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <FormField className="w-80">
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="you@example.com" />
      </FormControl>
      <FormDescription>We will never share your email.</FormDescription>
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField required className="w-80">
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter your name" />
      </FormControl>
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField error="This field is required" required className="w-80">
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="you@example.com" />
      </FormControl>
      <FormMessage />
    </FormField>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <FormField className="w-80">
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea placeholder="Enter description..." />
      </FormControl>
      <FormDescription>Maximum 500 characters.</FormDescription>
    </FormField>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <FormField required className="w-80">
      <FormLabel>Country</FormLabel>
      <FormControl>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jp">Japan</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
    </FormField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormField disabled className="w-80">
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="Disabled" />
      </FormControl>
    </FormField>
  ),
};
