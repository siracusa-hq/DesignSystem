# Polastack GTM Design System 構築計画

## Phase 0: プロジェクト初期化

- [x] package.json 作成（@siracusahq/gtm-design-system）
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
- [x] 別エントリポイント `@siracusahq/gtm-design-system/slides` として公開
- [x] Storybook ストーリー（Polastack Sales Pitch Deck サンプル + レイアウト一覧）

## Phase 10: 暫定対応（公開中バージョンの応急処置）

- [x] README に `@source` の設定手順を明記（0.2.0 は素直に導入すると無スタイル）
- [x] README に Web フォント読み込み手順を明記（現在は配布物に含まれていない）

---

# 再設計フェーズ（Stage 1 以降）

**設計の根拠と判断理由は [composition-redesign.md](./composition-redesign.md) を正とする。**
このパッケージを「コンポーネントの詰め合わせ」から
「AIエージェントが高品質なLPを高速に生成できる装置」へ作り替える。

**旧 Phase 11〜16（層0〜層6）は Stage 1〜6 に組み替えた。**
2026-08-02 の3調査（LP アナトミー / マルチブランド / ビジュアル言語）で
複数の設計仮説が反証されたため、層の切り方そのものを変えている。
主な変更点:

- マルチブランド体系（コーポレート / Polastack / ピアデスクシリーズ）を Stage 1 に追加
- ビジュアル資産（画像実装がゼロ）を Stage 2 に追加
- 旧 層1・層2・層4 を Stage 2 に統合（**同じファイルを3回書き換えないため**）
- ページ型を4種から**5種**へ（`product-portfolio-top` を新設）
- リード獲得（計測・追従CTA・2オファー・フォーム）を Stage 4 として独立させた

**リリース**: Stage 1〜3 をまとめて `0.4.0` で一括リリース（破壊的変更）。
Stage 4 以降は minor で刻む。

---

## Stage 1: テーマ契約とトークン

### マルチブランドのテーマ契約

- [x] `theme-contract-spec.md` を起こす（スロット名一覧 / ランプ段数と刻み /
      `data-brand` の適用範囲 / ダークモードとの掛け合わせ / codegen の入出力）
- [x] 3層構造の実装: 骨格トークン → ブランドランプ → 抽象スロット
- [x] `data-brand` 属性によるブランド切替
- [x] シリーズ既定 + 製品上書きの仕組み（ピアデスク配下に製品が増える前提）
- [x] ブランドレジストリ（ブランド名 → 色相の対応表を1箇所に）
- [x] 色相からランプ全段を生成する生成器（OKLCH の L・C を固定して H だけ回す）

### 色の役割

- [x] 操作色 / 装飾色を「同一ランプの2つの段」に一般化
      （操作 = L≈0.553・白文字AA保証 / 装飾 = L≈0.73・明背景テキスト禁止）
- [x] 第3のオプション役割 `--color-cta-*`（未指定なら操作色にフォールバック）
- [x] `tokens.test.ts` に「操作段の白文字コントラストが 4.5:1 以上」の検証を追加
- [x] `tokens.test.ts` に「ランプ位置の統一」「ランプ名とブランド名の一致」の検証を追加

### 和文タイポグラフィ

- [ ] 見出しの行間 1.3〜1.4 / 本文の行間 1.6〜1.75 でスケールを定義
- [x] 負の字送りを全廃（`tracking-[-0.04em]` / line-height 1.11 を撤去）
- [ ] 見出しの字送りを 0〜+.05em の範囲に
- [ ] ウェイト補正型の字送り（Regular +.04em / Bold +.03em）
- [x] `palt` を見出しとラベルのみに適用（本文には付けない）
- [x] `line-break: strict` / `text-spacing-trim: space-all` を導入
- [ ] 本文 14px 未満を出せないようスケールから除外
- [x] 見出しに `text-wrap: balance`（国内先行例ゼロ。Stage 5 のVRTで検証する）

### 既存バグの修正

