import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '../../components/primitives/section';
import { Container } from '../../components/primitives/container';
import { Heading } from '../../components/primitives/heading';
import { Text } from '../../components/primitives/text';

const meta: Meta<typeof Section> = {
  title: 'Primitives/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Backgrounds: Story = {
  render: () => (
    <>
      {(['default', 'muted', 'dark', 'brand'] as const).map((bg) => (
        <Section key={bg} background={bg} spacing="sm">
          <Container>
            <Heading size="heading-lg" className={bg === 'dark' || bg === 'brand' ? 'text-white' : ''}>
              background=&quot;{bg}&quot;
            </Heading>
            <Text className={bg === 'dark' || bg === 'brand' ? 'text-neutral-300' : ''}>
              セクションの背景バリエーション / Section background variants
            </Text>
          </Container>
        </Section>
      ))}
    </>
  ),
};

export const Spacing: Story = {
  render: () => (
    <>
      {(['sm', 'md', 'lg', 'xl'] as const).map((sp) => (
        <Section key={sp} spacing={sp} background="muted" className="border-b border-primary-200">
          <Container>
            <Text size="body-sm" tone="muted">spacing=&quot;{sp}&quot;</Text>
          </Container>
        </Section>
      ))}
    </>
  ),
};
