# Polastack Design System - 実装プラン

> Polastackヘッドレスプラットフォーム上の業務アプリ開発を
> 「品質高く」「早く」「ブランド統一して」行うためのデザインシステム。

---

## 目的

| 目的 | 実現方法 | 主担当フェーズ |
|------|---------|--------------|
| **品質を高く保つ** | テスト・a11yを初日から組込み、全コンポーネントに品質ゲート適用 | Phase 0, 2, 7 |
| **早く開発する** | ドメイン別コンポーネント群で即座に画面構築可能 + 採用支援 | Phase 3, 4, 6 |
| **ブランディング** | 戦略的なデザイン原則・トークン定義 + アプリ骨格の統一 | Phase 1, 5 |

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

### Phase 3: フォームドメイン
> **速度**(主) / 品質(副)

業務アプリ最高価値のドメイン。CRUD・設定・データ入力すべてにフォームが必要。

- [ ] アトム: Input, Label, Textarea, Checkbox, Radio, Switch
- [ ] コンポジット: Select（Radix UI）, Combobox, DatePicker, NumberInput
- [ ] パターン: FormField（Label + Input + Error統合）
- [ ] パターン: DynamicFormField（16データ型→コンポーネント自動マッピング）
- [ ] フォームレイアウトパターン（vertical, horizontal, grid）
- [ ] バリデーション統合ガイド（react-hook-form + zod連携）

**成果物:** 完全なフォームツールキット

### Phase 4: データ表示ドメイン
> **速度**(主) / ブランディング(副)

業務アプリ中核画面「一覧→フィルタ→詳細」を実現。

- [ ] Table（基本テーブル: ソート、リサイズ）
- [ ] DataTable（高機能: ページネーション、バルク操作、カラム設定、行選択）
- [ ] FilterBar（AND/OR条件グループ、演算子選択、保存フィルタ）
- [ ] EmptyState（空状態 + アクション誘導）
- [ ] Tabs（Radix UI）

**成果物:** データ一覧画面の完全なツールキット

### Phase 5: ナビゲーション + レイアウトドメイン
> **ブランディング**(主) / 速度(副)

アプリの「骨格」を定義。Polastackアプリの外観と操作感を統一。

- [ ] AppShell（サイドバー + ヘッダー + コンテンツ）
- [ ] DropdownMenu（Radix UI）
- [ ] Dialog / Modal（Radix UI、レスポンシブ対応）
- [ ] StackedDrawer（重ね表示ドロワー、ピン/アンピン）
- [ ] CommandPalette（キーボード駆動の検索・ナビゲーション）
- [ ] Popover（Radix UI）

**成果物:** Phase 3-4と組み合わせて完全な業務アプリケーション構築可能

### Phase 6: 統合 + 採用支援
> **速度**(主) / 品質(副) / ブランディング(副)

デザインシステムを「作った」から「使われている」にする。

- [ ] Ant Design → Polastack DS 移行ガイド（コンポーネント対応表、共存戦略）
- [ ] project-renacer パイロット移行（1-2画面を実際に置換し検証）
- [ ] アプリスターターテンプレート（AppShell + 共通パターン）
- [ ] ユースケースドキュメント（「CRUD画面の作り方」「設定画面の作り方」）
- [ ] パフォーマンス監査（バンドルサイズ、tree-shaking検証）
- [ ] 開発者オンボーディングガイド

**成果物:** 実証済みの移行パス + テンプレート

### Phase 7: ガバナンス + 進化
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

---

## 現在のステータス

**Phase 0-1: プロジェクト基盤 + デザイントークン** - 完了
**Phase 2: コアアトム** - 完了（Button, Badge, Avatar, Separator, Skeleton, Spinner, Card, Tooltip, Toast）
