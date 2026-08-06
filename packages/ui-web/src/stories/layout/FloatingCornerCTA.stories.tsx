import type { Meta, StoryObj } from '@storybook/react';
import { FloatingCornerCTA } from '../../components/layout/floating-corner-cta';

/**
 * FloatingCornerCTA — 右下に浮かせる追従 CTA カード（Stage 4 Slice 1）。
 *
 * 実測（カミナシ）の `bottom: 30px; right: 30px; width: 380px`。
 * モバイルでは画面幅に収まるよう左右 `1rem` に張り、内部ボタンは `90%`。
 * 高さ（実測 240px）は固定しない。和文コピーは長さが暴れるため、
 * 高さを固定すると文字が溢れる。
 *
 * **閉じるボタンは必須**で、消すための props を持たない。
 * 閉じられない追従要素はモバイルで本文を覆うため、型の上で
 * 「× のない状態」を組めないようにしてある。
 * 閉じた状態は永続化しない（再訪時に出るのが実測どおり）。
 * 覚えさせたい場合は `onDismiss` を受けて利用側が実装する。
 */
const meta = {
  title: 'Layout/FloatingCornerCTA',
  component: FloatingCornerCTA,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FloatingCornerCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

const 本文サンプル = (
  <div style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <p key={i} style={{ margin: 0, color: 'var(--color-on-surface-secondary)' }}>
        カードが本文の上に浮いていること、× で閉じられることを確認するための本文です（{i + 1} /
        12）。
      </p>
    ))}
  </div>
);

export const 日本語: Story = {
  args: {
    title: 'まずは資料からご覧ください',
    description: '無料・1分で完了。フォームは3項目だけです。',
    actions: [
      { label: '資料をダウンロード', href: '#dl' },
      { label: '料金を見る', href: '#pricing' },
    ],
  },
  render: (args) => (
    <>
      {本文サンプル}
      <FloatingCornerCTA {...args} />
    </>
  ),
};

export const English: Story = {
  args: {
    title: 'Start with the guide',
    description: 'Free — takes one minute. Three fields only.',
    actions: [
      { label: 'Download the guide', href: '#dl' },
      { label: 'See pricing', href: '#pricing' },
    ],
    labels: { close: 'Dismiss' },
  },
  render: 日本語.render,
};

/** オファー1つ・補足なし（最小構成。× は消せない） */
export const 最小構成: Story = {
  args: {
    title: '料金プランは3分で診断できます',
    actions: [{ label: '料金を見る', href: '#pricing' }],
  },
  render: 日本語.render,
};

/** 和文の最悪ケース: コピーが長くてもカードが破綻しないこと（高さは内容で伸びる） */
export const 長い和文: Story = {
  args: {
    title: '導入前に知っておきたい5つのポイントをまとめた資料をご用意しています',
    description:
      '料金体系・導入までの流れ・既存システムとの連携範囲・セキュリティ要件・サポート体制まで、稟議に必要な情報を1つの資料にまとめました。無料・1分で完了します。',
    actions: [
      { label: '資料をダウンロード', href: '#dl' },
      { label: '導入相談を予約', href: '#demo' },
    ],
  },
  render: 日本語.render,
};
