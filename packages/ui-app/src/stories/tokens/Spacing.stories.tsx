import type { Meta, StoryObj } from '@storybook/react';
import { spacing } from '../../tokens/spacing';

const SpacingPage = () => {
  const entries = Object.entries(spacing).filter(([key]) => key !== '0' && key !== 'px');

  return (
    <div style={{ padding: '1rem', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Spacing Tokens
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: '2rem' }}>
        4pxグリッド基準。Tailwindクラスで使用: <code>p-4</code>, <code>gap-2</code> など
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.map(([name, value]) => {
          const px = parseFloat(value) * 16;
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <code
                style={{
                  fontSize: '12px',
                  color: '#71717a',
                  width: '40px',
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {name}
              </code>
              <div
                style={{
                  height: '20px',
                  width: value === '0px' ? '0px' : value,
                  minWidth: '2px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: '#a1a1aa',
                  flexShrink: 0,
                }}
              >
                {value} ({value === '0px' ? '0' : `${px}px`})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Tokens/Spacing',
  component: SpacingPage,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const AllSpacing: Story = {};
