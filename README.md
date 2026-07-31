# Polastack Design System

Polastack（Enterprise Agent Stack）のデザインシステム。
ブランド共通トークンを正本に、用途別の2つのUIパッケージを提供する。

## パッケージ

| パッケージ | npm | 用途 |
|---|---|---|
| [`packages/tokens`](packages/tokens) | [`@polastack/tokens`](https://www.npmjs.com/package/@polastack/tokens) | ブランド共通トークンの正本。React非依存 |
| [`packages/ui-app`](packages/ui-app) | [`@polastack/design-system`](https://www.npmjs.com/package/@polastack/design-system) | 業務システムUI |
| [`packages/ui-web`](packages/ui-web) | [`@polastack/gtm-design-system`](https://www.npmjs.com/package/@polastack/gtm-design-system) | Web / LP / 営業資料 |

Storybook: <https://siracusa-hq.github.io/DesignSystem/>
（[業務システムUI](https://siracusa-hq.github.io/DesignSystem/app/) /
[Web・LP](https://siracusa-hq.github.io/DesignSystem/web/)）

## なぜトークンを切り出しているか

以前は業務システムUIとWeb/LPが別リポジトリで、トークンは**値をコピーして手で同期**していた。
その結果、2026-05-24 に業務システムUI側がプライマリカラーを `#008575` に変更した後も
Web/LP側は `#13c3a0` のまま追随せず、**約2ヶ月間ブランドカラーが分岐**した。

`#13c3a0` は白文字との対比が 2.25:1 しかなく、WebのCTAボタンは WCAG AA（4.5:1）を
満たしていなかった。jsdom 上の axe テストは色計算ができないため検出されず素通りしていた。

いまはトークンが唯一の正本であり、TS定数とCSS変数のズレを CI が機械的に検出する。

## カラー体系

用途で2階層に分かれる。同一色相（H≈173）の明度違いなので、ブランドとしては一つの色。

### `primary` — 操作用（`#008575` アンカー）

ボタン背景・リンク・フォーカスリングなど、テキストや意味を担うUI。
500 単独で白文字 **4.55:1**、WCAG AA 適合。業務システムUI・Web/LPで同値。

### `brand` — 装飾用（`#13c3a0` アンカー）

グラデーション・グロー・ダーク背景上のアクセント専用。
白背景での対比は 2.25:1 のため、**明背景のテキスト・ボタン背景には使えない**。
Web/LPパッケージにのみ存在する。

## 使い方

### React（業務システムUI）

```bash
pnpm add @polastack/design-system
```

```tsx
import { Button } from '@polastack/design-system';
import '@polastack/design-system/globals.css';
```

### React（Web / LP）

```bash
pnpm add @polastack/gtm-design-system
```

```tsx
import { MarketingButton } from '@polastack/gtm-design-system';
import '@polastack/gtm-design-system/globals.css';
```

### React を使わないサイト（Astro・静的HTML等）

CSS変数だけを読み込めば、同じブランドカラーを適用できる。

```bash
pnpm add @polastack/tokens
```

```css
@import '@polastack/tokens/brand.css';

.cta {
  background: var(--color-primary-500); /* 白文字 4.55:1 で AA 適合 */
  color: #fff;
}
.hero-glow {
  background: var(--color-brand-500); /* 装飾のみ。文字を載せないこと */
}
```

### トークンをプログラムから使う

```ts
import { primary, brand, spacing, radii } from '@polastack/tokens';
```

## 開発

```bash
pnpm install
pnpm build          # 全パッケージ（tokens → ui-app / ui-web の依存順）
pnpm test           # 全パッケージの Vitest
pnpm typecheck
pnpm storybook:app  # 業務システムUI（:6006）
pnpm storybook:web  # Web / LP（:6007）
```

変更を入れたら changeset を添える。詳しくは [CLAUDE.md](CLAUDE.md) と
[.changeset/README.md](.changeset/README.md) を参照。

```bash
pnpm changeset
```

## ライセンス

[MIT](LICENSE)
