/**
 * トークン ⇄ CSS変数 のドリフト検出テスト
 *
 * Tailwind v4 の `@theme` は CSS 変数の実体宣言を要求するため、
 * `@siracusahq/tokens` の値は styles/theme.css にも展開されている。
 * この二重定義が静かにズレると「GTM側だけブランドカラーが古いまま」
 * （PR #99 の発端。約2ヶ月間 WCAG AA 不適合が放置された）が再発するため、
 * CI で機械的に突き合わせる。
 *
 * 検証は双方向:
 *   1. TS トークンの全エントリが CSS に同値で存在する
 *   2. CSS の該当変数に TS 側の対応物がある（CSS だけに増える定義を防ぐ）
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { colors, shadows, radii, duration, easing } from './index';

// パスはパッケージルート（= vitest の cwd）基準で解決する。
// このテストは environment: 'jsdom' で走るため `import.meta.url` が
// file: スキームにならず、fileURLToPath が ERR_INVALID_URL_SCHEME で落ちる。
const css = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8');

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

  it('primary は業務システムUI（@siracusahq/design-system）と同一アンカー', () => {
    // 両デザインシステムが同じ @siracusahq/tokens を参照している証跡。
    // ここが #13c3a0 に戻ったら分岐の再発。
    expect(colors.primary[500]).toBe('#008575');
    expect(colors.brand[500]).toBe('#13c3a0');
  });
});

describe('エレベーション・モーショントークンと CSS 変数の一致', () => {
  it('shadows', () => {
    const declared = cssVars('shadow');
    expect(Object.fromEntries(declared)).toEqual(
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

describe('装飾用 brand スケールの誤用防止', () => {
  const componentsDir = resolve(process.cwd(), 'src/components');

  function collectSources(dir: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) Object.assign(out, collectSources(full));
      else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.test.tsx')) {
        out[full] = readFileSync(full, 'utf8');
      }
    }
    return out;
  }

  const componentSources = collectSources(componentsDir);

  it('brand スケールを文字色・ボタン背景に使っていない', () => {
    // brand-500 は白背景 2.25:1 / 白文字 2.25:1 で AA を満たさないため、
    // text-brand-* と bg-brand-<500以上> は使用禁止。
    // 許可されるのは装飾（グラデーション停止点・薄い面・ボーダー）のみ。
    const violations: string[] = [];
    const forbidden = /\b(text-brand-\d+|bg-brand-(?:[5-9]00|950)\b)/g;

    for (const [file, source] of Object.entries(componentSources)) {
      for (const match of source.matchAll(forbidden)) {
        violations.push(`${file}: ${match[0]}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
