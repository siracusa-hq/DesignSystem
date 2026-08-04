import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    // CSS Modules のクラス名をテストでも実名で解決させる
    // （既定だと {} になり className が undefined になる）
    modules: { classNameStrategy: 'non-scoped' },
  },
  test: {
    css: { modules: { classNameStrategy: 'non-scoped' } },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
