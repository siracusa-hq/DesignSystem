import type { Meta, StoryObj } from '@storybook/react';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDetails,
} from '../components/description-list';
import { Badge } from '../components/badge';

const meta: Meta<typeof DescriptionList> = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Default: Story = {
  render: () => (
    <DescriptionList className="max-w-md">
      <DescriptionTerm>Name</DescriptionTerm>
      <DescriptionDetails>Haruka Tanaka</DescriptionDetails>

      <DescriptionTerm>Email</DescriptionTerm>
      <DescriptionDetails>haruka.tanaka@example.com</DescriptionDetails>

      <DescriptionTerm>Role</DescriptionTerm>
      <DescriptionDetails>Product Manager</DescriptionDetails>

      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>Active</DescriptionDetails>
    </DescriptionList>
  ),
};

export const Vertical: Story = {
  render: () => (
    <DescriptionList direction="vertical" className="max-w-md">
      <DescriptionTerm>Name</DescriptionTerm>
      <DescriptionDetails>Haruka Tanaka</DescriptionDetails>

      <DescriptionTerm>Email</DescriptionTerm>
      <DescriptionDetails>haruka.tanaka@example.com</DescriptionDetails>

      <DescriptionTerm>Role</DescriptionTerm>
      <DescriptionDetails>Product Manager</DescriptionDetails>

      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>Active</DescriptionDetails>
    </DescriptionList>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <DescriptionList className="max-w-md">
      <DescriptionTerm>Name</DescriptionTerm>
      <DescriptionDetails>Haruka Tanaka</DescriptionDetails>

      <DescriptionTerm>Email</DescriptionTerm>
      <DescriptionDetails>haruka.tanaka@example.com</DescriptionDetails>

      <DescriptionTerm>Role</DescriptionTerm>
      <DescriptionDetails>
        <Badge variant="info">Product Manager</Badge>
      </DescriptionDetails>

      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>
        <Badge variant="success">Active</Badge>
      </DescriptionDetails>
    </DescriptionList>
  ),
};
