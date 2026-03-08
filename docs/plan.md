# Polastack Design System - 実装プラン

> Polastackヘッドレスプラットフォーム上の業務アプリ開発を
> 「品質高く」「早く」「ブランド統一して」行うためのデザインシステム。

---

## 目的

| 目的 | 実現方法 | 主担当フェーズ |
|------|---------|--------------|
| **品質を高く保つ** | テスト・a11yを初日から組込み、全コンポーネントに品質ゲート適用 | Phase 0, 2, 8 |
| **早く開発する** | ドメイン別コンポーネント群で即座に画面構築可能 + 採用支援 | Phase 4, 5, 7 |
| **ブランディング** | 戦略的なデザイン原則・トークン定義 + アプリ骨格の統一 | Phase 1, 6 |
| **PWA対応** | タッチ最適化・Safe Area・オフライン対応でネイティブ品質のPWA | Phase 3 |

---

## BtoB業務システム デザインシステム事例調査

### 主要事例

| デザインシステム | 提供元 | 特徴 |
|----------------|--------|------|
| **Atlassian Design System** | Atlassian | デザイントークン中心、Atomic Design、4pxグリッド、WCAG AA |
| **Carbon Design System** | IBM | エンタープライズ向け、React/Web Components両対応 |
| **Ant Design** | Ant Group | アジア圏最普及、ProComponentsで業務向け高機能コンポーネント群 |
| **Lightning Design System** | Salesforce | CRM/業務アプリ特化、マルチテナント対応 |
| **Polaris** | Shopify | 2025年Web Components化、フレームワーク非依存 |
| **Pajamas** | GitLab | AI対応パターン拡充、ブランド個性の視覚的表現強化 |
| **shadcn/ui** | コミュニティ | Radix UI + Tailwind CSS、コード所有型、カスタマイズ性最高 |

### 2024-2025年のトレンド

1. **デザイントークンのファーストクラス化** - 全プラットフォーム一貫性の主要メカニズム
2. **ヘッドレス/コンポーザブル設計** - 未スタイルプリミティブ + Tailwind CSSが主流
3. **コード所有モデル** - shadcn/ui型のコピー＆カスタマイズ方式の台頭
4. **AI対応** - AIがデザインシステムルールを理解しコード生成に活用
5. **アクセシビリティの標準化** - WCAG 2.1 AA準拠が最低基準として定着

### 技術選定

shadcn/ui型アプローチを採用：

| レイヤー | 技術 | 理由 |
|---------|------|------|
| コンポーネント基盤 | **React 18/19** | エコシステム、RSC対応 |
| スタイリング | **Tailwind CSS v4** | ゼロランタイム、@themeでトークン統合 |
| アクセシビリティ基盤 | **Radix UI** | ARIA/キーボード/フォーカス自動管理 |
| バリアント管理 | **CVA** | 型安全なバリアント定義 |
| ビルド | **tsup** | ESMライブラリ出力、dts生成 |
| ドキュメント | **Storybook 8** | コンポーネントカタログ、a11yアドオン |
| テスト | **Vitest + Testing Library + axe-core** | Phase 0から全フェーズで使用 |
| 型システム | **TypeScript** | 型安全性 |

---

## 実装フェーズ

### Phase 0: プロジェクト基盤 + 品質パイプライン
> **品質**(主) / 速度(副)

テストとa11yチェックをインフラとして最初に構築。以降の全フェーズの品質ゲート。

- [ ] プロジェクト初期化（package.json, TypeScript, tsup）
- [ ] Vitest + Testing Library セットアップ
- [ ] axe-core アクセシビリティテスト統合
- [ ] Storybook 8 + addon-a11y セットアップ
- [ ] `cn()` ユーティリティ（clsx + tailwind-merge）
- [ ] `createContext()` 型安全コンテキストファクトリ
- [ ] .gitignore, .prettierrc

**成果物:** テスト・ビルド・Storybookが動作する空のデザインシステムパッケージ

### Phase 1: ブランド基盤 + デザイントークン
> **ブランディング**(主) / 品質(副)

デザイン原則とトークンを**戦略的意思決定**として策定。全後続フェーズの判断基準。

