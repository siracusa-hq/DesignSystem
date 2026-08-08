---
'@siracusahq/gtm-design-system': minor
---

Stage 5 Slice 1: dev 警告の拡充と、警告が実際に出るようになる修正。

**dev 警告を4種追加**（既存5種と合わせて9種。すべて開発時のみ）

- `Page`: ページ内に `h1` が2つ以上ある（マウント後に自ルート配下を数える）
- `LandingPage`: `product` / `product-portfolio-top` で社会的証明スロット（`proof`）が空
  （実測 19/19 のページが数値訴求を持つ）
- `StatsSection`: 実績数値に時点表記が無い（景品表示法）
- `LogoCloud`: ロゴが1〜5社（日本語ページに実例0件。少数なら事例カードに紐付ける）

**新しい prop**

- `StatsSection` に `asOf?: string`（例: 「※2026年7月末時点」）。数値グリッドの下に
  caption で控えめに表示する。`asOf` も `note` も無いと dev 警告が出る

**不具合修正**

- `AnimatedCounter` が `prefers-reduced-motion: reduce` を尊重するようになった。
  OS で動きを止めている環境ではカウントアップせず最終値を即座に表示する
  （rAF による JS 実装のため、CSS のトークン層では止まっていなかった）
- **dev 警告がブラウザで一度も出ていなかった問題を修正。** `isDev` の
  `typeof process !== 'undefined'` ガードがブラウザで常に false になり、
  Stage 3〜4 で追加した警告がすべて無効化されていた

`Patterns/規範ガード` に、各警告をコンソールで確認できるデモストーリーを追加。
