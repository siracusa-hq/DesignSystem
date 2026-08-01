import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../components/primitives/text';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const SizesAndTones: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    const bodyText = isJa
      ? 'AIエージェントにAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる。'
      : 'Build enterprise-grade business applications rapidly with an 8-module integrated Enterprise Agent Stack.';

    return (
      <div className="space-y-6 p-8">
        <div className="space-y-2">
          <Text size="overline" tone="brand">OVERLINE</Text>
          <Text size="body-lg">{bodyText}</Text>
          <Text size="body-md" tone="secondary">{bodyText}</Text>
          <Text size="body-sm" tone="muted">{bodyText}</Text>
          <Text size="caption" tone="muted">Caption text / キャプションテキスト</Text>
        </div>
      </div>
    );
  },
};
