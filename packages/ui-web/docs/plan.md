# Polastack GTM Design System 構築計画

## Phase 0: プロジェクト初期化

- [x] package.json 作成（@polastack/gtm-design-system）
- [x] tsconfig.json / tsup.config.ts / vitest.config.ts 作成
- [x] .storybook/ 設定（main.ts / preview.ts / preview-head.html）
- [x] .github/workflows/ CI・Release 設定
- [x] src/lib/cn.ts ユーティリティ
- [x] src/test/setup.ts テストセットアップ
- [x] src/styles/globals.css デザイントークン CSS
- [x] src/index.ts / src/tokens/index.ts エントリポイント
- [x] CLAUDE.md バイリンガルルール追記
- [x] .gitignore / .npmignore / .prettierrc / .size-limit.json
- [x] pnpm install → ビルド・テスト確認

## Phase 1: デザイントークン

- [x] src/tokens/colors.ts
- [x] src/tokens/typography.ts
- [x] src/tokens/spacing.ts
- [x] src/tokens/gradients.ts
- [x] src/tokens/elevation.ts
- [x] src/tokens/animation.ts
- [x] src/tokens/breakpoints.ts
- [x] Storybook トークンカタログストーリー

## Phase 2: プリミティブコンポーネント

- [x] Container / Section / Grid
- [x] Heading / Text
- [x] MarketingButton
- [x] Logo
- [x] GradientText / Divider
- [x] Link / Badge
- [x] AnimatedCounter

## Phase 3: セクションコンポーネント Tier 1

- [x] HeroSection
- [x] FeatureGrid
- [x] PricingTable / PricingCard
- [x] CTASection
- [x] FAQSection

## Phase 4: レイアウトコンポーネント

- [x] MarketingHeader
- [x] MarketingFooter
- [x] PageLayout

## Phase 5: セクションコンポーネント Tier 2

- [x] FeatureShowcase
- [x] ComparisonTable
- [x] TestimonialSection
- [x] LogoCloud
- [x] StatsSection
- [x] BentoGrid
- [x] CodeBlock

## Phase 6: プロダクト固有 + テンプレート

- [x] ModuleOverview
- [x] MigrationComparison
- [x] AirPocketFeature
- [x] LP構成例（Storybook examples）

## Phase 7: 品質仕上げ

- [x] axe-core a11y テスト全コンポーネント
- [x] キーボードナビゲーション検証
- [x] バンドルサイズ最適化
- [x] README.md（日英併記）

## Phase 8: UX/UI 品質改善

### Critical
- [x] AnimateOnScroll + useInView（スクロール連動アニメーション）
- [x] HeroSection 背景パターン（grid/dots/mesh/radial-glow）
- [x] MarketingButton マイクロインタラクション（hover lift, rightIcon, gradient shift）
- [x] CodeBlock シンタックスハイライト（shiki）
- [x] カードホバーインタラクション統一（FeatureGrid/BentoGrid/Testimonial/Pricing）

### High
- [x] タイポグラフィ letter-spacing 最適化（display系サイズ別tracking）
- [x] ダークモード サーフェス階層強化（neutral-850追加）
- [x] 比較表 UX改善（sticky header/列、SVGアイコン化）
- [x] CTAセクション訴求力強化（backgroundMesh, socialProof, logoStrip）
- [x] LogoCloud スクロールアニメーション修正（3倍複製, hover pause, フェードエッジ拡大）
- [x] StatsSection AnimatedCounter 適用
- [x] テスティモニアル引用デザイン強化（装飾引用符, rating, companyLogo）
- [x] チェックマーク表現統一（✓/— → lucide-react SVGアイコン）

### Medium
- [x] 日本語 word-break 修正（break-all → overflow-wrap: anywhere）
- [x] FAQ アコーディオン滑らかさ改善（opacity アニメーション追加）
- [x] BentoGrid 視覚的バリエーション（default/featured/dark）
- [x] グラデーションボーダーユーティリティ（.gradient-border）
- [x] Header ドロップダウンナビ対応
- [x] SecurityBadges セクション（日本市場向け認証バッジ）
- [x] CaseStudySection セクション（日本市場向けケーススタディ）

## Phase 9: Sales Kit スライドコンポーネント

- [x] Spectacle 導入（peerDependencyとして管理）
- [x] Polastack テーマ定義（polastackTheme / polastackDarkTheme）
- [x] SlideDeck — テーマ適用済み Deck ラッパー
- [x] TitleSlide — 表紙・区切りスライド
- [x] ContentSlide — 見出し + 自由コンテンツ
- [x] SplitSlide — 左右2カラム
- [x] StatSlide — インパクト数値表示
- [x] QuoteSlide — テスティモニアル引用
- [x] 別エントリポイント `@polastack/gtm-design-system/slides` として公開
- [x] Storybook ストーリー（Polastack Sales Pitch Deck サンプル + レイアウト一覧）
