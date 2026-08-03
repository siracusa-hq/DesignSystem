import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Heading } from '../../components/primitives/heading';
import { AnimateOnScroll } from '../../components/primitives/animate-on-scroll';

/**
 * Stage 1 後半（意匠トークン・和文組版）の目視確認用カタログ。
 *
 * - 和文ガードの効果は、ツールバーの Locale を 日本語 ⇄ English で
 *   切り替えると同じ見出しの組みが変わることで確認できる。
 * - prefers-reduced-motion は OS の設定（アクセシビリティ > 視差効果を減らす）を
 *   有効にすると、下のモーションデモが即時表示になることで確認できる。
 */

function JaTypographySection() {
  return (
    <section className="space-y-4">
      <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">
        和文ガード — 負トラッキングの構造的無効化
      </h3>
      <p className="max-w-2xl text-body-sm text-[var(--color-on-surface-muted)]">
        下の2つの見出しは<strong>同一のコンポーネント・同一のクラス</strong>（負の字送り
        <code className="mx-1">tracking-[-0.04em]</code>を含む）。`lang`
        属性だけが違う。和文側はガードが字送り0・行間1.35に補正し、欧文側は従来どおり詰まる。
        ツールバーの Locale 切替でページ全体でも同じことが起きる。
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div
          lang="ja"
          className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-6"
        >
          <p className="mb-2 font-mono text-caption text-[var(--color-on-surface-muted)]">
            lang=&quot;ja&quot; — ガード適用
          </p>
          <Heading as="h2" size="display-lg">
            現場の業務に、監査に耐える エージェント基盤を。
          </Heading>
        </div>
        <div
          lang="en"
          className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-6"
        >
          <p className="mb-2 font-mono text-caption text-[var(--color-on-surface-muted)]">
            lang=&quot;en&quot; — 従来の欧文詰め
          </p>
          <Heading as="h2" size="display-lg">
            Enterprise agents, built for the audit trail.
          </Heading>
        </div>
      </div>
      <div
        lang="ja"
        className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-6"
      >
        <p className="mb-2 font-mono text-caption text-[var(--color-on-surface-muted)]">
          palt バグ修正の確認 — 見出し内の数字が等幅（tnum）のまま揃う
        </p>
        <Heading as="h2" size="display-sm">
          導入実績 1,111社 / 継続率 99.9% — 8,888件を処理
        </Heading>
        <p className="mt-1 text-caption text-[var(--color-on-surface-muted)]">
          修正前は palt が body の font-feature-settings
          を丸ごと上書きし、見出しの数字だけ幅が揃わなかった（1と8で幅が変わる）。
        </p>
      </div>
    </section>
  );
}

function ShadowSection() {
  const items = [
    ['raised', 'バッジ・小要素'],
    ['card', 'カード静止時'],
    ['card-hover', 'カードホバー'],
    ['overlay', 'ドロップダウン・固定ヘッダー'],
  ] as const;
  return (
    <section className="space-y-4">
      <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">
        2層シャドウ — 旧 shadow-xl との比較
      </h3>
      <div className="flex flex-wrap gap-6 rounded-xl bg-neutral-50 p-8 dark:bg-neutral-900">
        {items.map(([name, use]) => (
          <div
            key={name}
            className="flex h-32 w-44 flex-col justify-end rounded-[var(--radius-card)] bg-white p-3 dark:bg-neutral-800"
            style={{ boxShadow: `var(--shadow-${name})` }}
          >
            <div className="font-mono text-caption text-neutral-900 dark:text-neutral-100">
              --shadow-{name}
            </div>
            <div className="text-caption text-neutral-500">{use}</div>
          </div>
        ))}
        <div className="flex h-32 w-44 flex-col justify-end rounded-[var(--radius-card)] bg-white p-3 shadow-xl dark:bg-neutral-800">
          <div className="font-mono text-caption text-neutral-900 dark:text-neutral-100">
            shadow-xl（旧・単層）
          </div>
          <div className="text-caption text-neutral-500">輪郭が硬く「貼り付いて」見える</div>
        </div>
      </div>
    </section>
  );
}

