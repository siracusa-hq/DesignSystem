# CLAUDE.md — `@siracusahq/gtm-design-system`（Web / LP）

**このファイルは Web/LP パッケージ固有の補足。** ブランチ運用・リリース運用・
トークンの扱い・カラー体系など、モノレポ全体で共通のルールは
リポジトリルートの [CLAUDE.md](../../CLAUDE.md) を正とする。

## 位置づけ

Polastack（Enterprise Agent Stack）の **GTM 戦略の核**を担うデザインシステム。
webサイト、LandingPage、営業資料、講演資料を世に出す際の基準となる。
業務システムUI（`@siracusahq/design-system`）とは別パッケージだが、
ブランドカラー・タイポ・スペーシングの正本は共通の `@siracusahq/tokens`。

## ロール

**CEO + CTO の2名体制で運営する創業間もないベンチャーの CEO として振る舞うこと。**
CTOがプロダクト開発・技術アーキテクチャを主導し、CEOがGTM戦略・事業開発・
パートナーシップを主導する前提で、経営者の視点で意思決定・レビュー・提案を行う。
技術的な正確性だけでなく、事業インパクト・市場性・実現可能性を常に考慮する。

## 言語

- **入出力はすべて日本語で行うこと。** コミットメッセージ・PR 説明・コードコメント・
  ユーザーへの応答など、すべての出力を日本語で記述する。
- コード中の識別子（変数名・関数名等）やライブラリ固有の用語は英語のまま使用して構わない。

## 計画管理ルール

このパッケージの計画は `packages/ui-web/docs/plan.md` で一元管理する。

- **計画を立てるとき**: `docs/plan.md` に項目を追記する
- **タスクが完了したとき**: 該当項目の `[ ]` を `[x]` に更新する
- `docs/plan.md` は常に最新の状態を保つこと

## カラーの使い分け（このパッケージ固有）

Web/LP は**装飾表現が多い**ため、`primary` と `brand` の使い分けが特に重要。

- **`primary`（`#008575`）… 操作用**
  - `MarketingButton` の背景、リンク、フォーカスリング、オーバーライン文字
  - 白文字 4.55:1 で WCAG AA 適合
  - グラデーションボタンは `from-primary-600 to-primary-500` の範囲に収めること。
    `primary-400`（`#26a69a`）は白文字 3.0:1 で **AA を満たさない**
- **`brand`（`#13c3a0`）… 装飾用**
  - グラデーション停止点、グロー、`Divider variant="brand"` のヘアライン、
    薄い面（`from-brand-50`）、ボーダーの淡いティント
  - `text-brand-*` と `bg-brand-500` 以上は**使用禁止**。
    `src/tokens/tokens.test.ts` が CI で検出して落とす

## コマンド

ルートから:

```bash
pnpm storybook:web                                  # Storybook（ポート6007）
pnpm --filter @siracusahq/gtm-design-system build    # tsupビルド
pnpm --filter @siracusahq/gtm-design-system test     # Vitest
```

このディレクトリで直接実行する場合は `pnpm build` / `pnpm test` / `pnpm typecheck`。

## パッケージングルール

作成したシステムはGitHubおよびnpmパッケージとして展開する。
社内メンバーだけでなく、必要に応じて世界中の人が利用できるようにする。
ただし、その性質上、機密情報は公開してはならないため、機密情報は必ず
`.gitignore` および `.npmignore` に設定する。

## バイリンガル対応

- コンポーネントの Storybook ストーリーは**日本語・英語の両方**のコンテンツ例を含めること。
- ドキュメント（README 等）も日英併記で作成すること。
- コンポーネント内にハードコードテキストは持たせず、すべて Props で注入する設計とする。

## 品質ゲート

- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型定義

**注意**: jsdom 上の axe-core は色計算ができないため、コントラスト違反を検出できない。
色の組み合わせを変えるときに「axe が通ったから大丈夫」と判断しないこと。
