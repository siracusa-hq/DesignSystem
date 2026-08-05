import { defineConfig } from 'tsup';

export default defineConfig({
  // コンポーネント単位でエントリを分ける。
  // 1ファイルに固めると、トップレベルの cva() / forwardRef() 呼び出しを
  // バンドラが副作用ありと判断して落とせず、tree-shaking が効かなくなる。
  entry: [
    'src/index.ts',
    'src/tokens/index.ts',
    'src/slides.ts',
    'src/components/*/*/index.ts',
  ],
  format: ['esm'],
  // 型定義は公開エントリのみ。全エントリ分を生成するとメモリを使い切る。
  dts: {
    entry: {
      index: 'src/index.ts',
      'tokens/index': 'src/tokens/index.ts',
      slides: 'src/slides.ts',
    },
  },
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  // CSS Modules を esbuild の local-css で処理する。
  // これが無いと styles オブジェクトが {} になり、dist のコンポーネントが
  // 無スタイルで publish される（Slice 6 で発覚した事故。CSSファイルの存在
  // だけでなく JS 側のクラス名マッピングまで消費側スモークで検証すること）。
  loader: { '.css': 'local-css' },
  external: ['react', 'react-dom', 'shiki', 'spectacle'],
});
