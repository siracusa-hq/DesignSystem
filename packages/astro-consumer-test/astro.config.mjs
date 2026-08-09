// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

/**
 * 消費側の最小構成。**integrations を足さないこと。**
 *
 * このアプリの目的は「DS が Astro のビルド経路を素通りできるか」の検証であり、
 * 消費側の設定で問題を回避できてしまうと検査にならない。
 * output は既定の静的（SSG）。アダプタは要らない。
 */
export default defineConfig({
  integrations: [react()],
});
