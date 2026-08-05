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
            {/* 暗面の文字色は Section 側でセマンティック変数を反転するため上書き不要 */}
            <Heading size="heading-lg">background=&quot;{bg}&quot;</Heading>
            <Text>セクションの背景バリエーション / Section background variants</Text>
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
        <div key={sp} className="border-b border-primary-200">
          <Section spacing={sp} background="muted">
            <Container>
              <Text size="body-sm" tone="muted">
                spacing=&quot;{sp}&quot;
              </Text>
            </Container>
          </Section>
        </div>
      ))}
    </>
  ),
};
