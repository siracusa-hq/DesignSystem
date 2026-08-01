import type { Meta, StoryObj } from '@storybook/react';
import { fontSize, fontWeight } from '../../tokens/typography';

const sizeDescriptions: Record<string, string> = {
  xs: 'テーブルセル、注釈',
  sm: '本文（高密度モード）',
  base: '本文（標準モード）',
  lg: '小見出し',
  xl: 'セクション見出し',
  '2xl': 'ページタイトル',
  '3xl': 'ダッシュボード見出し',
};

const TypographyPage = () => (
  <div style={{ padding: '1rem', maxWidth: '800px' }}>
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>
      Typography Tokens
    </h2>

    <section style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Font Size Scale
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.entries(fontSize).map(([name, { size, lineHeight }]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '0.75rem',
            }}
          >
            <code
              style={{
                fontSize: '12px',
                color: '#71717a',
                width: '60px',
                flexShrink: 0,
              }}
            >
              text-{name}
            </code>
            <div style={{ fontSize: size, lineHeight, flexGrow: 1 }}>
              デザインシステム Design System あいうえお 0123456789
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#a1a1aa',
                width: '120px',
                flexShrink: 0,
                textAlign: 'right',
              }}
            >
              {size} / {lineHeight}
              <br />
              {sizeDescriptions[name]}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Font Weight
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(fontWeight).map(([name, weight]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
            }}
          >
            <code style={{ fontSize: '12px', color: '#71717a', width: '80px' }}>
              font-{name}
            </code>
            <span style={{ fontWeight: Number(weight), fontSize: '0.875rem' }}>
              ウェイト {weight} - The quick brown fox あいうえお
            </span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Monospace Font
      </h3>
      <pre
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: '0.8125rem',
          lineHeight: '1.5',
          backgroundColor: '#fafafa',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #e4e4e7',
        }}
      >
        {`const greeting = "こんにちは世界";
console.log(greeting); // => こんにちは世界
const sum = (a: number, b: number) => a + b;`}
      </pre>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Tokens/Typography',
  component: TypographyPage,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const AllTypography: Story = {};
