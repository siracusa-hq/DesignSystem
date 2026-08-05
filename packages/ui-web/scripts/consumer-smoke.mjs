/**
 * 消費側スモークテスト — 「配布物が消費側で本当に動くか」を CI で検証する。
 *
 * Storybook でも vitest でも見えない事故を止める最後の砦:
 *   - dist の JS が SSR（renderToString）でクラッシュしない
 *   - CSS Modules のクラス名マッピングが空でない（Slice 6 で実際に発覚した事故:
 *     tsup 設定不備で styles が {} になり、dist が無スタイルだった）
 *   - dist/styles.css が JS 側と同じハッシュ名を含み、Tailwind 構文が残っていない
 *   - Netlify Forms の属性が SSR 出力に含まれる
 */

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

const checks = [
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
