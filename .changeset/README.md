# Changesets

このディレクトリは [changesets](https://github.com/changesets/changesets) がバージョンと CHANGELOG を管理するために使う。

## 使い方

パッケージに利用者から見える変更を入れたら、PR に changeset を1つ添える。

```bash
pnpm changeset
```

対話で「どのパッケージが」「patch / minor / major のどれで」変わるかを選び、
変更内容を1〜2行で書く。生成された `.changeset/*.md` をコミットして PR に含める。

## リリースまでの流れ

1. changeset 付きの PR を main にマージする
2. Release ワークフローが **「chore: release packages」PR** を自動で作成／更新する
   （`package.json` の version 更新 + CHANGELOG 生成 + changeset ファイル削除）
3. その PR をマージすると、同じワークフローが npm publish とタグ作成まで実行する

**手で `package.json` の version を編集したり `git tag` を打ったりしないこと。**
モノレポでは3パッケージが独立したバージョンを持つため、手動運用は破綻する。

## 内部依存の扱い

`@polastack/design-system` と `@polastack/gtm-design-system` は
`@polastack/tokens` に依存している。tokens が上がると両パッケージにも
自動で patch バージョンが割り当てられる（`updateInternalDependencies: "patch"`）。