- [x] `:lang(ja) h1,h2,h3` の `font-feature-settings` が body の
      `'cv01','cv03','cv04','tnum'` を丸ごと上書きしている問題を修正
      （和文見出しで等幅数字が失われる。数値訴求は必須要素）
- [x] デッドコード `.lang-ja` / `.lang-en` を削除（使用0件）

### 意匠

- [x] `radii` を役割名化（`--radius-card` / `-pill` / `-media` / `-section`）
- [x] `shadow` を2層に（UI操作用の小さい影 / LPの浮いたカード用の柔らかい影）
- [x] `motion` を二系統に（UI応答 100–300ms / 演出 400–900ms）
- [x] `AnimateOnScroll` のハードコード（600ms / ease-out）を演出系トークンへ戻す
- [ ] `packages/tokens` から降ろすトークンの整理（正本の移動）

## Stage 2: 全コンポーネント1周

**縦切りで進める。** プリミティブ → 実ページ用5〜6セクション → 実ページ検証 → 残り。
各コンポーネントは**1回だけ触る**（props削除・CSS Modules化・ビジュアル資産対応を同時に）。

### 2-1. 基盤（先に用意する）

- [ ] トークン → CSS変数の codegen（値の二重管理を構造的に解消 + ブランドランプ生成）
- [ ] `*.module.css.d.ts` の生成を typecheck に組み込む（**必須**）
- [ ] stylelint で `var()` を既知トークンに制限
- [ ] stylelint で hex リテラルの直書きを禁止
- [ ] Web フォントを `@font-face` として配布CSSに同梱
- [ ] `pnpm size` に CSS サイズの枠を追加

### 2-2. プリミティブ

- [ ] Container / Section / Grid / Heading / Text
- [ ] `Eyebrow` を新設（`Text` の overline 系7バリアントを切り出し、トーン連動に）
- [ ] MarketingButton（`kicker` スロット追加 / `data-cta` 出力）
- [ ] `MediaFrame` を新設（固定アスペクト比・`alt` 必須・角丸/影はトークン）
- [ ] `ProductShot` を新設（**正対のみ。傾き・パースは実装しない**）
- [ ] `LogoMark` を新設（光学サイズ正規化 / グレースケール化を切替可能に）
- [ ] `Avatar` を新設（円形マスク・固定サイズ）
- [ ] 画像未指定時のプレースホルダ機構

### 2-3. 実ページ用セクション（5〜6本を先に完成させる）

- [ ] HeroSection（`titleGradient` / `backgroundPattern` / `layout` 削除、
      `imagePlacement` へ統合、`offers` 化）
- [ ] LogoCloud（`scrolling` 削除・件数から導出、`LogoMark` 適用）
- [ ] FeatureGrid（`cardStyle` / `columns` 削除）
- [ ] StatsSection（`animated` 削除、**4スロット化 + `asOf` 必須**）
- [ ] CTASection（`backgroundMesh` / `logoStrip` 削除、`kicker` / `offers` 追加）
- [ ] FormSection（`onSubmit` を第一級に。Formspree は既定実装へ降格）
- [ ] **上記だけで実ページを1本組んで検証する**（契約の穴をここで出す）

### 2-4. 残りのセクション

- [ ] 全セクションから `background` / `spacing` / `eyebrowStyle` を削除
- [ ] CodeBlock（`alignment` / `layout` 削除）
- [ ] BentoGrid（`BentoItem.variant` 削除、位置で自動決定）
- [ ] CaseStudySection / TestimonialSection（`columns` 削除）
- [ ] PricingCard ほか（`actions[].variant` を自動割当に）
- [ ] SecurityBadges を**3系統**に（認証 / 第三者レビュー受賞 / 法定表示）
- [ ] `ContentHub` を新設（資料・セミナー・コラム回遊。製品系12ページ中9ページが保有）
- [ ] 全コンポーネントを Tailwind クラスから CSS Modules へ移行

## Stage 3: ページ層

- [ ] `<Page brand tone>` コンポジションAPI
- [ ] `defineLandingPage()` データ駆動API
- [ ] ページ型5種: `lead-gen` / `product` / **`product-portfolio-top`（新設）** /
      `case-study-list` / `corporate-top`
