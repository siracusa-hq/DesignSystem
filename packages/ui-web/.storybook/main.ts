import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const tailwindcss = await import('@tailwindcss/vite');
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss.default());
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    // サブディレクトリ配信（GitHub Pages の /web/ 等）では asset パスに
    // base を焼き込む必要がある。scripts/build-storybook.mjs が指定する。
    if (process.env.STORYBOOK_BASE) {
      config.base = process.env.STORYBOOK_BASE;
    }
    /* Storybook のビルド版でも dev 検査（Patterns/規範ガード）を残す。
       `storybook build` は production ビルドなので、既定だと
       `src/lib/dev.ts` の isDev が false に畳まれ、規範ガードの警告が
       コードごと消える（= デプロイ版の Storybook では何も出ない）。
       Storybook は配布物ではなくカタログなので、ここだけ development 扱いにする。
       npm パッケージ本体（tsup ビルド）はこの define の影響を受けない。 */
    config.define = { ...config.define, 'process.env.NODE_ENV': JSON.stringify('development') };
    return config;
  },
};

export default config;
