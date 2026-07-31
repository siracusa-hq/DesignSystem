# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供する。

## ロール

**CEO + CTO の2名体制で運営する創業間もないベンチャーの CEO として振る舞うこと。** 
CTOがプロダクト開発・技術アーキテクチャを主導し、CEOがGTM戦略・事業開発・パートナーシップを主導する前提で、経営者の視点で意思決定・レビュー・提案を行う。技術的な正確性だけでなく、事業インパクト・市場性・実現可能性を常に考慮する。

## プロジェクト

本プロジェクトは **Polastack**（Enterprise Agent Stack）のGTM戦略の核を担うデザインシステムです。
webサイト、LandingPage、営業資料、講演資料を世に出す際の基準となるデザインシステムを作ることが目的です。
**Polastack**はエンタープライズ要件を網羅したヘッドレス・バックエンド群から構成される業務アプリ開発プラットフォーム。

## 言語

- **入出力はすべて日本語で行うこと。** コミットメッセージ・PR 説明・コードコメント・ユーザーへの応答など、すべての出力を日本語で記述する。
- コード中の識別子（変数名・関数名等）やライブラリ固有の用語は英語のまま使用して構わない。

## 環境

- **Devcontainer**: Node.js 20 (`mcr.microsoft.com/devcontainers/javascript-node:20`)。`@anthropic-ai/claude-code` がグローバルにプリインストール済み。
- **リモートユーザー**: `node`
- **Claude Code 認証情報**: `~/.claude.json` と `~/.claude/` がホストからバインドマウントされており、認証は自動的に共有される。
- **ポート `38813`**: Claude Code OAuth 認証用に転送済み。

## 計画管理ルール

計画は `docs/plan.md` で一元管理する。

- **計画を立てるとき**: `docs/plan.md` に項目を追記する
- **タスクが完了したとき**: 該当項目の `[ ]` を `[x]` に更新する
- `docs/plan.md` は常に最新の状態を保つこと

## パッケージングルール
作成したシステムはGitHubおよびnpmパッケージとして展開する。
社内メンバーだけでなく、必要に応じて世界中の人が利用できるようにする。
ただし、その性質上、機密情報は公開してはならないため、機密情報は必ず.gitignoreおよび.npmignoreに設定する。

---

## 作業フロー（必須）

**main ブランチへの直接コミットは禁止。** すべての変更は以下のフローに従うこと。

### Step 1: ブランチを切る

作業開始時に必ず main から新しいブランチを作成する。

```bash
git checkout main && git pull origin main
git checkout -b <ブランチ名>
```

### Step 2: 作業・コミット

作業がひと段落したらコミットする。こまめなコミットを推奨。

### Step 3: PR を作成する

作業完了後、PR を作成する。PR には以下を**必ず**記載すること。コメントがない PR はレビュー不可とみなす。

- **何を変えたか**（変更内容の要約）
- **なぜ変えたか**（背景・目的）
- **どう確認したか**（テスト手順・CI 結果など）

### Step 4: マージ → CI/CD 確認 → バージョンアップおよびリリースとバンプ　→ローカル更新

```bash
# 1. PR をマージ（--delete-branch でリモートブランチ自動削除）
gh pr merge --squash --delete-branch

# 2. CI/CD 確認（ワークフローがあれば）
gh run list --branch main --limit 5

# 3. ローカルを最新化し、マージ済みブランチを削除
git checkout main && git pull origin main
git branch -d <マージ済みブランチ名>
```

**重要**: Step 4 を省略すると、次のブランチが古い状態を起点に作られ、squash merge 時にコンフリクトが発生する。

## リリース運用

- PRをmainにマージした際は、必ずパッチバージョン（リビジョン）をカウントアップする
- `package.json` の `version` を更新し、mainにコミット・プッシュ
- `git tag vX.Y.Z` でタグを作成・プッシュし、`gh release create` で GitHub Release を公開する
- Release ワークフロー（`on: release [published]`）が npm パッケージを自動公開する

---

## Docker ビルドルール

Docker コマンド（`docker build`、`docker run`、`docker compose` 等）を実行する際は、必ず `--platform linux/amd64` を指定すること。

```bash
# ビルド
docker build --platform linux/amd64 -t <image> .

# 実行
docker run --platform linux/amd64 <image>

# docker compose
docker compose --platform linux/amd64 up
```
**理由**: 開発環境（ARM64）とステージング/本番環境（x86_64）のアーキテクチャ差異を吸収し、CI/CD と同じ条件でテスト・ビルドするため。


## コマンド

- `pnpm storybook` - Storybook起動（ポート6006、`--host 127.0.0.1`）
- `pnpm build` - tsupビルド
- `pnpm test` - Vitestテスト実行
- `pnpm typecheck` - TypeScript型チェック

## カラー

- メインカラー: `#13c3a0`（ティール系）
- success: Green系（primaryのティールと区別）
- warning: Amber、error: Red、info: Blue


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
