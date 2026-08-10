import type { Meta, StoryObj } from '@storybook/react';
import { StickyHeaderCTA } from '../../components/layout/sticky-header-cta';
import { FloatingCornerCTA } from '../../components/layout/floating-corner-cta';
import { defineLandingPage, LandingPage } from '../../patterns';
import { ResourceRequestForm } from '../../components/sections/form';
import { createCTAClickCapture } from '../../lib/cta-click';

/**
 * StickyHeaderCTA — 固定ヘッダーに CTA を2本内包する追従形態（Stage 4 Slice 1）。
 *
 * 実測（19ページ）で確認できた追従 CTA は**2形態だけ**で、
 * これはそのうちの一方（カミナシ）。`position: fixed; top: 0; width: 100%`、
 * モバイルでは CTA 2本が各 `45vw` / 高さ `40px` で横並びになる。
 * **全幅の下部固定バーは実測 0/19 のため作っていない**（composition-redesign.md §4-2）。
 *
 * グローバルナビは持たない。獲得 LP は実測 2/2 でナビを剥がしており、
 * ナビ・ドロップダウン・モバイルメニューが要る通常のページは
 * `MarketingHeader` の領分。
 */
const meta = {
  title: 'Layout/StickyHeaderCTA',
  component: StickyHeaderCTA,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StickyHeaderCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

const 本文サンプル = (
  <div style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <p key={i} style={{ margin: 0, color: 'var(--color-on-surface-secondary)' }}>
        スクロールしてもヘッダーが残ることを確認するための本文です（{i + 1} / 12）。
        スペーサーは部品に内蔵されているので、呼び出し側で上余白を作る必要はありません。
      </p>
    ))}
  </div>
);

export const 日本語: Story = {
  args: {
    logo: <strong>ピアデスク</strong>,
    actions: [
      { label: '資料をダウンロード', href: '#dl' },
      { label: 'お問い合わせ', href: '#contact' },
    ],
  },
  render: (args) => (
    <>
      <StickyHeaderCTA {...args} />
      {本文サンプル}
    </>
  ),
};

export const English: Story = {
  args: {
    logo: <strong>Polastack</strong>,
    actions: [
      { label: 'Download the guide', href: '#dl' },
      { label: 'Talk to sales', href: '#contact' },
    ],
  },
  render: 日本語.render,
};

/** オファーが1本のとき（cta のみ。secondary は出ない） */
export const オファー1つ: Story = {
  args: {
    logo: <strong>ピアデスク</strong>,
    actions: [{ label: '資料をダウンロード', href: '#dl' }],
  },
  render: 日本語.render,
};

/**
 * 実戦例 — 獲得 LP（`lead-gen`）に追従 CTA を2形態とも載せる。
 *
 * `lead-gen` はグローバルナビを持たない型なので、常時見える導線は
 * `StickyHeaderCTA` が担う。右下の `FloatingCornerCTA` は閉じられる。
 *
 * **委譲の注意**: どちらの部品も `LandingPage` の**外**に描画されるため、
 * `LandingPage.onCTAClick` では拾えない。両方を含む祖先要素に
 * `createCTAClickCapture()` を張ると、LP 内の CTA も追従 CTA も
 * 同じ1箇所で受け取れる（stage4-workorder.md §7）。
 */
export const 実戦例_獲得LPに2形態とも載せる: Story = {
  args: 日本語.args,
  render: () => (
    <div
      onClickCapture={createCTAClickCapture<HTMLDivElement>((cta) => {
        // 利用側はここで自分の計測基盤へ送る（DS は計測タグを同梱しない）
        // eslint-disable-next-line no-console
        console.log('[CTA]', cta.id, cta.label, cta.href);
      }, undefined)}
    >
      <StickyHeaderCTA
        logo={<strong>ピアデスク</strong>}
        actions={[
          { label: '資料をダウンロード', href: '#form' },
          { label: 'お問い合わせ', href: '#contact' },
        ]}
      />
      <LandingPage
        {...defineLandingPage({
          pattern: 'lead-gen',
          brand: 'peerdesk',
          hero: {
            title: '5分でわかる、ピアデスク。',
            subtitle:
              '管理部門の業務がどう変わるかを、導入前後の実例でまとめた資料を無料配布中です。',
          },
          contents: {
            title: '資料の内容',
            features: [
              { title: '機能一覧と画面例', description: '全機能の概要をスクリーンショット付きで。' },
              { title: '導入前後の比較', description: '月次業務の時間がどう変わったか、実例で。' },
              { title: '料金と導入の流れ', description: '見積りの前に全体感がつかめます。' },
            ],
          },
          form: <ResourceRequestForm title="資料請求フォーム" />,
        })}
      />
      <FloatingCornerCTA
        title="まずは資料からご覧ください"
        description="無料・1分で完了。フォームは3項目だけです。"
        actions={[
          { label: '資料をダウンロード', href: '#form' },
          { label: '料金を見る', href: '#pricing' },
        ]}
      />
    </div>
  ),
};
