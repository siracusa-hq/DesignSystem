import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../components/primitives/badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="new">New</Badge>
      <Badge variant="beta">Beta</Badge>
      <Badge variant="comingSoon">Coming Soon</Badge>
    </div>
  ),
};
