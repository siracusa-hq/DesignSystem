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

---

# 再設計フェーズ（Phase 10 以降）

**設計の根拠と判断理由は [composition-redesign.md](./composition-redesign.md) を正とする。**
このパッケージを「コンポーネントの詰め合わせ」から
「AIエージェントが高品質なLPを高速に生成できる装置」へ作り替える。

## Phase 10: 暫定対応（公開中バージョンの応急処置）

- [x] README に `@source` の設定手順を明記（0.2.0 は素直に導入すると無スタイル）
- [x] README に Web フォント読み込み手順を明記（現在は配布物に含まれていない）

## Phase 11: 層0 — 意匠の決定

- [ ] `radii` を ui-web 固有スケールへ（大きめ・pill 寄り）
- [ ] `shadows` に soft-large 系を追加（LP のカード用）
- [ ] `motion` を ui-web 固有スケールへ（400–900ms / expo 系イージング）
- [ ] `AnimateOnScroll` のハードコード（600ms / ease-out）をトークン参照に戻す
- [ ] 和文向け tracking・line-height スケールの定義
- [ ] `packages/tokens` から降ろすトークンの整理（正本の移動）

## Phase 12: 層1・層2 — props 棚卸しとリズム

- [ ] 全セクションから `background` / `spacing` / `eyebrowStyle` を削除
- [ ] `Text` の overline 系7バリアントを `Eyebrow` コンポーネントへ切り出し
- [ ] 個別 props の削除（`titleGradient` / `backgroundPattern` / `cardStyle` /
      `alignment` / `backgroundMesh` / `animated` / `scrolling` / `logoStrip` ほか）
- [ ] `columns` を件数からの自動導出に置き換え
- [ ] `BentoItem.variant`（`default` / `featured` / `dark`）を削除し、位置で自動決定する
- [ ] `actions[].variant` を自動割当に置き換え（1つ目 primary / 以降 secondary）
- [ ] `HeroSection` の `layout` を `imagePlacement` に統合
- [ ] トーン（`trust` / `product` / `campaign`）の定義
- [ ] ページコンテナによる背景・余白・CTA のリズム割当

## Phase 13: 層4 — CSS Modules 移行

- [ ] トークン → CSS変数の codegen（値の二重管理を構造的に解消）
- [ ] `*.module.css.d.ts` の生成を typecheck に組み込む（**必須**）
- [ ] stylelint で `var()` を既知トークンに制限
- [ ] 全コンポーネントを Tailwind クラスから CSS Modules へ移行
- [ ] Web フォントを `@font-face` として配布CSSに同梱
- [ ] `pnpm size` に CSS サイズの枠を追加

## Phase 14: 層3 — ページAPI

- [ ] `<Page tone>` コンポジションAPI（コーポレート／サービスサイト向け）
- [ ] `defineLandingPage()` データ駆動API（LP量産向け）
- [ ] ページパターン: `lead-gen` / `product` / `case-study` / `corporate-top`

## Phase 15: 層5 — うるさく壊す仕組み

- [ ] Playwright によるページ単位のビジュアルリグレッションをCIに追加
- [ ] 和文の最悪ケース（長い／短い／英語）をページストーリーとして固定
- [ ] dev ビルドの警告（h1重複 / プライマリCTA過多 / ロゴ6社未満 / 暗面3連続）
- [ ] 消費側（Astro）からの結合テストをCIに追加

## Phase 16: 層6 — AI向け規範ファイル

- [ ] 機械可読のルールファイルを作成し、配布物（`files`）に同梱
