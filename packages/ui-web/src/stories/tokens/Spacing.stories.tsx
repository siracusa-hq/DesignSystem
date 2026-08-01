import type { Meta, StoryObj } from '@storybook/react';
import { sectionSpacing, containerWidth } from '../../tokens/spacing';

function SpacingBar({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 shrink-0 text-body-sm text-[var(--color-on-surface-muted)]">
        {name} ({value})
      </div>
      <div
        className="h-6 rounded bg-primary-400"
        style={{ width: value, maxWidth: '100%' }}
      />
    </div>
  );
}

function SpacingStory() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
          Spacing / スペーシング
        </h2>
        <p className="mt-2 text-body-md text-[var(--color-on-surface-secondary)]">
          Section spacing and container widths for marketing layouts.
          <br />
          マーケティングレイアウト向けセクション間余白・コンテナ幅。
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-heading-md font-semibold text-[var(--color-on-surface)]">
          Section Spacing / セクション間余白
        </h3>
        <div className="space-y-3">
          {Object.entries(sectionSpacing).map(([name, value]) => (
            <SpacingBar key={name} name={`section-${name}`} value={value} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-heading-md font-semibold text-[var(--color-on-surface)]">
          Container Widths / コンテナ幅
        </h3>
        <div className="space-y-3">
          {Object.entries(containerWidth).map(([name, value]) => (
            <SpacingBar key={name} name={`container-${name}`} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Tokens/Spacing',
  component: SpacingStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
