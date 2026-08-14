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

計画は3層で管理する。**設計の正本は `docs/composition-redesign.md`**（Stage 1〜6 の
定義と実測根拠）、**実装の分解と進捗は `docs/stage*-workorder.md`**（Stage ごとに
1ファイル。スライスの完了条件・進捗チェック・§7「実装で判明した事項」）。

- **Stage を開始するとき**: `docs/stageN-workorder.md` をスライス分解付きで作成する
- **スライスが完了したとき**: 進捗欄の `[ ]` を `[x]` にし、要点と例外を記録する
- **あとから効く発見**: workorder の §7 に必ず記録する（次の Stage の判断材料になる）
- `docs/plan.md` は初期構築（Phase 0〜）の記録。現行計画には使わない

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

### ページ単位 VRT（ビジュアル回帰）

```bash
pnpm --filter @siracusahq/gtm-design-system vrt         # 基準 PNG と比較（CI と同じ）
pnpm --filter @siracusahq/gtm-design-system vrt:update  # 基準 PNG を更新
  **更新後は `git status -- vrt/` で「意図した変更のページだけが差分か」を必ず確認してからコミットする。**
  ローカルのフォント揺れで無関係な基準が再撮影されることがあり、`git add -A` で
  そのまま混ぜると CI が決定的に落ちる（2026-08-14 に実際に発生）。
```

対象は**ページ単位ストーリーだけ**（Patterns/LandingPage・Patterns/WorstCase・
Examples/CorporateTop）。コンポーネント単体は対象にしない。基準 PNG は
`vrt/__screenshots__/{desktop,mobile}/` にコミットしてあり、**その更新は
「意図した見た目の変更」の PR にだけ含めること**。設計と実測は
[docs/stage5-workorder.md](./docs/stage5-workorder.md) §3 / §7。

初回は Chromium の取得が要る: `pnpm exec playwright install chromium --with-deps`。

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
