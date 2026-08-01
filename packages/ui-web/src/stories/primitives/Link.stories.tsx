import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '../../components/primitives/link';

const meta: Meta<typeof Link> = {
  title: 'Primitives/Link',
  component: Link,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const AllVariants: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div className="flex flex-col gap-4">
        <Link href="#" variant="default">
          {isJa ? 'ドキュメントを読む' : 'Read the docs'}
        </Link>
        <Link href="#" variant="subtle">
          {isJa ? '利用規約' : 'Terms of Service'}
        </Link>
        <Link href="#" variant="arrow">
          {isJa ? '詳しく見る' : 'Learn more'}
        </Link>
      </div>
    );
  },
};
