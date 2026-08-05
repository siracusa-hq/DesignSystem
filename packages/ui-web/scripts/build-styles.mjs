/**
 * build-styles — 配布用の単一 CSS を生成する（Stage 2 Slice 6）
 *
 * 出力: dist/styles.css
 *   [1] Web フォント（@import。将来セルフホスト化する場合はここを差し替え）
 *   [2] theme.css の Tailwind 非依存化（@theme → :root、@custom-variant 除去、
 *       generated-brand.css のインライン化）
 *   [3] dist/index.css（全コンポーネントの CSS Modules 出力・ハッシュ済み）
 *
 * 消費側はこれ1行で完結する:
 *   import '@siracusahq/gtm-design-system/styles.css';
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

// [1] フォント。preview-head.html と同一指定（README の手動手順を置き換える）
const fonts = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');`;

// [2] theme.css の変換
let theme = read('src/styles/theme.css');

// generated-brand.css をインライン化（単一ファイル配布のため）
theme = theme.replace(
  /@import '\.\/generated-brand\.css';/,
  () => read('src/styles/generated-brand.css'),
);

// Tailwind 専用構文の除去・変換
theme = theme.replace(/@custom-variant[^;]+;\n?/g, '');
if (!/@theme \{/.test(theme)) {
  throw new Error('theme.css に @theme ブロックが見つからない（構造が変わった場合はこのスクリプトを更新すること）');
}
theme = theme.replace(/@theme \{/g, ':root {');

// [3] コンポーネント CSS（tsup + local-css の出力）
const components = read('dist/index.css');
if (!components.includes('container_container')) {
  throw new Error(
    'dist/index.css にハッシュ済みクラスが見つからない。tsup の loader 設定（.css → local-css）が壊れている可能性',
  );
}

const banner = `/**
 * @siracusahq/gtm-design-system — 配布用スタイル（自動生成・編集禁止）
 * 使い方: import '@siracusahq/gtm-design-system/styles.css';
 * Tailwind は不要。フォントは Google Fonts から読み込む（セルフホストする場合は
 * このファイルの先頭 @import を削り、--font-sans / --font-mono を上書きする）。
 */
`;

const out = [banner, fonts, '', theme, '', components].join('\n');
writeFileSync(resolve(root, 'dist/styles.css'), out);
console.log(`build-styles: dist/styles.css ${(out.length / 1024).toFixed(1)} KB`);
