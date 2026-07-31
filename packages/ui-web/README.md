# @polastack/gtm-design-system

> [日本語](#日本語) | [English](#english)

---

## 日本語

[Polastack](https://github.com/tkaneko-siracusa) のマーケティングコミュニケーション向けデザインシステムです。Webサイト、ランディングページ、営業資料、講演資料のための統一されたコンポーネントとデザイントークンを提供します。

> **注意:** 本パッケージは**マーケティング用 GTM デザインシステム**です。プロダクトUI用のデザインシステムは [@polastack/design-system](https://github.com/tkaneko-siracusa/DesignSystem) を参照してください。

### Storybook

https://tkaneko-siracusa.github.io/GTM_DesignSystem/

### インストール

```bash
pnpm add @polastack/gtm-design-system

# スライドコンポーネントを使用する場合
pnpm add spectacle

# シンタックスハイライトを有効にする場合
pnpm add shiki
```

### 使い方

```tsx
// コンポーネントのインポート
import { HeroSection, FeatureGrid, MarketingButton } from '@polastack/gtm-design-system';

// トークンのインポート
import { colors, gradients, fontSize } from '@polastack/gtm-design-system/tokens';

// スライドコンポーネントのインポート
import { SlideDeck, TitleSlide, StatSlide } from '@polastack/gtm-design-system/slides';

// グローバルスタイルの読み込み（アプリのエントリポイントで）
import '@polastack/gtm-design-system/globals.css';
```

### デザイントークン

`@polastack/design-system` と共通のブランドアイデンティティを継承しつつ、マーケティング向けに拡張しています。

| トークン | 説明 |
|---|---|
| **Colors** | ブランドティール `#13c3a0` + ニュートラル（neutral-850含む） + セマンティック |
| **Typography** | Display 72px 〜 Caption 12px（基準 16px）、サイズ別letter-spacing最適化 |
| **Spacing** | セクション間余白 80–160px、コンテナ幅 640–1280px |
| **Gradients** | ブランドグラデーション、グロー効果、テキストグラデーション |
| **Elevation** | シャドウ + プライマリグロー |
| **Animation** | フェードイン、スライド、スケール、ブラーイン + スクロール連動 |
| **Breakpoints** | モバイル / タブレット / デスクトップ / ワイド |

#### プロダクトUI用DSとのタイポグラフィ比較

| | プロダクトUI (`@polastack/design-system`) | GTM（本パッケージ） |
|---|---|---|
| 基準サイズ | 14px | 16px |
| 最大サイズ | 24px | 72px (display-2xl) |
| Display系 | なし | 30 / 36 / 48 / 60 / 72px |

### コンポーネント一覧

#### プリミティブ（13）
Container, Section, Grid, Heading, Text, MarketingButton, Logo, GradientText, Divider, Link, Badge, AnimatedCounter, AnimateOnScroll

#### セクション — Tier 1（6）
HeroSection, FeatureGrid, PricingTable, PricingCard, CTASection, FAQSection

#### セクション — Tier 2（7）
FeatureShowcase, ComparisonTable, TestimonialSection, LogoCloud, StatsSection, BentoGrid, CodeBlock

#### プロダクト固有 + 日本市場向け（5）
ModuleOverview, MigrationComparison, AirPocketFeature, SecurityBadges, CaseStudySection

#### レイアウト（3）
MarketingHeader, MarketingFooter, PageLayout

#### フック（1）
useInView

### スライドコンポーネント（27レイアウト）

`@polastack/gtm-design-system/slides` サブパスで提供。Spectacleベースの営業資料・講演資料用スライドレイアウト。

```tsx
import { SlideDeck, TitleSlide, ComparisonSlide } from '@polastack/gtm-design-system/slides';

const MyDeck = () => (
  <SlideDeck dark>
    <TitleSlide title="Polastack" badge="Enterprise Agent Stack" />
    <ComparisonSlide
      title="従来との違い"
      leftHeader="従来" rightHeader="Polastack"
      leftItems={['認証実装3週間']} rightItems={['認証コード0行']}
    />
  </SlideDeck>
);
```

| カテゴリ | レイアウト |
|---|---|
| **Structure（5）** | TitleSlide, AgendaSlide, SectionDividerSlide, EndSlide, TeamSlide |
| **Content（7）** | ContentSlide, SplitSlide, BulletSlide, ComparisonSlide, ThreeColumnSlide, PricingSlide, TableSlide |
| **Visual（5）** | ImageSlide, ImageTextSlide, FlowSlide, DiagramSlide, IconGridSlide |
| **Data（5）** | StatSlide, TimelineSlide, ChartSlide, MetricHighlightSlide, BeforeAfterMetricSlide |
| **Social Proof（4）** | QuoteSlide, LogoGridSlide, CaseStudySlide, AwardSlide |
| **日本市場向け（5）** | SecurityComplianceSlide, SupportStructureSlide, ImplementationPlanSlide, ROICalculationSlide, QASlide |

### 技術スタック

- **React** 18/19
- **Tailwind CSS** v4（`@theme` ディレクティブ）
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

Marketing design system for [Polastack](https://github.com/tkaneko-siracusa) — components and design tokens for websites, landing pages, and sales materials.

> **Note:** This is the **GTM (Go-To-Market) Design System** for marketing use. For the product UI design system, see [@polastack/design-system](https://github.com/tkaneko-siracusa/DesignSystem).

### Storybook

https://tkaneko-siracusa.github.io/GTM_DesignSystem/

### Install

```bash
pnpm add @polastack/gtm-design-system

# For slide components
pnpm add spectacle

# For syntax highlighting
pnpm add shiki
```

### Usage

```tsx
// Import components
import { HeroSection, FeatureGrid, MarketingButton } from '@polastack/gtm-design-system';

// Import tokens
import { colors, gradients, fontSize } from '@polastack/gtm-design-system/tokens';

// Import slide components
import { SlideDeck, TitleSlide, StatSlide } from '@polastack/gtm-design-system/slides';

// Import global styles (in your app entry point)
import '@polastack/gtm-design-system/globals.css';
```

### Design Tokens

Shared brand identity with `@polastack/design-system`, extended for marketing:

| Token | Description |
|---|---|
| **Colors** | Brand teal `#13c3a0` + neutral (incl. neutral-850) + semantic |
| **Typography** | Display 72px to Caption 12px (base 16px), size-specific letter-spacing |
| **Spacing** | Section spacing 80–160px, container widths 640–1280px |
| **Gradients** | Brand gradients, glow effects, text gradients |
| **Elevation** | Shadows + primary glow effects |
| **Animation** | Fade-in, slide, scale, blur-in + scroll-triggered |
| **Breakpoints** | Mobile / Tablet / Desktop / Wide |

#### Typography comparison with Product UI

| | Product UI (`@polastack/design-system`) | GTM (this package) |
|---|---|---|
| Base size | 14px | 16px |
| Max size | 24px | 72px (display-2xl) |
| Display sizes | — | 30 / 36 / 48 / 60 / 72px |

### Components

#### Primitives (13)
Container, Section, Grid, Heading, Text, MarketingButton, Logo, GradientText, Divider, Link, Badge, AnimatedCounter, AnimateOnScroll

#### Sections — Tier 1 (6)
HeroSection, FeatureGrid, PricingTable, PricingCard, CTASection, FAQSection

#### Sections — Tier 2 (7)
FeatureShowcase, ComparisonTable, TestimonialSection, LogoCloud, StatsSection, BentoGrid, CodeBlock

#### Product-specific + Japan market (5)
ModuleOverview, MigrationComparison, AirPocketFeature, SecurityBadges, CaseStudySection

#### Layout (3)
MarketingHeader, MarketingFooter, PageLayout

#### Hooks (1)
useInView

### Slide Components (27 layouts)

Available via `@polastack/gtm-design-system/slides`. Spectacle-based layouts for sales decks and presentations.

```tsx
import { SlideDeck, TitleSlide, ComparisonSlide } from '@polastack/gtm-design-system/slides';

const MyDeck = () => (
  <SlideDeck dark>
    <TitleSlide title="Polastack" badge="Enterprise Agent Stack" />
    <ComparisonSlide
      title="How we differ"
      leftHeader="Before" rightHeader="Polastack"
      leftItems={['Auth: 3 weeks']} rightItems={['Auth: 0 lines']}
    />
  </SlideDeck>
);
```

| Category | Layouts |
|---|---|
| **Structure (5)** | TitleSlide, AgendaSlide, SectionDividerSlide, EndSlide, TeamSlide |
| **Content (7)** | ContentSlide, SplitSlide, BulletSlide, ComparisonSlide, ThreeColumnSlide, PricingSlide, TableSlide |
| **Visual (5)** | ImageSlide, ImageTextSlide, FlowSlide, DiagramSlide, IconGridSlide |
| **Data (5)** | StatSlide, TimelineSlide, ChartSlide, MetricHighlightSlide, BeforeAfterMetricSlide |
| **Social Proof (4)** | QuoteSlide, LogoGridSlide, CaseStudySlide, AwardSlide |
| **Japan market (5)** | SecurityComplianceSlide, SupportStructureSlide, ImplementationPlanSlide, ROICalculationSlide, QASlide |

### Tech Stack

- **React** 18/19
- **Tailwind CSS** v4 (`@theme` directive)
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