function RadiiSection() {
  const items = [
    ['control', 'ボタン・入力', 'h-11 w-40'],
    ['media', '画像・スクショ', 'h-24 w-40'],
    ['card', 'カード', 'h-28 w-44'],
    ['panel', '大面・Bento', 'h-32 w-48'],
    ['pill', 'タグ・eyebrow', 'h-8 w-28'],
  ] as const;
  return (
    <section className="space-y-4">
      <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">
        役割名ラディウス — 選択肢ではなく役割から形状が決まる
      </h3>
      <div className="flex flex-wrap items-end gap-4">
        {items.map(([name, use, size]) => (
          <div key={name} className="space-y-1 text-center">
            <div
              className={`${size} border-2 border-[var(--color-border-brand)] bg-[var(--color-bg-brand-subtle)]`}
              style={{ borderRadius: `var(--radius-${name})` }}
            />
            <div className="font-mono text-caption text-[var(--color-on-surface-muted)]">
              {name}
            </div>
            <div className="text-caption text-[var(--color-on-surface-muted)]">{use}</div>
          </div>
        ))}
      </div>
      <p className="text-caption text-[var(--color-on-surface-muted)]">
        入れ子の規則: 内側の半径が外側を超えてはならない（panel の中に
        control、は可。その逆は不可）。
      </p>
    </section>
  );
}

function MotionSection() {
  const [runId, setRunId] = useState(0);
  return (
    <section className="space-y-4">
      <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">
        演出系モーション — 旧（300ms / Material ease-out）との比較
      </h3>
      <button
        className="rounded-[var(--radius-control)] bg-[var(--color-bg-brand-primary)] px-5 py-2 text-body-sm font-semibold text-[var(--color-on-brand)]"
        onClick={() => setRunId((n) => n + 1)}
      >
        ▶ 再生
      </button>
      <div key={runId} className="grid gap-4 lg:grid-cols-3">
        {(
          [
            ['旧: 300ms + Material ease-out', 'var(--duration-slow)', 'var(--ease-out)'],
            ['前回案: 640ms + expo（立ち上がりが急）', '640ms', 'cubic-bezier(0.16, 1, 0.3, 1)'],
            [
              '採用: reveal(720ms) + entrance quart',
              'var(--duration-reveal)',
              'var(--ease-entrance)',
            ],
          ] as const
        ).map(([label, dur, ease]) => (
          <div
            key={label}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-6"
          >
            <p className="mb-3 font-mono text-caption text-[var(--color-on-surface-muted)]">
              {label}
            </p>
            <div
              className="h-16 w-full rounded-[var(--radius-media)] bg-[var(--color-bg-brand-primary)]"
              style={{
                animationName: runId ? 'craft-reveal' : undefined,
                animationDuration: dur,
                animationTimingFunction: ease,
                animationFillMode: 'both',
              }}
            />
          </div>
        ))}
      </div>
      <style>{`@keyframes craft-reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <p className="max-w-2xl text-caption text-[var(--color-on-surface-muted)]">
        新カーブ（ease-out-expo）は出だしが速く着地が柔らかい。OS
        の「視差効果を減らす」を有効にすると トークン層の prefers-reduced-motion
        処理により両方とも即時表示になる（コンポーネント側の対応は不要）。
      </p>
    </section>
  );
}

function AnimateOnScrollDemo() {
  const [runId, setRunId] = useState(0);
  const cards = ['監査ログ', '権限管理', 'ゼロ保持'];
  return (
    <section className="space-y-4">
      <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">
        AnimateOnScroll 実機デモ — スクロール不要・ボタンで再生
      </h3>
      <p className="max-w-2xl text-body-sm text-[var(--color-on-surface-muted)]">
        実際の AnimateOnScroll コンポーネント（fade-up + stagger）。 トークン化により entrance
        カーブと reveal 時間が適用されている。
      </p>
      <button
        className="rounded-[var(--radius-control)] bg-[var(--color-bg-brand-primary)] px-5 py-2 text-body-sm font-semibold text-[var(--color-on-brand)]"
        onClick={() => setRunId((n) => n + 1)}
      >
        ▶ 再生
      </button>
      <div key={runId} className="grid gap-4 sm:grid-cols-3">
        {cards.map((title, i) => (
          <AnimateOnScroll key={title} animation="fade-up" staggerIndex={i}>
            <div
              className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              style={{ borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="mb-1 h-8 w-8 rounded-[var(--radius-control)] bg-[var(--color-bg-brand-muted)]" />
              <div className="font-semibold text-[var(--color-on-surface)]">{title}</div>
              <p className="text-body-sm text-[var(--color-on-surface-muted)]">
                stagger {i * 100}ms で順番に表出する。
              </p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

function CraftStory() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
          意匠トークンと和文組版 / Craft Tokens
        </h2>
      </div>
      <JaTypographySection />
      <ShadowSection />
      <RadiiSection />
      <MotionSection />
      <AnimateOnScrollDemo />
    </div>
  );
}

const meta = {
  title: 'Tokens/Craft（意匠・和文組版）',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const 一覧: Story = { render: () => <CraftStory /> };