- [ ] 既定セクション順序の実装（**料金 → 事例**。FAQ は任意）
- [ ] トーン（`trust` / `product` / `campaign`）の定義。**ブランド軸と直交させる**
- [ ] ページコンテナによる背景・余白の割当
- [ ] **CTAラベルの種類数を2種に制約**（反復は自由。回数は数えない）
- [ ] `CTABand`（繰り返し置ける部品）

**作らないもの**: `case-study-detail`（個別事例記事）。
調査で1本も取得できておらず構成のデータが無い。推測で型を作らない。

**ここまでで `0.4.0` を一括リリース（破壊的変更）。**

## Stage 4: リード獲得

- [ ] 全CTAに `data-cta` 属性を出力
- [ ] `<Page onCTAClick>` でページ単位に一括受信
- [ ] フォームの `onSubmit` / 成功 / 失敗をイベント化
- [ ] `StickyHeaderCTA`（固定ヘッダー内2CTA。**モバイルで各45vw / 高さ40px**、z-index 2）
- [ ] `FloatingCornerCTA`（右下カード 380×240、`bottom:30px right:30px`、z-index 5、
      **閉じるボタン必須**）
- [ ] 2オファー設計（`offers: [Offer, Offer]`。軽/重を焼き込まない）
- [ ] ページ型ごとのオファー既定値
- [ ] フォームを用途別に分ける設計（問い合わせ / 見積もり / トライアル）

**作らないもの**: 全幅の下部固定CTAバー。19ページの実測で確認できたのは0件。

## Stage 5: 守り

- [ ] Playwright によるページ単位のビジュアルリグレッションをCIに追加
- [ ] **背景リズムの自基準をVRTのスナップショットとして確定させる**
      （他社実態は未検証。ここで自分たちで決める）
- [ ] 和文の最悪ケース（長い / 短い / 英語）をページストーリーとして固定
      （`text-wrap: balance` の効果もここで確認）
- [ ] dev ビルドの警告:
  - [ ] `h1` が2つ以上
  - [ ] プライマリCTAの**ラベル種類**が3種類以上（回数は数えない）
  - [ ] FVのCTAが3本以上
  - [ ] 暗いセクションが3連続
  - [ ] `StatBadge` に `asOf` が無い（景品表示法）
  - [ ] 社会的証明スロットが空（ロゴ帯も数値バッジも無い）
  - [ ] ロゴが1〜5社（日本語ページに実例0件。事例カードへの紐付けを促す）
- [ ] 消費側（Astro）からの結合テストをCIに追加

**撤回した警告**: 「LogoCloud のロゴが6社未満」。
ロゴ帯と数値バッジは代替関係で、0社は 6/19（32%）ある正当な選択。
「1ビューポート内にプライマリCTAが2つ以上」も撤回（総CTA中央値15〜16本）。

## Stage 6: AI向け規範ファイル

- [ ] 機械可読のルールファイルを作成し、配布物（`files`）に同梱
- [ ] 内容は「ブランド3 / トーン3 / ページ型5 / import 1行」に収める
      （APIで表現できるルールを文章で書かない）

---

## 未決着の再調査項目

実装をブロックはしないが、判断の裏付けが弱い箇所。
詳細は [composition-redesign.md](./composition-redesign.md) 末尾。

- [ ] 背景の明暗リズム（スクリーンショット未取得。Stage 5 で自基準を作るため保留可）
- [ ] モバイル下部固定CTAの実在（レンダリング後DOMの取得が必要）
- [ ] 導入ロゴのグレースケール化（`LogoMark` の既定値に影響する）
- [ ] フォームの項目数（実測できたのは1件のみ）
- [ ] `case-study-detail` の構成（1本も取得できていない）
- [ ] 開発者向けインフラ／API系企業のビジュアル言語
      （Polastack のヒーローに図解・コードを置く判断の裏付けが、
      現状は「調査した8社は非技術者向けだった」という消去法のみ）
