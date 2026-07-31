import type { Meta, StoryObj } from '@storybook/react';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionListTerm,
  DescriptionListDetails,
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
      <DescriptionListItem>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetails>Haruka Tanaka</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Email</DescriptionListTerm>
        <DescriptionListDetails>haruka.tanaka@example.com</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Role</DescriptionListTerm>
        <DescriptionListDetails>Product Manager</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Status</DescriptionListTerm>
        <DescriptionListDetails>Active</DescriptionListDetails>
      </DescriptionListItem>
    </DescriptionList>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <DescriptionList className="max-w-md">
      <DescriptionListItem>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetails>Haruka Tanaka</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Email</DescriptionListTerm>
        <DescriptionListDetails>haruka.tanaka@example.com</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Role</DescriptionListTerm>
        <DescriptionListDetails>
          <Badge variant="info">Product Manager</Badge>
        </DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Status</DescriptionListTerm>
        <DescriptionListDetails>
          <Badge variant="success">Active</Badge>
        </DescriptionListDetails>
      </DescriptionListItem>
    </DescriptionList>
  ),
};
