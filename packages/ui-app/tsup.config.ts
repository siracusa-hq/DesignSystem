import { defineConfig } from 'tsup';

export default defineConfig({
  // コンポーネント単位でエントリを分ける。
  // 1ファイルに固めると、トップレベルの cva() / forwardRef() 呼び出しを
  // バンドラが副作用ありと判断して落とせず、tree-shaking が効かなくなる。
  // （Button を1つ import しただけで 137kB 配信されていた）
  entry: ['src/index.ts', 'src/tokens/index.ts', 'src/components/*/index.ts'],
  format: ['esm'],
  // 型定義は公開エントリの2つだけでよい。全エントリ分を生成すると
  // メモリを使い切って OOM で落ちる。利用者は index / tokens からしか import しない。
  dts: {
    entry: {
      index: 'src/index.ts',
      'tokens/index': 'src/tokens/index.ts',
    },
  },
  sourcemap: true,
  clean: true,
  // 共通コードをチャンクに切り出す。これにより dist/index.js が
  // 薄い再エクスポートになり、必要なチャンクだけが読まれる。
  splitting: true,
  treeshake: true,
  external: ['react', 'react-dom', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
});
