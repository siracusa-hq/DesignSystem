import type { Meta, StoryObj } from '@storybook/react';
import { fontSize, fontWeight } from '../../tokens/typography';

function TypographySample({
  name,
  size,
  lineHeight,
  weight,
}: {
  name: string;
  size: string;
  lineHeight: string;
  weight?: string;
}) {
  return (
    <div className="flex items-baseline gap-6 border-b border-neutral-200 py-4 dark:border-neutral-700">
      <div className="w-32 shrink-0">
        <div className="text-body-sm font-medium text-[var(--color-on-surface)]">{name}</div>
        <div className="text-caption text-[var(--color-on-surface-muted)]">
          {size} / {lineHeight}
        </div>
      </div>
      <div
        className="text-[var(--color-on-surface)]"
        style={{ fontSize: size, lineHeight, fontWeight: weight }}
      >
        Enterprise Agent Stack
      </div>
    </div>
  );
}

function TypographyStory() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
          Typography / タイポグラフィ
        </h2>
        <p className="mt-2 text-body-md text-[var(--color-on-surface-secondary)]">
          Marketing-optimized type scale (base=16px, display up to 72px).
          <br />
          マーケティング向け拡張スケール（base=16px、display系は72pxまで）。
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-heading-md font-semibold text-[var(--color-on-surface)]">
          Font Sizes
        </h3>
        {Object.entries(fontSize).map(([name, { size, lineHeight }]) => (
          <TypographySample key={name} name={name} size={size} lineHeight={lineHeight} />
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-heading-md font-semibold text-[var(--color-on-surface)]">
          Font Weights
        </h3>
        {Object.entries(fontWeight).map(([name, weight]) => (
          <div key={name} className="flex items-baseline gap-6 py-2">
            <div className="w-32 shrink-0 text-body-sm text-[var(--color-on-surface-muted)]">
              {name} ({weight})
            </div>
            <div
              className="text-heading-lg text-[var(--color-on-surface)]"
              style={{ fontWeight: weight }}
            >
              Agent Coding時代の、消えない複雑性を解決する。
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Tokens/Typography',
  component: TypographyStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
