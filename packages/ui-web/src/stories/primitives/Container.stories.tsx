import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../../components/primitives/container';

const meta: Meta<typeof Container> = {
  title: 'Primitives/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: () => (
    <div className="bg-[var(--color-surface-sunken)] py-8">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Container key={size} size={size} className="mb-4">
          <div className="rounded-lg bg-primary-100 p-4 text-center text-body-sm dark:bg-primary-950">
            Container size=&quot;{size}&quot;
          </div>
        </Container>
      ))}
    </div>
  ),
};
