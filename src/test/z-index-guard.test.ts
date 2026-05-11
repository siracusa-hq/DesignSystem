/**
 * z-index governance test
 *
 * リポジトリ全体を走査して以下を強制する:
 *   1. 任意値 `z-[N]` (Tailwind arbitrary value) を禁止 (allowlist 以外)
 *   2. inline `zIndex: ...` を禁止 (allowlist 以外)
 *   3. flow 内 z-* utility (`z-content` / `z-sticky` / `z-header` /
 *      `z-overlay-inline`) を使う component のファイル内に `isolate` 必須
 *
 * 詳細: docs/z-index-system.md
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '..');

/** 再帰的に src 配下の .ts / .tsx を収集 (test / stories は除外) */
function collectSourceFiles(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'test' || entry.name === 'stories') continue;
      collectSourceFiles(full, files);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.test.tsx') &&
      !entry.name.endsWith('.stories.tsx')
    ) {
      files.push(full);
    }
  }
  return files;
}

const ARBITRARY_Z_RE = /z-\[[^\]]+\]/g;
const INLINE_Z_RE = /zIndex\s*:/g;

/**
 * 任意値 `z-[N]` の例外 allowlist。新規追加時はレビューで合意の上で登録。
 * 現状: なし。原則 token utility 経由。
 */
const ALLOWLIST_ARBITRARY = new Set<string>([]);

/**
 * inline `zIndex` の例外 allowlist。
 *
 * - drawer: `stackOffset` を加算するため `calc(var(--z-drawer) + N)` を inline で渡す
 * - avatar-group: 重ね表示で `visible.length - i` の小さな in-flow z-index
 * - data-table 系: 内部 sticky cell の局所階層
 */
const ALLOWLIST_INLINE_Z = new Set<string>([
  path.join(SRC, 'components', 'drawer', 'drawer.tsx'),
  path.join(SRC, 'components', 'avatar-group', 'avatar-group.tsx'),
  path.join(SRC, 'components', 'data-table', 'data-table.tsx'),
  path.join(SRC, 'components', 'data-table', 'data-table-toolbar.tsx'),
  path.join(SRC, 'components', 'data-table', 'data-table-column-pin-selector.tsx'),
]);

/** flow 内 z-utility を含むファイルは isolate が必要 */
const IN_FLOW_Z_RE = /\bz-(?:content|sticky|header|overlay-inline)\b/;
const ISOLATE_RE = /\bisolate\b/;

describe('z-index governance', () => {
  const files = collectSourceFiles(SRC);

  it('禁止: 任意値 z-[N] (allowlist 以外)', () => {
    const violations: string[] = [];
    for (const file of files) {
      if (ALLOWLIST_ARBITRARY.has(file)) continue;
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(ARBITRARY_Z_RE);
      if (matches && matches.length > 0) {
        violations.push(`${path.relative(SRC, file)}: ${matches.join(', ')}`);
      }
    }
    expect(
      violations,
      [
        '任意値 z-[N] が検出されました。token utility (z-modal 等) を使ってください。',
        '例外として allowlist に追加する場合は src/test/z-index-guard.test.ts を編集 + レビュー必須。',
        '違反箇所:',
        ...violations.map((v) => `  - ${v}`),
        'docs/z-index-system.md を参照。',
      ].join('\n'),
    ).toEqual([]);
  });

  it('禁止: inline zIndex (allowlist 以外)', () => {
    const violations: string[] = [];
    for (const file of files) {
      if (ALLOWLIST_INLINE_Z.has(file)) continue;
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(INLINE_Z_RE);
      if (matches && matches.length > 0) {
        violations.push(`${path.relative(SRC, file)}: ${matches.length} 箇所`);
      }
    }
    expect(
      violations,
      [
        'inline zIndex (style 経由) が検出されました。token utility 経由が原則。',
        '実装上やむを得ない場合は ALLOWLIST_INLINE_Z に登録 + 理由をコメント記載。',
        '違反箇所:',
        ...violations.map((v) => `  - ${v}`),
      ].join('\n'),
    ).toEqual([]);
  });

  it('必須: flow 内 z-* utility を使う component に isolate', () => {
    const violations: string[] = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (IN_FLOW_Z_RE.test(content) && !ISOLATE_RE.test(content)) {
        violations.push(path.relative(SRC, file));
      }
    }
    expect(
      violations,
      [
        'flow 内 z-utility (z-content / z-sticky / z-header / z-overlay-inline) を',
        '使うファイルは、stacking context を閉じるため root に `isolate` を必須化しています。',
        '違反ファイル (isolate 未配置):',
        ...violations.map((v) => `  - ${v}`),
        'docs/z-index-system.md の「flow 内深層は isolate 必須」セクションを参照。',
      ].join('\n'),
    ).toEqual([]);
  });
});
