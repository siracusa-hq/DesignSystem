import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * ページ単位 VRT の設定（stage5-workorder.md §3）。
 *
 * 裁定者は CI（Linux + Playwright 同梱 Chromium）。基準 PNG は devcontainer で生成して
 * コミットする（更新は `pnpm vrt:update`）。
 *
 * 環境差の吸収は「Chromium のバージョン固定（Playwright 同梱）」「フォントを Google Fonts の
 * webfont に固定」「ヒンティング・LCD 描画・Skia の実行時最適化を無効化」の3点で行う。
 * この構成なら Debian 13/arm64（devcontainer）と Ubuntu 24.04 の arm64・amd64 で
 * 同じ PNG になることを実測済み（stage5-workorder.md §7-2）。
 */

const here = dirname(fileURLToPath(import.meta.url));
/** リポジトリルート（packages/ui-web/vrt → ../../..） */
const repoRoot = resolve(here, '../../..');
export const STORYBOOK_DIR = resolve(repoRoot, 'storybook-static/web');

/** 6006（app Storybook）/ 6007（web Storybook）と衝突しない番号 */
const PORT = 6107;

export default defineConfig({
  testDir: here,
  /* 基準 PNG は1箇所に集約する（vrt/__screenshots__/<project>/<story>.png） */
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  /* 1ページのフルページ撮影は重い（最長ケースで縦 1 万 px 級）。
     タイムアウトは撮影 + フォント待ち + スクロール走査の合計に耐える値 */
  timeout: 90_000,
  fullyParallel: true,
  /* 落ちたら落ちたままにする。リトライは「たまに緑になる VRT」を作り、
     結果として誰も差分を見なくなる（workorder §3） */
  retries: 0,
  /* 並列度を CPU 数に任せると撮影中の描画負荷が変動する。2 に固定して
     ローカルと CI で条件を揃える */
  workers: 2,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: resolve(here, 'report'), open: 'never' }]]
    : [['list']],
  outputDir: resolve(here, 'test-results'),

  expect: {
    toHaveScreenshot: {
      /* threshold は「1ピクセルを差分とみなす色距離」（0〜1、既定 0.2）。
         フォントのアンチエイリアスは 0.1 程度に収まるため、既定より締める。 */
      threshold: 0.1,
      /* 許容する差分ピクセル総数。1文字ぶんの字送りズレでも数百 px の差が出るので、
         100 は「アンチエイリアスだけ許して、レイアウト変化は必ず捕まえる」水準。
         比率（maxDiffPixelRatio）で持つとページが縦に長いほど許容が増えて緩むため使わない。 */
      maxDiffPixels: 100,
    },
  },

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    /* アニメーション・カウントアップの停止（theme.css の
       @media (prefers-reduced-motion: reduce) が duration を 1ms に落とす） */
    reducedMotion: 'reduce',
    colorScheme: 'light',
    /* 和文組版（:lang(ja)）と Intl.NumberFormat の桁区切りを固定する */
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    deviceScaleFactor: 1,
    launchOptions: {
      args: [
        /* ヒンティングとサブピクセル描画は OS のフォント設定に左右される。
           両方切って、環境差でグリフのラスタライズが変わるのを防ぐ */
        '--font-render-hinting=none',
        '--disable-lcd-text',
        /* 色プロファイルの既定はディスプレイ依存。sRGB に固定 */
        '--force-color-profile=srgb',
        /* Skia の実行時最適化（CPU 命令セットによる分岐）を無効化 */
        '--disable-skia-runtime-opts',
      ],
    },
  },

  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],

  webServer: {
    command: `node ${resolve(here, 'serve.mjs')} ${STORYBOOK_DIR} ${PORT}`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
