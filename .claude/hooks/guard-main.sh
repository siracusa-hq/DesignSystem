#!/bin/sh
# Claude Code PreToolUse hook:
# main/master ブランチ上での git commit / git push をブロックする。
# サーバー側の branch protection の手前で即時フィードバックを返すための第一防衛線。
input="$(cat)"

if command -v jq >/dev/null 2>&1; then
  cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)"
else
  cmd="$input"
fi

case "$cmd" in
  *"git commit"*|*"git push"*) ;;
  *) exit 0 ;;
esac

branch="$(git branch --show-current 2>/dev/null || true)"
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  echo "BLOCKED: ${branch} ブランチ上での commit/push は禁止されています。'git switch -c agent/<エージェント名>/<作業内容>' で作業ブランチを切ってから実行してください。" >&2
  exit 2
fi
exit 0
