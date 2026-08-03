/**
 * 2つの Storybook を1つの GitHub Pages サイトに統合してビルドする。
 *
 *   storybook-static/
 *     index.html   … どちらへ行くかを選ぶランディング
 *     app/         … @siracusahq/design-system（業務システムUI）
 *     web/         … @siracusahq/gtm-design-system（Web/LP）
 *
 * Storybook は生成する asset パスに base を焼き込むため、
 * サブディレクトリ配信には base の指定が必須。各パッケージの
 * .storybook/main.ts が STORYBOOK_BASE 環境変数を読む。
 *
 * 配信先は Netlify（サイトルート配信）なので base は既定の `/` でよい。
 * サブディレクトリ配信するホスティングに移す場合のみ PAGES_BASE を指定する。
 *
 * 使い方:
 *   pnpm build-storybook                          # 通常（base = /app/, /web/）
 *   PAGES_BASE=/DesignSystem/ pnpm build-storybook # サブパス配信する場合
 *
 * ※ 事前に `pnpm build` が必要。ui-app / ui-web は @siracusahq/tokens を
 *   dist/ 経由で解決するため、未ビルドだと vite が名前解決に失敗する。
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(rootDir, 'storybook-static');

/** サブディレクトリ配信するホスティング向けの前置きパス。Netlify では不要 */
const pagesBase = process.env.PAGES_BASE ?? '/';

const targets = [
  {
    slug: 'app',
    pkg: '@siracusahq/design-system',
    title: '業務システムUI',
    subtitle: 'Product UI',
    description: '業務アプリケーション向けコンポーネント。高密度表示・キーボード操作前提。',
  },
  {
    slug: 'web',
    pkg: '@siracusahq/gtm-design-system',
    title: 'Web / LP',
    subtitle: 'GTM UI',
    description: 'Webサイト・ランディングページ・営業資料向けコンポーネント。',
  },
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const target of targets) {
  const base = `${pagesBase.replace(/\/$/, '')}/${target.slug}/`;
  console.log(`\n▶ ${target.pkg} → storybook-static/${target.slug}/ (base: ${base})`);

  execFileSync(
    'pnpm',
    ['--filter', target.pkg, 'exec', 'storybook', 'build', '--output-dir', join(outDir, target.slug)],
    {
      cwd: rootDir,
      stdio: 'inherit',
      env: { ...process.env, STORYBOOK_BASE: base },
    },
  );
}

const cards = targets
  .map(
    (target) => `      <a class="card" href="./${target.slug}/">
        <span class="eyebrow">${target.subtitle}</span>
        <h2>${target.title}</h2>
        <p>${target.description}</p>
        <code>${target.pkg}</code>
      </a>`,
  )
  .join('\n');

writeFileSync(
  join(outDir, 'index.html'),
  `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Siracusa Design System</title>
    <style>
      :root {
        color-scheme: light dark;
        --surface: #ffffff;
        --on-surface: #18181b;
        --muted: #71717a;
        --border: #e4e4e7;
        --primary: #008575;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --surface: #0a0a0c;
          --on-surface: #fafafa;
          --muted: #a1a1aa;
          --border: #27272a;
          --primary: #26a69a;
        }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        font-family: 'Inter', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif;
        background: var(--surface);
        color: var(--on-surface);
      }
      main { width: min(56rem, 100%); }
      h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
      .lede { color: var(--muted); margin: 0 0 2rem; line-height: 1.8; }
      .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
      .card {
        display: block;
        padding: 1.5rem;
        border: 1px solid var(--border);
        border-radius: 1rem;
        text-decoration: none;
        color: inherit;
        transition: border-color 200ms, transform 200ms;
      }
      .card:hover { border-color: var(--primary); transform: translateY(-2px); }
      .card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
      .eyebrow { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--primary); }
      .card h2 { font-size: 1.25rem; margin: 0.5rem 0; }
      .card p { color: var(--muted); line-height: 1.7; margin: 0 0 1rem; }
      code { font-size: 0.8125rem; color: var(--muted); font-family: 'JetBrains Mono', ui-monospace, monospace; }
    </style>
  </head>
  <body>
    <main>
      <h1>Siracusa Design System</h1>
      <p class="lede">
        ブランド共通トークン <code>@siracusahq/tokens</code> を正本に、用途別の2つのUIパッケージを提供しています。
      </p>
      <div class="grid">
${cards}
      </div>
    </main>
  </body>
</html>
`,
);

console.log(`\n✓ storybook-static/ に統合しました（index.html / app/ / web/）`);
