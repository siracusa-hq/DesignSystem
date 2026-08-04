import type { Meta, StoryObj } from '@storybook/react';
import { MediaFrame } from '../../components/primitives/media-frame';
import { ProductShot } from '../../components/primitives/product-shot';
import { Avatar } from '../../components/primitives/avatar';

const meta = {
  title: 'Primitives/Media（MediaFrame / ProductShot / Avatar）',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const MediaFrame_比率とプレースホルダ: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {(['16:9', '4:3', '3:2', '1:1'] as const).map((r) => (
        <MediaFrame key={r} ratio={r} />
      ))}
    </div>
  ),
};

export const ProductShot_枠とフェード: Story = {
  render: () => (
    <div
      style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr', maxWidth: '56rem' }}
    >
      <div>
        <p style={{ fontSize: '.8rem', color: 'var(--color-on-surface-muted)' }}>
          frame=&quot;browser&quot;（既定・素材未定はワイヤーフレーム）
        </p>
        <ProductShot />
      </div>
      <div>
        <p style={{ fontSize: '.8rem', color: 'var(--color-on-surface-muted)' }}>
          frame=&quot;none&quot; + fade（ヒーロー下配置用）
        </p>
        <ProductShot frame="none" fade />
      </div>
    </div>
  ),
};

export const Avatar_サイズとフォールバック: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar name="田中" size="sm" />
      <Avatar name="鈴木" size="md" />
      <Avatar name="佐藤" size="lg" />
      <Avatar
        name="山田花子"
        size="lg"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%232f4989'/%3E%3C/svg%3E"
      />
    </div>
  ),
};
