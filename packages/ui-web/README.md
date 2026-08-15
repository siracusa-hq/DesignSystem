# @siracusahq/gtm-design-system

> [日本語](#日本語) | [English](#english)

---

## 日本語

[Polastack](https://github.com/siracusa-hq) のマーケティングコミュニケーション向けデザインシステムです。Webサイト、ランディングページ、営業資料、講演資料のための統一されたコンポーネントとデザイントークンを提供します。

> **注意:** 本パッケージは**マーケティング用 GTM デザインシステム**です。プロダクトUI用のデザインシステムは [@siracusahq/design-system](https://github.com/siracusa-hq/DesignSystem/tree/main/packages/ui-app) を参照してください。

### Storybook

https://siracusa-design-system.netlify.app/web/

### インストール

```bash
pnpm add @siracusahq/gtm-design-system

# スライドコンポーネントを使用する場合
pnpm add spectacle

# シンタックスハイライトを有効にする場合
pnpm add shiki
```

### セットアップ

スタイルは**コンパイル済み CSS を1行読み込むだけ**です。Tailwind の導入・設定は不要です。

```css
/* app.css（またはエントリポイントの JS/TS から） */
@import '@siracusahq/gtm-design-system/styles.css';
```

これに含まれるもの:

- 全コンポーネントのスタイル（CSS Modules でハッシュ済み。利用側のクラス名と衝突しません）
- デザイントークン（CSS 変数）と 4 ブランドのテーマ定義（`data-brand` 属性で切替）
- Web フォントの読み込み（Google Fonts の `@import`: `Inter` + `Noto Sans JP` + `JetBrains Mono`）

#### フォントをセルフホストする場合

`next/font` や Astro の Fonts API でセルフホストする場合は、フォントを自前で読み込んだうえで
CSS 変数 `--font-sans` / `--font-mono` を上書きしてください（`styles.css` 先頭の
`@import url('https://fonts.googleapis.com/...')` は後勝ちの `:root` 上書きで無効化できます）。

#### ブランドの切替

ページまたは任意のサブツリーに `data-brand` 属性を付けるとテーマが切り替わります。

```html
<body data-brand="polastack">
  <!-- corporate（既定） / polastack / peerdesk / peerdesk-taxpeer -->
</body>
```

### 使い方

```tsx
// コンポーネントのインポート
import { HeroSection, FeatureGrid, MarketingButton } from '@siracusahq/gtm-design-system';

// トークンのインポート
import { colors, gradients, fontSize } from '@siracusahq/gtm-design-system/tokens';

// スライドコンポーネントのインポート
import { SlideDeck, TitleSlide, StatSlide } from '@siracusahq/gtm-design-system/slides';
```

### デザイントークン

`@siracusahq/design-system` と共通のブランドアイデンティティを継承しつつ、マーケティング向けに拡張しています。

| トークン        | 説明                                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Colors**      | 操作用 `primary`（`#008575` / 白文字 4.55:1 で WCAG AA 適合）+ 装飾用 `brand`（`#13c3a0` / グラデーション・グロー専用）+ ニュートラル（neutral-850含む）+ セマンティック |
| **Typography**  | Display 72px 〜 Caption 12px（基準 16px）、サイズ別letter-spacing最適化                                                                                                  |
| **Spacing**     | セクション間余白 80–160px、コンテナ幅 640–1280px                                                                                                                         |
| **Gradients**   | ブランドグラデーション、グロー効果、テキストグラデーション                                                                                                               |
| **Elevation**   | シャドウ + プライマリグロー                                                                                                                                              |
| **Animation**   | フェードイン、スライド、スケール、ブラーイン + スクロール連動                                                                                                            |
| **Breakpoints** | モバイル / タブレット / デスクトップ / ワイド                                                                                                                            |

#### プロダクトUI用DSとのタイポグラフィ比較

|            | プロダクトUI (`@siracusahq/design-system`) | GTM（本パッケージ）      |
| ---------- | ------------------------------------------ | ------------------------ |
| 基準サイズ | 14px                                       | 16px                     |
| 最大サイズ | 24px                                       | 72px (display-2xl)       |
| Display系  | なし                                       | 30 / 36 / 48 / 60 / 72px |

### ページを組む2つの方法

#### (a) LP 量産 — `defineLandingPage()`（データ駆動）

構成（セクションの順序・背景リズム・CTA の配置とラベル）は国内 BtoB SaaS の
実測に基づいてパターンが決めます。呼び出し側は内容だけを渡し、
必須スロットの欠落は型エラーで落ちます。

```tsx
import { defineLandingPage, LandingPage } from '@siracusahq/gtm-design-system';

<LandingPage {...defineLandingPage({
  pattern: 'product',            // product / product-portfolio-top / lead-gen / corporate-top / case-study-list
  brand: 'peerdesk-taxpeer',     // corporate / polastack / peerdesk / peerdesk-taxpeer
  hero: { title: '…', subtitle: '…', offers: [/* 1〜2オファー。帯と締めに自動再利用 */] },
  features: { title: '…', features: [/* … */] },
  closing: { title: '…' },
})} />
```

#### (b) 一点物のページ — `<Page>`（コンポジション）

並べ方は自由、背景と余白のリズムは自動。暗い面の3連続や
プライマリ CTA ラベル3種類目は開発中に警告が出ます。

```tsx
<Page brand="corporate" tone="trust">
  <HeroSection … />
  <ModuleOverview … />
  <CTASection … />
</Page>
```

`tone` はページの狙い（`trust` = 余白広め・信頼 / `product` = 基準 /
`campaign` = 高密度・獲得）で、ブランドと直交します。

### AI エージェントと使う

規範ファイルを配布物に同梱しています。インストール後、`node_modules` 内の
2ファイルをエージェントに読ませてください。

| ファイル                                                        | 中身                                                             |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| `node_modules/@siracusahq/gtm-design-system/AGENTS.md`          | 入口。導入1行・語彙（ブランド4 / トーン3 / ページ型5）・組み方2択 |
| `node_modules/@siracusahq/gtm-design-system/GUIDELINES.md`      | Do's & Don'ts の正本。すべてのルールに実測の根拠つき             |

最小のプロンプト例:

```text
node_modules/@siracusahq/gtm-design-system/AGENTS.md を読んでから、
@siracusahq/gtm-design-system で製品LPを1枚作って。
判断に迷ったら同ディレクトリの GUIDELINES.md を参照すること。
```

構成の判断はパターンが持つため、エージェントの仕事はスロットを埋めることになります。
逸脱は型エラーと dev 警告が止めます（一覧は GUIDELINES.md §6）。

### 計測フック

**計測タグ（GA4 / GTM 等）は同梱しません。** ベンダーの選択は利用側の決定です。
このパッケージが提供するのは「口」だけで、受けたイベントの送り先は利用側が決めます。

#### CTA クリック

CTA には `data-cta` が自動で付き、`onCTAClick` でページ単位に一括で受け取れます。
id はセクションが割り当てるため、呼び出し側で命名する必要はありません
（ヘッダー `header-${i}` / FV `hero-${i}` / 中間帯 `cta-band-${i}` /
料金 `pricing-${i}` / 締め `closing-${i}` / フォーム送信 `form-submit`）。

```tsx
<LandingPage
  {...defineLandingPage({ /* … */ })}
  onCTAClick={({ id, label, href }) => analytics.track('cta_click', { id, label, href })}
/>

// 一点物のページでも同じ
<Page brand="corporate" onCTAClick={(cta) => analytics.track('cta_click', cta)}>…</Page>

// 独自に置いたボタンは ctaId を明示する
<MarketingButton ctaId="sidebar-trial" href="/trial">無料で試す</MarketingButton>
```

#### フォーム送信

`onResult` を渡すと送信が fetch（AJAX）に切り替わり、ページ遷移せずに
成功/失敗を受け取れます（URL エンコード・`form-name` 同梱・POST 先は
`action ?? location.pathname`。Netlify Forms の AJAX 仕様どおり）。

```tsx
<ResourceRequestForm
  title="資料請求"
  resourceName="polastack-overview"
  onResult={({ ok, status, error }) => (ok ? showThanks() : showError(status ?? error))}
/>
```

**ネイティブ POST（`onResult` 未指定）では送信イベントは原理的に出せません。**
ブラウザがページごと遷移するため、JS が結果を観測する機会がないからです。
送信経路の優先順位は `onSubmit`（完全手動） > `onResult`（AJAX） > ネイティブ POST。

### コンポーネント一覧

#### プリミティブ（19）

Container, Section, Grid, Heading, Text, Eyebrow, MarketingButton, SelectField, Logo, LogoMark, MediaFrame, ProductShot, Avatar, GradientText, Divider, Link, Badge, AnimatedCounter, AnimateOnScroll

#### セクション（16）

HeroSection, FeatureGrid, FeatureShowcase, PricingTable, PricingCard, CTASection, CTABand, FAQSection, ComparisonTable, TestimonialSection, LogoCloud, StatsSection, CodeBlock, ServicePortfolio, CaseStudySection, CaseStudyListSection

#### コーポレートサイトの下層ページ（5）

散文・法務文書・会社情報。LP のセクション群とは別の面を担う。

ProseSection（散文 = ミッション・代表挨拶）, DocumentArticle（法務文書・404 の器）, CompanyProfileSection（会社概要表）, LeadershipSection（経営陣）, HistorySection（沿革）

`DocumentArticle` は **Markdown → HTML の変換を同梱しない**。変換済みの内容を `children` に渡すと、組版（見出し階層・表・リスト・引用）だけを DS が担う。

**お知らせ・ブログの一覧と記事はこれらの担当ではない。** `article-list` / `article-detail` ページ型が担う（[article-pages-workorder.md](./docs/article-pages-workorder.md)）。

#### フォーム（Netlify Forms 対応）

ContactForm, ResourceRequestForm, DemoRequestForm（+ FormInput / FormTextarea / FormSelect / FormCheckbox / FormButton）

項目は `inquiryTypes`（問い合わせ種別）/ `phone`（電話番号）/ `consent`（個人情報同意）と、任意の追加項目 `extraFields` で足せる。**開いているのは「項目」であって「見た目」ではない** — `extraFields` はデータだけを受け取り、描画は DS のフォーム部品に固定される。

外部の入力補完サービス（`ichisanEnabled`）は **既定オフ**。有効にすると外部スクリプトを読み込む。

#### プロダクト固有 + 日本市場向け（4）

ModuleOverview, MigrationComparison, AirPocketFeature, SecurityBadges

#### レイアウト / ページ（4）

MarketingHeader, MarketingFooter, PageLayout, Page

#### フック（1）

useInView

### スライドコンポーネント（27レイアウト）

`@siracusahq/gtm-design-system/slides` サブパスで提供。Spectacleベースの営業資料・講演資料用スライドレイアウト。

```tsx
import { SlideDeck, TitleSlide, ComparisonSlide } from '@siracusahq/gtm-design-system/slides';

const MyDeck = () => (
  <SlideDeck dark>
    <TitleSlide title="Polastack" badge="Enterprise Agent Stack" />
    <ComparisonSlide
      title="従来との違い"
      leftHeader="従来"
      rightHeader="Polastack"
      leftItems={['認証実装3週間']}
      rightItems={['認証コード0行']}
    />
  </SlideDeck>
);
```

| カテゴリ              | レイアウト                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Structure（5）**    | TitleSlide, AgendaSlide, SectionDividerSlide, EndSlide, TeamSlide                                     |
| **Content（7）**      | ContentSlide, SplitSlide, BulletSlide, ComparisonSlide, ThreeColumnSlide, PricingSlide, TableSlide    |
| **Visual（5）**       | ImageSlide, ImageTextSlide, FlowSlide, DiagramSlide, IconGridSlide                                    |
| **Data（5）**         | StatSlide, TimelineSlide, ChartSlide, MetricHighlightSlide, BeforeAfterMetricSlide                    |
| **Social Proof（4）** | QuoteSlide, LogoGridSlide, CaseStudySlide, AwardSlide                                                 |
| **日本市場向け（5）** | SecurityComplianceSlide, SupportStructureSlide, ImplementationPlanSlide, ROICalculationSlide, QASlide |

### 技術スタック

- **React** 18/19
- **CSS Modules** + テーマ契約（CSS 変数スロット。利用側に Tailwind は不要）
- **TypeScript**（strict mode）
- **CVA**（class-variance-authority）によるバリアント管理
- **Spectacle** 10（スライドコンポーネント）
- **Storybook** 8（ドキュメント・カタログ）
- **Vitest** + Testing Library + axe-core（テスト・a11y検証）
- **tsup**（ESMビルド）

### 開発コマンド

```bash
pnpm install      # 依存関係インストール
pnpm storybook    # Storybook 起動
pnpm build        # ビルド
pnpm test         # テスト実行
pnpm typecheck    # 型チェック
```

### Storybook 機能

- **テーマ切替**: ライト / ダークモード
- **言語切替**: 日本語 / English
- **a11y アドオン**: アクセシビリティ監査パネル
- **スライドプレビュー**: 矢印キー / クリックでナビゲーション

### プロジェクト構成

```
src/
├── tokens/          # デザイントークン
├── styles/          # グローバルCSS（@theme）
├── lib/             # ユーティリティ（cn）
├── hooks/           # カスタムフック（useInView）
├── components/
│   ├── primitives/  # Container, Heading, Button, AnimateOnScroll 等
│   ├── sections/    # Hero, Feature, Pricing, CTA, FAQ, SecurityBadges 等
│   ├── layout/      # Header, Footer, PageLayout
│   └── slides/      # Spectacle ベースのスライドレイアウト（27種）
├── stories/         # Storybook ストーリー
└── test/            # テストセットアップ
```

---

## English

Marketing design system for [Polastack](https://github.com/siracusa-hq) — components and design tokens for websites, landing pages, and sales materials.

> **Note:** This is the **GTM (Go-To-Market) Design System** for marketing use. For the product UI design system, see [@siracusahq/design-system](https://github.com/siracusa-hq/DesignSystem/tree/main/packages/ui-app).

### Storybook

https://siracusa-design-system.netlify.app/web/

### Install

```bash
pnpm add @siracusahq/gtm-design-system

# For slide components
pnpm add spectacle

# For syntax highlighting
pnpm add shiki
```

### Setup

Styles ship as a **single precompiled CSS file** — one import, no Tailwind required.

```css
/* app.css (or from your JS/TS entry point) */
@import '@siracusahq/gtm-design-system/styles.css';
```

This includes:

- All component styles (hashed via CSS Modules — no class-name collisions with your app)
- Design tokens (CSS variables) and the 4 brand themes (switched via the `data-brand` attribute)
- Web fonts (a Google Fonts `@import`: `Inter` + `Noto Sans JP` + `JetBrains Mono`)

#### Self-hosting fonts

To self-host via `next/font` or Astro's Fonts API, load the fonts yourself and override
the `--font-sans` / `--font-mono` CSS variables (a later `:root` rule wins over the
Google Fonts `@import` at the top of `styles.css`).

#### Switching brands

Set the `data-brand` attribute on the page or any subtree:

```html
<body data-brand="polastack">
  <!-- corporate (default) / polastack / peerdesk / peerdesk-taxpeer -->
</body>
```

### Usage

```tsx
// Import components
import { HeroSection, FeatureGrid, MarketingButton } from '@siracusahq/gtm-design-system';

// Import tokens
import { colors, gradients, fontSize } from '@siracusahq/gtm-design-system/tokens';

// Import slide components
import { SlideDeck, TitleSlide, StatSlide } from '@siracusahq/gtm-design-system/slides';
```

### Design Tokens

Shared brand identity with `@siracusahq/design-system`, extended for marketing:

| Token           | Description                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Colors**      | Interactive `primary` (`#008575`, 4.55:1 against white — WCAG AA) + decorative `brand` (`#13c3a0`, gradients/glows only) + neutral (incl. neutral-850) + semantic |
| **Typography**  | Display 72px to Caption 12px (base 16px), size-specific letter-spacing                                                                                            |
| **Spacing**     | Section spacing 80–160px, container widths 640–1280px                                                                                                             |
| **Gradients**   | Brand gradients, glow effects, text gradients                                                                                                                     |
| **Elevation**   | Shadows + primary glow effects                                                                                                                                    |
| **Animation**   | Fade-in, slide, scale, blur-in + scroll-triggered                                                                                                                 |
| **Breakpoints** | Mobile / Tablet / Desktop / Wide                                                                                                                                  |

#### Typography comparison with Product UI

|               | Product UI (`@siracusahq/design-system`) | GTM (this package)       |
| ------------- | ---------------------------------------- | ------------------------ |
| Base size     | 14px                                     | 16px                     |
| Max size      | 24px                                     | 72px (display-2xl)       |
| Display sizes | —                                        | 30 / 36 / 48 / 60 / 72px |

### Two ways to build a page

#### (a) Mass-producing LPs — `defineLandingPage()` (data-driven)

Composition — section order, background rhythm, CTA placement and labels — is
decided by patterns backed by field research of Japanese B2B SaaS sites.
You provide the content; missing required slots fail at the type level.

```tsx
import { defineLandingPage, LandingPage } from '@siracusahq/gtm-design-system';

<LandingPage {...defineLandingPage({
  pattern: 'product',            // product / product-portfolio-top / lead-gen / corporate-top / case-study-list
  brand: 'polastack',            // corporate / polastack / peerdesk / peerdesk-taxpeer
  hero: { title: '…', subtitle: '…', offers: [/* 1–2 offers, reused for the band and closing */] },
  features: { title: '…', features: [/* … */] },
  closing: { title: '…' },
})} />
```

#### (b) One-off pages — `<Page>` (composition)

Arrange sections freely; background/spacing rhythm is automatic. Dev-time
warnings fire on three consecutive dark surfaces or a third distinct primary
CTA label.

```tsx
<Page brand="corporate" tone="trust">
  <HeroSection … />
  <ModuleOverview … />
  <CTASection … />
</Page>
```

`tone` expresses the page's intent (`trust` = spacious / `product` = baseline /
`campaign` = dense, acquisition-oriented) and is orthogonal to `brand`.

### Using with AI agents

The package ships its own guidance files. After installing, point your agent at
the two files inside `node_modules`.

| File                                                       | Contents                                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `node_modules/@siracusahq/gtm-design-system/AGENTS.md`     | Entry point: one-line setup, vocabulary (4 brands / 3 tones / 5 page types), the two ways to compose |
| `node_modules/@siracusahq/gtm-design-system/GUIDELINES.md` | The Do's & Don'ts of record. Every rule carries its field-research basis (written in Japanese) |

Minimal prompt:

```text
Read node_modules/@siracusahq/gtm-design-system/AGENTS.md first, then build a
product landing page with @siracusahq/gtm-design-system.
When in doubt, consult GUIDELINES.md in the same directory.
```

Composition is decided by the patterns, so the agent's job is filling slots.
Deviations are stopped by type errors and dev-time warnings (see GUIDELINES.md §6).

### Analytics hooks

**No analytics tags (GA4 / GTM / …) are bundled.** Picking a vendor is the
consumer's call. This package only exposes the hooks; where the events go is
entirely up to you.

#### CTA clicks

CTAs carry an automatic `data-cta` attribute, and `onCTAClick` receives every
click on the page. Sections assign the ids, so callers never name them
(header `header-${i}` / hero `hero-${i}` / mid-page band `cta-band-${i}` /
pricing `pricing-${i}` / closing `closing-${i}` / form submit `form-submit`).

```tsx
<LandingPage
  {...defineLandingPage({ /* … */ })}
  onCTAClick={({ id, label, href }) => analytics.track('cta_click', { id, label, href })}
/>

// Same on one-off pages
<Page brand="corporate" onCTAClick={(cta) => analytics.track('cta_click', cta)}>…</Page>

// Buttons you place yourself declare their own id
<MarketingButton ctaId="sidebar-trial" href="/trial">Start free</MarketingButton>
```

#### Form submissions

Passing `onResult` switches submission to `fetch` (AJAX), so you get
success/failure without a page transition (URL-encoded, `form-name` included,
posted to `action ?? location.pathname` — matching the Netlify Forms AJAX spec).

```tsx
<ResourceRequestForm
  title="Download the resource"
  resourceName="polastack-overview"
  onResult={({ ok, status, error }) => (ok ? showThanks() : showError(status ?? error))}
/>
```

**A native POST (no `onResult`) cannot emit a submission event** — the browser
navigates away, so JS never observes the outcome. Precedence:
`onSubmit` (fully manual) > `onResult` (AJAX) > native POST.

### Components

#### Primitives (19)

Container, Section, Grid, Heading, Text, Eyebrow, MarketingButton, SelectField, Logo, LogoMark, MediaFrame, ProductShot, Avatar, GradientText, Divider, Link, Badge, AnimatedCounter, AnimateOnScroll

#### Sections (16)

HeroSection, FeatureGrid, FeatureShowcase, PricingTable, PricingCard, CTASection, CTABand, FAQSection, ComparisonTable, TestimonialSection, LogoCloud, StatsSection, CodeBlock, ServicePortfolio, CaseStudySection, CaseStudyListSection

#### Corporate site sub-pages (5)

Prose, legal documents and company information — a different surface from the landing-page sections.

ProseSection (prose: mission, CEO message), DocumentArticle (legal document and 404 shell), CompanyProfileSection, LeadershipSection, HistorySection

`DocumentArticle` **does not bundle a Markdown parser**. Pass already-converted HTML as `children`; the design system owns only the typesetting (heading hierarchy, tables, lists, quotes).

**News and blog listings/articles are not covered here** — they belong to the `article-list` / `article-detail` page types (see `docs/article-pages-workorder.md`).

#### Forms (Netlify Forms ready)

ContactForm, ResourceRequestForm, DemoRequestForm (+ FormInput / FormTextarea / FormSelect / FormCheckbox / FormButton)

Fields can be extended with `inquiryTypes`, `phone`, `consent`, and arbitrary `extraFields`. **What is open is the set of fields, not the styling** — `extraFields` takes data only, and rendering is fixed to the design system's own form parts.

The external autofill service (`ichisanEnabled`) is **off by default**; enabling it loads a third-party script.

#### Product-specific + Japan market (4)

ModuleOverview, MigrationComparison, AirPocketFeature, SecurityBadges

#### Layout / Page (4)

MarketingHeader, MarketingFooter, PageLayout, Page

#### Hooks (1)

useInView

### Slide Components (27 layouts)

Available via `@siracusahq/gtm-design-system/slides`. Spectacle-based layouts for sales decks and presentations.

```tsx
import { SlideDeck, TitleSlide, ComparisonSlide } from '@siracusahq/gtm-design-system/slides';

const MyDeck = () => (
  <SlideDeck dark>
    <TitleSlide title="Polastack" badge="Enterprise Agent Stack" />
    <ComparisonSlide
      title="How we differ"
      leftHeader="Before"
      rightHeader="Polastack"
      leftItems={['Auth: 3 weeks']}
      rightItems={['Auth: 0 lines']}
    />
  </SlideDeck>
);
```

| Category             | Layouts                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Structure (5)**    | TitleSlide, AgendaSlide, SectionDividerSlide, EndSlide, TeamSlide                                     |
| **Content (7)**      | ContentSlide, SplitSlide, BulletSlide, ComparisonSlide, ThreeColumnSlide, PricingSlide, TableSlide    |
| **Visual (5)**       | ImageSlide, ImageTextSlide, FlowSlide, DiagramSlide, IconGridSlide                                    |
| **Data (5)**         | StatSlide, TimelineSlide, ChartSlide, MetricHighlightSlide, BeforeAfterMetricSlide                    |
| **Social Proof (4)** | QuoteSlide, LogoGridSlide, CaseStudySlide, AwardSlide                                                 |
| **Japan market (5)** | SecurityComplianceSlide, SupportStructureSlide, ImplementationPlanSlide, ROICalculationSlide, QASlide |

### Tech Stack

- **React** 18/19
- **CSS Modules** + theme contract (CSS variable slots; no Tailwind required on the consumer side)
- **TypeScript** (strict mode)
- **CVA** (class-variance-authority) for variant management
- **Spectacle** 10 for slide components
- **Storybook** 8 for documentation
- **Vitest** + Testing Library + axe-core for testing
- **tsup** for ESM builds

### Development

```bash
pnpm install      # Install dependencies
pnpm storybook    # Start Storybook
pnpm build        # Build
pnpm test         # Run tests
pnpm typecheck    # Type check
```

### Storybook Features

- **Theme toggle**: Light / Dark mode switching
- **Locale toggle**: Japanese / English switching
- **A11y addon**: Accessibility audit panel
- **Slide preview**: Arrow keys / click navigation

### Project Structure

```
src/
├── tokens/          # Design tokens
├── styles/          # Global CSS (@theme)
├── lib/             # Utilities (cn)
├── hooks/           # Custom hooks (useInView)
├── components/
│   ├── primitives/  # Container, Heading, Button, AnimateOnScroll, etc.
│   ├── sections/    # Hero, Feature, Pricing, CTA, FAQ, SecurityBadges, etc.
│   ├── layout/      # Header, Footer, PageLayout
│   └── slides/      # Spectacle-based slide layouts (27 types)
├── stories/         # Storybook stories
└── test/            # Test setup
```

---

## License

MIT
