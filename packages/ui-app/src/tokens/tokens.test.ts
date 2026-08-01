/**
 * トークン ⇄ CSS変数 のドリフト検出テスト
 *
 * Tailwind v4 の `@theme` は CSS 変数の実体宣言を要求するため、
 * `@polastack/tokens` の値は styles/tokens.css にも展開されている。
 * この二重定義が静かにズレると「ブランドカラーが分岐したまま2ヶ月放置」
 * （PR #99 の発端）が再発するため、CI で機械的に突き合わせる。
 *
 * 検証は双方向:
 *   1. TS トークンの全エントリが CSS に同値で存在する
 *   2. CSS の該当変数に TS 側の対応物がある（CSS だけに増える定義を防ぐ）
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { colors, shadows, radii, duration, easing } from './index';

// パスはパッケージルート（= vitest の cwd）基準で解決する。
// このテストは environment: 'jsdom' で走るため `import.meta.url` が
// file: スキームにならず、fileURLToPath が ERR_INVALID_URL_SCHEME で落ちる。
const css = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/** 空白を正規化して比較する（CSS 整形差でテストが落ちないように） */
const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

/** `--<prefix>-<key>: <value>;` を全て拾う */
function cssVars(prefix: string): Map<string, string> {
  const re = new RegExp(`--${prefix}-([a-z0-9-]+)\\s*:\\s*([^;]+);`, 'gi');
  const found = new Map<string, string>();
  for (const match of css.matchAll(re)) {
    found.set(match[1], normalize(match[2]));
  }
  return found;
}

const COLOR_SCALES = Object.keys(colors) as (keyof typeof colors)[];

describe('カラートークンと CSS 変数の一致', () => {
  const declared = cssVars('color');

  it.each(COLOR_SCALES)('%s スケールの全シェードが CSS と同値', (scale) => {
    for (const [shade, value] of Object.entries(colors[scale])) {
      expect(declared.get(`${scale}-${shade}`), `--color-${scale}-${shade}`).toBe(value);
    }
  });

  it('CSS にだけ存在するカラースケールがない', () => {
    const known = new Set(
      COLOR_SCALES.flatMap((scale) =>
        Object.keys(colors[scale]).map((shade) => `${scale}-${shade}`),
      ),
    );
    const scalePrefixes = COLOR_SCALES.map((s) => `${s}-`);
    const orphans = [...declared.keys()].filter(
      (key) => scalePrefixes.some((p) => key.startsWith(p)) && !known.has(key),
    );
    expect(orphans).toEqual([]);
  });

  it('装飾用 brand スケールは業務システムUIには存在しない', () => {
    // brand（#13c3a0系）は明背景での対比が 2.25:1 しかなく、
    // 業務システムUIの操作要素に混入させてはならない。
    expect(COLOR_SCALES).not.toContain('brand');
    expect(css).not.toMatch(/--color-brand-\d/);
  });
});

describe('エレベーション・モーショントークンと CSS 変数の一致', () => {
  it('shadows', () => {
    const declared = cssVars('shadow');
    expect(Object.fromEntries([...declared].map(([k, v]) => [k, v]))).toEqual(
      Object.fromEntries(Object.entries(shadows).map(([k, v]) => [k, normalize(v)])),
    );
  });

  it('radii', () => {
    const declared = cssVars('radius');
    expect(Object.fromEntries(declared)).toEqual(radii);
  });

  it('duration', () => {
    const declared = cssVars('duration');
    expect(Object.fromEntries(declared)).toEqual(duration);
  });

  it('easing', () => {
    // TS は camelCase (inOut)、CSS は kebab-case (--ease-in-out)
    const toCssKey = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    const declared = cssVars('ease');
    const expected = Object.fromEntries(
      Object.entries(easing).map(([k, v]) => [toCssKey(k), normalize(v)]),
    );
    expect(Object.fromEntries(declared)).toEqual(expected);
  });
});
