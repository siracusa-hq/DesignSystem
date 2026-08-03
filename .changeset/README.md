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
2. Release ワークフローが `package.json` の version 更新 + CHANGELOG 生成 +
   changeset ファイル削除を行い、**`changeset-release/main` ブランチに push する**
3. **そのブランチから Version PR を手動で作る**

   ```bash
   gh pr create --base main --head changeset-release/main \
     --title "chore: release packages" --fill
   ```

4. その PR をマージすると、同じワークフローが npm publish とタグ作成まで実行する

> **なぜ手動なのか**
> org のポリシーで GitHub Actions による PR 作成が禁止されているため、
> changesets の自動 PR 作成は 403 で失敗する。ワークフローのログに
> 「creating pull request」の失敗が残るが、**ブランチには正しい内容が入っている**。
> 詳細はリポジトリルートの [CLAUDE.md](../CLAUDE.md) を参照。

**手で `package.json` の version を編集したり `git tag` を打ったりしないこと。**
モノレポでは3パッケージが独立したバージョンを持つため、手動運用は破綻する。

## 内部依存の扱い

`@siracusahq/design-system` と `@siracusahq/gtm-design-system` は
`@siracusahq/tokens` に依存している。tokens が上がると両パッケージにも
自動で patch バージョンが割り当てられる（`updateInternalDependencies: "patch"`）。
