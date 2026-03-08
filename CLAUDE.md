# Polastack Design System - 開発ガイド

## ブランチ運用

- **フェーズごとにブランチを作成する**: `phase-N/description` 形式（例: `phase-2/core-atoms`）
- mainブランチに直接コミットしない（フェーズ間の変更を除く）
- フェーズ完了後にmainへマージする

## プロジェクト構成

- `src/tokens/` - デザイントークン（TypeScript定数）
- `src/styles/globals.css` - Tailwind CSS v4 `@theme` によるCSS変数定義
- `src/lib/` - ユーティリティ（`cn`, `createContext`）
- `src/hooks/` - カスタムフック
- `src/stories/` - Storybookストーリー
- `docs/` - ドキュメント（plan.md, BRAND_IDENTITY.md, DESIGN_PRINCIPLES.md）

## コマンド

- `pnpm storybook` - Storybook起動（ポート6006、`--host 0.0.0.0`）
- `pnpm build` - tsupビルド
- `pnpm test` - Vitestテスト実行
- `pnpm typecheck` - TypeScript型チェック

## カラー

- メインカラー: `#1BA491`（ティール系）
- success: Green系（primaryのティールと区別）
- warning: Amber、error: Red、info: Blue

## 品質ゲート（Phase 2以降の全コンポーネント）

- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型定義
