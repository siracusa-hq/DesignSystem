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
        // --radix-* は Radix UI が実行時に注入する変数（トリガー幅・可用高さ等）で、
        // テーマ契約の対象外。SelectField が使用する
        if (name.startsWith('--radix-')) continue;
        if (!themeVars.has(name) && !brandVars.has(name) && !local.has(name)) {
          unknown.push(name);
        }
      }
      expect(unknown, `${short} が未定義のトークンを参照`).toEqual([]);
    });
  }
});

describe('セクション配下の部品は --color-surface を自分の背景に使わない', () => {
  /* `<Page>` の面スロット（.slotMuted / .slotTinted）は **--color-surface を
     再定義する**ことで面を塗る。そのため、スロットの内側にある部品が自分の背景に
     --color-surface を使うと、面と同じ色になって沈む（カードが消える）。
     実際 2026-08-16 に「コーポレートトップの事業内容カードが背景色になっている」
     として発見された。ティント導入で色が付いて見えるようになったが、
     ニュートラルの muted 面でも同じことが起きていた（カードが #f4f4f5 になる）。

     浮いている面には --color-surface-raised を使うこと。**暗面でも正しく効く** —
     Section の .bgDark は surface と raised の両方を暗い値へ振り替えている
     （section.module.css の .bgDark）。

     対象外はスロットの外側にあるものだけ:
     - primitives/section: .bgDefault は「面そのもの」の定義
     - layout/*: ヘッダー・フッター・固定オーバーレイは <Page> の外に出る */
  const ALLOWED = ['components/primitives/section/section.module.css'];

  const offenders = [...walk(srcRoot)]
    .map((f) => f.slice(srcRoot.length + 1).replaceAll('\\', '/'))
    .filter((short) => !short.startsWith('components/layout/'))
    .filter((short) => !ALLOWED.includes(short))
    .filter((short) => /background(-color)?:\s*var\(--color-surface\)\s*;/.test(readFileSync(join(srcRoot, short), 'utf8')));

  it('スロット内の部品に --color-surface 背景は無い（浮く面は raised を使う）', () => {
    expect(offenders).toEqual([]);
  });
});
