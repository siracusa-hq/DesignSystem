/**
 * CSS Modules 契約テスト
 *
 * stylelint が「書いてはいけないもの」（生hex / --ramp-* 直参照）を落とすのに対し、
 * ここでは「存在しないものへの参照」を落とす:
 *   *.module.css 内の var(--x) は、theme.css / generated-brand.css /
 *   モジュール自身 のいずれかで定義されていなければならない。
 *   （タイポした変数は CSS ではエラーにならず、静かに初期値へフォールバックする）
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcRoot = resolve(process.cwd(), 'src');

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name.endsWith('.module.css')) yield p;
  }
}

function definedVars(css: string): Set<string> {
  const out = new Set<string>();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/gi) as Iterable<RegExpMatchArray>) {
    out.add(m[1]);
  }
  return out;
}

const themeVars = definedVars(readFileSync(join(srcRoot, 'styles/theme.css'), 'utf8'));
const brandVars = definedVars(readFileSync(join(srcRoot, 'styles/generated-brand.css'), 'utf8'));

describe('CSS Modules の var() 参照は既知のトークンのみ', () => {
  const files = [...walk(srcRoot)];

  it('少なくとも1つの module.css が存在する（walk の自壊検知）', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const short = file.slice(srcRoot.length + 1);
    it(short, () => {
      const css = readFileSync(file, 'utf8');
      const local = definedVars(css);
      const unknown: string[] = [];
      for (const m of css.matchAll(/var\(\s*(--[a-z0-9-]+)/gi) as Iterable<RegExpMatchArray>) {
        const name = m[1];
        if (!themeVars.has(name) && !brandVars.has(name) && !local.has(name)) {
          unknown.push(name);
        }
      }
      expect(unknown, `${short} が未定義のトークンを参照`).toEqual([]);
    });
  }
});
