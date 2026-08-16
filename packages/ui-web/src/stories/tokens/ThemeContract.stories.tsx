import type { Meta, StoryObj } from '@storybook/react';
import { STEP_VALUES, SLOTS, resolveAllBrands } from '@siracusahq/tokens';

/**
 * テーマ契約（Stage 1）の目視確認用カタログ。
 *
 * ここに表示される色はすべて `data-brand` 属性と CSS 変数
 * （--ramp-* / --color-*-brand-*）だけで切り替わっている。
 * React 側でブランドごとの分岐は一切書いていない —— それがテーマ契約の本体。
 */

const brands = resolveAllBrands();

/** スロットを実際に使った UI サンプル。全ブランドで同一の JSX */
function SlotShowcase() {
  return (
    <div className="space-y-4">
      {/* 操作系: primary / hover / active は「同じ部品の状態」として並べる */}
      <div className="flex flex-wrap items-center gap-3">
        {(
          [
            ['通常', '--color-bg-brand-primary'],
            ['hover', '--color-bg-brand-hover'],
            ['active', '--color-bg-brand-active'],
          ] as const
        ).map(([label, slot]) => (
          <span
            key={slot}
            className="inline-flex flex-col items-center gap-1 text-caption text-[var(--color-on-surface-muted)]"
          >
            <span
              className="inline-flex h-11 items-center rounded-xl px-6 font-semibold"
              style={{ background: `var(${slot})`, color: 'var(--color-on-brand)' }}
            >
              資料をダウンロード
            </span>
            {label}
          </span>
        ))}
        <span
          className="inline-flex h-11 items-center rounded-xl px-6 font-semibold"
          style={{
            background: 'var(--color-bg-brand-primary)',
            color: 'var(--color-on-brand)',
            boxShadow: 'var(--shadow-glow-brand)',
          }}
        >
          + グロー（--shadow-glow-brand）
        </span>
        <span
          className="inline-flex h-11 items-center rounded-xl border-2 border-dashed border-[var(--color-border-brand)] px-6 font-semibold"
          style={{ background: 'var(--color-bg-cta)', color: 'var(--color-on-cta)' }}
          title="第3役割。既定は操作色へのフォールバックなので同色。専用CTA色を持つブランドだけ変わる"
        >
          CTA第3役割（--color-bg-cta）
        </span>
      </div>

      {/* テキスト系: 明背景 / ダーク面 */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border-brand)' }}>
          <p className="text-body-sm text-[var(--color-on-surface-muted)]">明背景（白）</p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-body-md font-semibold"
            style={{ color: 'var(--color-text-brand)' }}
          >
            リンク・強調テキスト（--color-text-brand・AA保証）→
          </a>
        </div>
        <div className="rounded-lg bg-neutral-950 p-4">
          <p className="text-body-sm text-neutral-400">ダーク面（neutral-950）</p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-body-md font-semibold"
            style={{ color: 'var(--color-text-brand-on-dark)' }}
          >
            ダーク面のリンクは装飾段（--color-text-brand-on-dark）→
          </a>
        </div>
      </div>

      {/* 面と装飾 */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-body-sm"
          style={{ background: 'var(--color-surface-tinted)' }}
          title="白 50% + ramp-50 50%。LP の面リズム（Page の tinted スロット）が使う。白 / ティント / subtle 面が 1.06〜1.08:1 の等間隔になる"
        >
          ティント面（--color-surface-tinted）
        </span>
        <span
          className="rounded-lg px-4 py-2 text-body-sm"
          style={{ background: 'var(--color-bg-brand-subtle)' }}
        >
          subtle 面
        </span>
        <span
          className="rounded-lg px-4 py-2 text-body-sm"
          style={{ background: 'var(--color-bg-brand-muted)' }}
        >
          muted 面
        </span>
        <span
          className="rounded-lg px-4 py-2 text-body-sm text-white"
          style={{ background: 'var(--color-bg-brand-strong)' }}
        >
          strong 面
        </span>
        <span
          className="h-10 w-40 rounded-lg"
          style={{
            background:
              'linear-gradient(90deg, var(--color-decor-brand-soft), var(--color-decor-brand))',
          }}
          title="装飾グラデーション（--color-decor-brand-soft → --color-decor-brand）"
        />
      </div>
    </div>
  );
}

function BrandSection({
  dataBrand,
  label,
  mode,
}: {
  dataBrand: string;
  label: string;
  mode: string;
}) {
  const ramp = brands.find((b) => b.dataBrand === dataBrand)!.ramp;
  return (
    <section data-brand={dataBrand} className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">{label}</h3>
        <code className="text-caption text-[var(--color-on-surface-muted)]">
          data-brand=&quot;{dataBrand}&quot;（{mode}）
        </code>
      </div>
      {/* ランプ実体（層2） */}
      <div className="grid grid-cols-11 overflow-hidden rounded-lg">
        {STEP_VALUES.map((step) => (
          <div
            key={step}
            className="flex h-12 items-end p-1"
            style={{ background: `var(--ramp-${dataBrand}-${step})` }}
            title={`--ramp-${dataBrand}-${step}: ${ramp[step]}`}
          >
            <span
              className="font-mono text-[10px]"
              style={{ color: step >= 500 ? '#ffffffcc' : '#00000090' }}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      {/* 抽象スロット（層3）を使った実UI */}
      <SlotShowcase />
    </section>
  );
}

function ThemeContractStory() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-display-sm font-bold text-[var(--color-on-surface)]">
          テーマ契約 / Theme Contract
        </h2>
        <p className="mt-2 max-w-2xl text-body-md text-[var(--color-on-surface-muted)]">
          全ブランドのUIサンプルは<strong>完全に同一のJSX</strong>で、`data-brand`
          属性だけで切り替わる。ボタン・リンク・面・グラデーションの色がブランドごとに
          正しく変わっていれば、契約（層2ランプ + 層3スロット）が機能している。
        </p>
      </div>
      {brands.map((b) => (
        <BrandSection
          key={b.dataBrand}
          dataBrand={b.dataBrand}
          label={b.entry.label}
          mode={b.entry.mode}
        />
      ))}

      <section className="space-y-3">
        <h3 className="text-heading-md font-semibold text-[var(--color-on-surface)]">
          セクション単位の切替（バクラク共通ヘッダー方式）
        </h3>
        <p className="text-body-sm text-[var(--color-on-surface-muted)]">
          1つのナビの中で、チップだけが各ブランドの操作色になる。
        </p>
        <nav className="flex flex-wrap gap-3 rounded-xl border border-[var(--color-border)] p-4">
          {brands.map((b) => (
            <span
              key={b.dataBrand}
              data-brand={b.dataBrand}
              className="inline-flex items-center rounded-full px-4 py-1.5 text-body-sm font-semibold"
              style={{
                background: 'var(--color-bg-brand-primary)',
                color: 'var(--color-on-brand)',
              }}
            >
              {b.entry.label}
            </span>
          ))}
        </nav>
      </section>

      <section className="space-y-2">
        <h3 className="text-heading-sm font-semibold text-[var(--color-on-surface)]">
          スロット一覧（{SLOTS.length}種 + グロー2種）
        </h3>
        <ul className="grid gap-1 font-mono text-caption text-[var(--color-on-surface-muted)] sm:grid-cols-2">
          {SLOTS.map((s) => (
            <li key={s.name}>
              {s.name} → {'step' in s && s.step !== undefined ? `${s.step}段` : s.fixed}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: 'Tokens/ThemeContract（テーマ契約）',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const 全ブランド一覧: Story = { render: () => <ThemeContractStory /> };
