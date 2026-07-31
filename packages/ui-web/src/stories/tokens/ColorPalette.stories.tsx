import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '../../tokens/colors';

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-md border border-neutral-200 dark:border-neutral-700"
        style={{ backgroundColor: hex }}
      />
      <div>
        <div className="text-body-sm font-medium text-[var(--color-on-surface)]">{name}</div>
        <div className="text-caption text-[var(--color-on-surface-muted)]">{hex}</div>
      </div>
    </div>
  );
}

function ColorScale({ name, scale }: { name: string; scale: Record<string, string> }) {
  return (
    <div className="space-y-2">
      <h3 className="text-heading-sm font-semibold capitalize text-[var(--color-on-surface)]">
        {name}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Object.entries(scale).map(([shade, hex]) => (
          <ColorSwatch key={shade} name={`${name}-${shade}`} hex={hex} />
        ))}
      </div>
    </div>
  );
}

function ColorPaletteStory() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
          Color Palette / カラーパレット
        </h2>
        <p className="mt-2 text-body-md text-[var(--color-on-surface-secondary)]">
          Brand colors shared with @polastack/design-system.
          <br />
          @polastack/design-system と共通のブランドカラーパレット。
        </p>
      </div>
      {Object.entries(colors).map(([name, scale]) => (
        <ColorScale key={name} name={name} scale={scale as Record<string, string>} />
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Tokens/Colors',
  component: ColorPaletteStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
