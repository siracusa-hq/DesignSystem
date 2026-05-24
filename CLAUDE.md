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

- メインカラー: `#008575`（H≈173 S≈100% L≈26%、AA 限界点を狙った明るめ teal）
  - 500 単独で白文字 4.55:1 を満たし WCAG AA 適合。Button bg などの操作 UI に直接適用可能
  - 400 以下 (`#26A69A` ほか) は vivid accent (Badge / Switch on / Slider range / Tabs indicator) 用
- success: True Green系（H≈130、primaryのティールと44°の色相差で区別）
- warning: Amber、error: Red、info: Blue

## リリース運用

- PRをmainにマージした際は、必ずパッチバージョン（リビジョン）をカウントアップする
- `package.json` の `version` を更新し、mainにコミット・プッシュ
- `git tag vX.Y.Z` でタグを作成・プッシュし、`gh release create` で GitHub Release を公開する
- Release ワークフロー（`on: release [published]`）が npm パッケージを自動公開する

## 品質ゲート（Phase 2以降の全コンポーネント）

- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型定義
