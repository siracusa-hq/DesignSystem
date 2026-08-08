/**
 * 消費側スモークテスト — 「配布物が消費側で本当に動くか」を CI で検証する。
 *
 * Storybook でも vitest でも見えない事故を止める最後の砦:
 *   - dist の JS が SSR（renderToString）でクラッシュしない
 *   - CSS Modules のクラス名マッピングが空でない（Slice 6 で実際に発覚した事故:
 *     tsup 設定不備で styles が {} になり、dist が無スタイルだった）
 *   - dist/styles.css が JS 側と同じハッシュ名を含み、Tailwind 構文が残っていない
 *   - Netlify Forms の属性が SSR 出力に含まれる
 *   - dev 警告が production バンドルから消える（DCE）／ development では残る
 */

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { HeroSection, ServicePortfolio, ContactForm, ProductShot } = await import(
  resolve(root, 'dist/index.js')
);

const html = renderToString(
  React.createElement(
    'div',
    null,
    React.createElement(HeroSection, {
      title: 'スモークテスト',
      subtitle: '配布物の検証。',
      actions: [{ label: '資料', href: '#' }],
      image: React.createElement(ProductShot, {}),
      imagePlacement: 'below',
    }),
    React.createElement(ServicePortfolio, {
      services: [
        { brand: 'polastack', name: 'Polastack', description: 'x', href: '#' },
      ],
    }),
    React.createElement(ContactForm, { title: 'お問い合わせ', ichisanEnabled: false }),
  ),
);

const css = readFileSync(resolve(root, 'dist/styles.css'), 'utf8');

/* ------------------------------------------------------------------
   dev 警告の DCE 検証（Stage 5 Slice 1）

   `src/lib/dev.ts` の isDev は「消費側のバンドラが process.env.NODE_ENV を
   置換する」前提に乗っている。この前提が壊れると2方向に事故る:
     - development: 警告が一度も出ない（Stage 3〜4 で実際に起きていた。
       `typeof process !== 'undefined'` のガードがブラウザで false になり、
       Storybook でも消費側 Vite アプリでも警告が出ていなかった）
     - production: isDev が false に畳まれず、警告が実運用で出てしまう
   どちらも「気づけない」種類の事故なので、実際にバンドルして両方向を確かめる。
   esbuild は tsup の依存として必ず入っている（追加の devDependency を作らない）。

   **警告文そのものは production バンドルにも残る**（実測 5,269 B / brotli 1,238 B）。
   tsup(esbuild) が `export const isDev` を必ず `var` として出すため、
   消費側の esbuild / Rollup がモジュールをまたいだ定数伝播をできないのが原因。
   実行はされないので機能上の問題は無い。詳細と対処案は
   docs/stage5-workorder.md §7-5。
   ------------------------------------------------------------------ */

const esbuild = createRequire(import.meta.url)(
  createRequire(import.meta.url).resolve('esbuild', {
    paths: [dirname(createRequire(import.meta.url).resolve('tsup/package.json'))],
  }),
);

/**
 * dist を消費側と同じ条件でバンドルして中身を返す。
 * 和文は `\uXXXX` にエスケープされて出るため、検索前に元へ戻す
 * （戻さないと「見つからない = 消えている」と誤判定して、検査が素通りする）。
 */
function bundleFor(nodeEnv) {
  const out = esbuild.buildSync({
    entryPoints: [resolve(root, 'dist/index.js')],
    bundle: true,
    write: false,
    format: 'esm',
    minify: true,
    platform: 'browser',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    define: { 'process.env.NODE_ENV': JSON.stringify(nodeEnv) },
    logLevel: 'silent',
  }).outputFiles[0].text;
  return out.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  );
}

/** 各 dev 検査の警告文から取った検索キー（1つでも残れば DCE が壊れている） */
const DEV_WARNING_MARKERS = [
  '暗い面のセクションが3つ連続', // Page: 暗面3連続
  'プライマリCTA', // cta-registry: ラベル2種
  'ファーストビューの CTA', // HeroSection: FV 3本
  '送信ボタンのラベル', // FormSection: 汎用送信ラベル
  'ページ内に h1 が', // Page: h1 重複
  '社会的証明スロット', // LandingPage: proof 空
  '中途半端なロゴ帯', // LogoCloud: 1〜5社
  '実績数値に時点表記がありません', // StatsSection: asOf
];

const prodBundle = bundleFor('production');
const devBundle = bundleFor('development');
const missingInDev = DEV_WARNING_MARKERS.filter((m) => !devBundle.includes(m));

const checks = [
  [
    `dev 警告が development バンドルに残る（＝isDev が畳まれていない）${
      missingInDev.length ? ` / 欠落: ${missingInDev.join(', ')}` : ''
    }`,
    missingInDev.length === 0,
  ],
  [
    'production バンドルで process.env.NODE_ENV が置換される（＝isDev が false に畳まれ、警告は実行されない）',
    !prodBundle.includes('process.env.NODE_ENV'),
  ],
  ['SSR: data-brand が出力される', html.includes('data-brand="polastack"')],
  ['SSR: Netlify Forms 属性が出力される', html.includes('data-netlify="true"')],
  ['SSR: hidden form-name が出力される', html.includes('name="form-name"')],
  [
    'JS: CSS Modules のクラス名が空でない',
    /class="[^"]*container_container[^"]*"/.test(html),
  ],
  ['CSS: JS と同じハッシュ名を含む', css.includes('.container_container')],
  ['CSS: スロット定義を含む', css.includes('--color-bg-brand-primary')],
  ['CSS: 4ブランドのランプを含む', css.includes('--ramp-peerdesk-taxpeer-500')],
  ['CSS: フォント読み込みを含む', css.includes('fonts.googleapis.com')],
  ['CSS: Tailwind 構文が残っていない', !/^@theme \{/m.test(css) && !/^@custom-variant/m.test(css)],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`consumer-smoke: ${failed} 件失敗`);
  process.exit(1);
}
console.log('consumer-smoke: 全チェック通過');
