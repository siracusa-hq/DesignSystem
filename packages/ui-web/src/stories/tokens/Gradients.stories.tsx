import type { Meta, StoryObj } from '@storybook/react';
import { gradients } from '../../tokens/gradients';

function GradientSwatch({ name, value }: { name: string; value: string }) {
  const isText = name.startsWith('text');
  return (
    <div className="space-y-2">
      <div
        className="h-24 w-full rounded-xl border border-neutral-200 dark:border-neutral-700"
        style={{ background: value }}
      />
      <div>
        <div className="text-body-sm font-medium text-[var(--color-on-surface)]">{name}</div>
        <div className="text-caption break-all text-[var(--color-on-surface-muted)]">{value}</div>
      </div>
      {isText && (
        <div
          className="text-display-sm font-bold"
          style={{
            background: value,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Polastack
        </div>
      )}
    </div>
  );
}

function GradientsStory() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
          Gradients / グラデーション
        </h2>
        <p className="mt-2 text-body-md text-[var(--color-on-surface-secondary)]">
          Decorative gradients for marketing use.
          <br />
          マーケティング向け装飾グラデーション。
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(gradients).map(([name, value]) => (
          <GradientSwatch key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Tokens/Gradients',
  component: GradientsStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
