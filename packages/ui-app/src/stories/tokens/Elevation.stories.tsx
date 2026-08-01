import type { Meta, StoryObj } from '@storybook/react';
import { shadows, radii } from '../../tokens/elevation';

const shadowDescriptions: Record<string, string> = {
  xs: '微細な区切り',
  sm: 'カード、コンテナ',
  md: 'ドロップダウン',
  lg: 'ダイアログ',
  xl: 'トースト通知',
  '2xl': '最大エレベーション',
  drawer: 'StackedDrawer',
};

const radiusDescriptions: Record<string, string> = {
  none: '角丸なし',
  sm: 'インライン要素',
  md: 'ボタン、入力フィールド',
  lg: 'ダイアログ',
  xl: '大きなコンテナ',
  '2xl': 'モーダル',
  full: 'アバター、バッジ',
};

const ElevationPage = () => (
  <div style={{ padding: '1rem', maxWidth: '800px' }}>
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>
      Elevation Tokens
    </h2>

    <section style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Shadows
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {Object.entries(shadows).map(([name, value]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100%',
                height: '80px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <code style={{ fontSize: '12px', color: '#71717a' }}>shadow-{name}</code>
            </div>
            <div style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '6px' }}>
              {shadowDescriptions[name]}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Border Radius
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {Object.entries(radii).map(([name, value]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: value,
                margin: '0 auto',
              }}
            />
            <div style={{ marginTop: '6px' }}>
              <code style={{ fontSize: '12px', color: '#71717a' }}>radius-{name}</code>
            </div>
            <div style={{ fontSize: '11px', color: '#a1a1aa' }}>
              {value} - {radiusDescriptions[name]}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Tokens/Elevation',
  component: ElevationPage,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'surface' },
  },
};

export default meta;

type Story = StoryObj;

export const AllElevation: Story = {};
