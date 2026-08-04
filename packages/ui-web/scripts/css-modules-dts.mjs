/**
 * *.module.css → *.module.css.d.ts 生成
 *
 * CSS Modules の唯一の弱点「クラス名の typo / リネームが静かに undefined になる」を
 * 型エラーに変える（案C採用時の必須3点セットの1つ）。
 *
 * 方式: codegen と同じ「生成物をコミットし、CI が再生成して差分ゼロを検証」。
 * 実行: pnpm --filter @siracusahq/gtm-design-system codegen（ルートからは pnpm codegen）
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../src');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name.endsWith('.module.css')) yield p;
  }
}

/** クラスセレクタ名を抽出（@keyframes 内・擬似クラス引数内は除外対象になりにくい素朴実装で十分） */
function classNames(css) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const names = new Set();
  for (const m of noComments.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) {
    names.add(m[1]);
  }
  return [...names].sort();
}

let count = 0;
for (const file of walk(root)) {
  const names = classNames(readFileSync(file, 'utf8'));
  const banner = `// ⚠️ 自動生成 — 手で編集しないこと。再生成: pnpm codegen\n`;
  const body = names.map((n) => `  readonly ${JSON.stringify(n)}: string;`).join('\n') || '';
  const dts = `${banner}declare const styles: {\n${body}\n};\nexport default styles;\n`;
  writeFileSync(file + '.d.ts', dts);
  count++;
}
console.log(`css-modules-dts: ${count} ファイルの d.ts を生成`);
