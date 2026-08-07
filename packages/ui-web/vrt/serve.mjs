/**
 * VRT 用の静的配信サーバ（`storybook-static/web` をルートに置く）。
 *
 * 依存を増やさないために自前で持つ。http-server / sirv-cli を使うと
 * 「VRT を回すためだけの devDependency」が増え、CI でも毎回取得することになる。
 *
 * 使い方: node vrt/serve.mjs <配信ディレクトリ> <ポート>
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '');
const port = Number(process.argv[3] ?? 6107);

if (!existsSync(join(root, 'iframe.html'))) {
  console.error(
    `[vrt] Storybook の静的ビルドが見つかりません: ${root}\n` +
      `      先に \`pnpm --filter @siracusahq/gtm-design-system build-storybook:vrt\` を実行してください。`,
  );
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  // ディレクトリ脱出（`../`）を正規化で潰してから root に閉じ込める
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(root, rel);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }
  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found');
    return;
  }

  res.writeHead(200, {
    'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
    // スナップショットの再現性のためキャッシュは持たせない
    'cache-control': 'no-store',
  });
  createReadStream(filePath).pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`[vrt] serving ${root} on http://127.0.0.1:${port}`);
});