- [ ] デザイン原則ドキュメント（明快さ、一貫性、効率性、適応的密度、段階的開示）
- [ ] ブランドアイデンティティ定義（カラー方針、タイポグラフィ、アイコン、ボイス&トーン）
- [ ] デザイントークン実装（`globals.css` - Tailwind v4 `@theme`）
  - カラー: brand(50-950), neutral(zinc系), semantic(success/warning/error/info)
  - タイポグラフィ: Inter + Noto Sans JP, サイズスケール(base=14px), ウェイト
  - スペーシング: 4pxグリッド
  - エレベーション: shadow-xs～xl + shadow-drawer, radius-none～full
  - アニメーション: duration, easing, keyframes
  - Z-index: dropdown(50)～tooltip(600)
- [ ] TypeScriptトークン定数（プログラム的アクセス用）
- [ ] レスポンシブ方針 + `useBreakpoint` フック
- [ ] トークンのStorybookドキュメント（Colors, Typography, Spacing, Elevation）

**成果物:** トークンパッケージ + ブランドガイドライン

### Phase 2: コアアトム
> **品質**(主) / 速度(副)

ドメイン横断で使われる基礎コンポーネント。全ドメインスライスの前提。

- [ ] Button（variant: default/destructive/outline/ghost/link, size: sm/md/lg/icon）
- [ ] Badge（ステータス表示）
- [ ] Avatar
- [ ] Separator
- [ ] Skeleton（ローディングプレースホルダー）
- [ ] Spinner（ローディングインジケーター）
- [ ] Card（コンテナ）
- [ ] Tooltip（Radix UI）
- [ ] Toast（通知、Radix UI）

**品質ゲート（Phase 2以降の全コンポーネントに適用）:**
- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト（自動）
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型ドキュメント

**成果物:** 基本UIコンポーネントライブラリ

### Phase 3: PWA対応
> **品質**(主) / 速度(副)

デスクトップファーストの業務アプリをPWAとしてもネイティブ品質で動作させるための基盤。
既存コンポーネントのタッチ最適化と、PWA固有のトークン・フック・UIパターンを提供する。

#### 3-A: トークン + ユーティリティ拡張
- [ ] Safe Area Insetsトークン（`env(safe-area-inset-*)` をCSS変数化）
- [ ] Viewport単位トークン（`dvh`, `svh` ユーティリティ）
- [ ] タッチターゲットトークン（最小44px保証の変数）
- [ ] スタンドアロンモード用スタイル（`@media (display-mode: standalone)` ユーティリティ）

#### 3-B: フック
- [ ] `useDisplayMode()` — standalone / browser / minimal-ui 検出
- [ ] `useOnlineStatus()` — オンライン/オフライン状態監視
- [ ] `useViewportHeight()` — モバイルブラウザのアドレスバー考慮した実高さ
- [ ] `useInstallPrompt()` — PWAインストールプロンプト制御（`beforeinstallprompt` イベント）

#### 3-C: 既存コンポーネントのタッチ最適化
- [ ] Button: タッチターゲット44px保証（モバイルでの最小サイズ調整）
- [ ] Toast: モバイルでは下部中央表示、スワイプ方向調整
- [ ] Tooltip: タッチデバイスではlong-press対応 or 非表示

#### 3-D: PWA固有コンポーネント
- [ ] BottomNavigation（モバイルアプリ型ナビゲーション、Safe Area対応）
- [ ] OfflineIndicator（オフライン状態バナー）
- [ ] InstallPrompt（PWAインストール誘導UI）
- [ ] PullToRefresh（引っ張って更新パターン）

#### 3-E: ドキュメント + ガイド
- [ ] PWA対応ガイドライン（manifest.json, Service Worker, アイコン生成はアプリ側の責務として記載）
- [ ] レスポンシブ + PWAのStorybookストーリー（モバイルビューポートでのプレビュー）

**品質ゲート:**
- タッチターゲットサイズの自動テスト
- モバイルビューポートでのスナップショット検証
- `prefers-reduced-motion` 対応確認

**成果物:** PWA対応済みコンポーネントライブラリ + PWAガイドライン

### Phase 4: フォームドメイン
> **速度**(主) / 品質(副)

業務アプリ最高価値のドメイン。CRUD・設定・データ入力すべてにフォームが必要。

