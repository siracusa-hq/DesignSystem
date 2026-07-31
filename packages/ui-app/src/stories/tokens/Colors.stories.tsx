import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '../../tokens/colors';

const ColorSwatch = ({
  name,
  shades,
}: {
  name: string;
  shades: Record<string, string>;
}) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3
      style={{
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        textTransform: 'capitalize',
      }}
    >
      {name}
    </h3>
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {Object.entries(shades).map(([shade, value]) => (
        <div key={shade} style={{ textAlign: 'center', width: '72px' }}>
          <div
            style={{
              width: '72px',
              height: '48px',
              backgroundColor: value,
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          />
          <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>{shade}</div>
          <div style={{ fontSize: '10px', color: '#a1a1aa' }}>{value}</div>
        </div>
      ))}
    </div>
  </div>
);

const ColorsPage = () => (
  <div style={{ padding: '1rem', maxWidth: '800px' }}>
    <h2
      style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}
    >
      Color Tokens
    </h2>
    <p style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: '2rem' }}>
      Tailwindクラスで使用: <code>bg-primary-500</code>, <code>text-error-600</code> など
    </p>
    {Object.entries(colors).map(([name, shades]) => (
      <ColorSwatch key={name} name={name} shades={shades as Record<string, string>} />
    ))}
  </div>
);

const meta: Meta = {
  title: 'Tokens/Colors',
  component: ColorsPage,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const AllColors: Story = {};