- [ ] アトム: Input, Label, Textarea, Checkbox, Radio, Switch
- [ ] コンポジット: Select（Radix UI）, Combobox, DatePicker, NumberInput
- [ ] パターン: FormField（Label + Input + Error統合）
- [ ] パターン: DynamicFormField（16データ型→コンポーネント自動マッピング）
- [ ] フォームレイアウトパターン（vertical, horizontal, grid）
- [ ] バリデーション統合ガイド（react-hook-form + zod連携）

**成果物:** 完全なフォームツールキット

### Phase 5: データ表示ドメイン
> **速度**(主) / ブランディング(副)

業務アプリ中核画面「一覧→フィルタ→詳細」を実現。

- [ ] Table（基本テーブル: ソート、リサイズ）
- [ ] DataTable（高機能: ページネーション、バルク操作、カラム設定、行選択）
- [ ] FilterBar（AND/OR条件グループ、演算子選択、保存フィルタ）
- [ ] EmptyState（空状態 + アクション誘導）
- [ ] Tabs（Radix UI）

**成果物:** データ一覧画面の完全なツールキット

### Phase 6: ナビゲーション + レイアウトドメイン
> **ブランディング**(主) / 速度(副)

アプリの「骨格」を定義。Polastackアプリの外観と操作感を統一。

- [ ] AppShell（サイドバー + ヘッダー + コンテンツ、PWA時はBottomNavigation統合）
- [ ] DropdownMenu（Radix UI）
- [ ] Dialog / Modal（Radix UI、レスポンシブ対応）
- [ ] StackedDrawer（重ね表示ドロワー、ピン/アンピン）
- [ ] CommandPalette（キーボード駆動の検索・ナビゲーション）
- [ ] Popover（Radix UI）

**成果物:** Phase 4-5と組み合わせて完全な業務アプリケーション構築可能

### Phase 7: 統合 + 採用支援
> **速度**(主) / 品質(副) / ブランディング(副)

デザインシステムを「作った」から「使われている」にする。

- [ ] Ant Design → Polastack DS 移行ガイド（コンポーネント対応表、共存戦略）
- [ ] project-renacer パイロット移行（1-2画面を実際に置換し検証）
- [ ] アプリスターターテンプレート（AppShell + 共通パターン、PWA対応テンプレート含む）
- [ ] ユースケースドキュメント（「CRUD画面の作り方」「設定画面の作り方」）
- [ ] パフォーマンス監査（バンドルサイズ、tree-shaking検証）
- [ ] 開発者オンボーディングガイド

**成果物:** 実証済みの移行パス + テンプレート

### Phase 8: ガバナンス + 進化
> **品質**(主) / ブランディング(副) / 速度(副)

実利用フィードバックに基づく持続的改善プロセス。

- [ ] コンポーネントライフサイクル定義（提案→レビュー→実装→ドキュメント→リリース）
- [ ] セマンティックバージョニング方針
- [ ] コントリビューションガイドライン
- [ ] CHANGELOG運用
- [ ] ヘルスメトリクス（採用率、コンポーネントカバレッジ、a11yスコア）
- [ ] アプリチームとの定期フィードバックループ

---

## 進め方の原則

1. **品質はインフラ** - テスト・a11yは別フェーズでなく、Phase 0で構築し全フェーズのゲートとする
2. **ドメイン価値順** - 技術的複雑さでなく、業務アプリへの価値でコンポーネントを優先順位付け
3. **各フェーズが独立価値** - どのフェーズ完了時点でも、利用可能な成果物がある
4. **採用なくして速度なし** - 統合・採用支援なしに「早く開発する」目的は達成されない
5. **ブランドは戦略** - デザイン原則・トークンはサブタスクでなく、独立した意思決定フェーズ
6. **PWAは後付けでなく基盤** - タッチ最適化とレスポンシブ対応をコアアトム完成直後に組み込み、後続フェーズの全コンポーネントがPWA対応前提で設計される

---

## 現在のステータス

**Phase 0-1: プロジェクト基盤 + デザイントークン** - 完了
**Phase 2: コアアトム** - 完了（Button, Badge, Avatar, Separator, Skeleton, Spinner, Card, Tooltip, Toast）
**Phase 3: PWA対応** - 完了（トークン, フック4種, タッチ最適化, PWAコンポーネント4種）
**Phase 4: フォームドメイン** - 完了（Label, Input, Textarea, Checkbox, RadioGroup, Switch, Select, NumberInput, DatePicker, Combobox, FormField, DynamicFormField, FormLayout）
