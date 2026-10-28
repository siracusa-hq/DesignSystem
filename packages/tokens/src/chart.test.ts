/**
 * グラフの色の検査 — spec §12 Q15（決め方は chart.ts）
 *
 * どのブランドも、明るい画面・暗い画面の両方で、棒・積み上げ・線（隣り合う色）と、
 * 散布図など（先頭 3 色のすべての組み合わせ）の基準に通ること。新しいブランドを足してここで落ちたら、
 * CHART_POOL を検査を流しながら選び直す（値を手で寄せない）。
 */

import { describe, expect, it } from 'vitest';

import { error, success, warning } from './colors';
import { hexToOklch } from './color';
import { resolveAllBrands } from './brand-registry';
import {
  CHART_ACHROMATIC_C,
  CHART_CVD_MIN,
  CHART_HUE_GAP,
  CHART_NORMAL_MIN,
  CHART_POOL,
  CHART_SLOTS,
  chartDeltaE,
  chartPaletteFor,
  checkCategorical,
} from './chart';

const brands = resolveAllBrands();
const hueDist = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

describe('グラフの色 — どのブランドも検査に通る', () => {
  for (const b of brands) {
    const p = chartPaletteFor(b.ramp[500]);
    for (const mode of ['light', 'dark'] as const) {
      it(`${b.key} ${mode}: 隣り合う色（棒・積み上げ・線）`, () => {
        const r = checkCategorical(p[mode], mode);
        expect(r.problems).toEqual([]);
        expect(r.cvd).toBeGreaterThanOrEqual(CHART_CVD_MIN);
        expect(r.normal).toBeGreaterThanOrEqual(CHART_NORMAL_MIN);
      });
      it(`${b.key} ${mode}: 先頭 3 色のすべての組み合わせ（散布図など）`, () => {
        const r = checkCategorical(p[mode].slice(0, 3), mode, 'all');
        expect(r.cvd).toBeGreaterThanOrEqual(CHART_CVD_MIN);
        expect(r.normal).toBeGreaterThanOrEqual(CHART_NORMAL_MIN);
      });
    }
  }
});

describe('グラフの色 — 決め方の規則', () => {
  it('5 色ずつ・淡い面も同じ数', () => {
    for (const b of brands) {
      const p = chartPaletteFor(b.ramp[500]);
      for (const list of [p.light, p.dark, p.lightSubtle, p.darkSubtle]) expect(list).toHaveLength(CHART_SLOTS);
    }
  });

  it('1 色目はブランドの色相（無彩色のブランドは候補の先頭から）', () => {
    for (const b of brands) {
      const brand = hexToOklch(b.ramp[500]);
      const p = chartPaletteFor(b.ramp[500]);
      if (brand.C < CHART_ACHROMATIC_C) {
        expect(p.keys[0], b.key).toBe(CHART_POOL[0].key);
        continue;
      }
      expect(p.keys[0]).toBe('brand');
      for (const mode of ['light', 'dark'] as const) {
        expect(hueDist(hexToOklch(p[mode][0]).H, brand.H), `${b.key} ${mode}`).toBeLessThan(3);
      }
    }
  });

  it('2 色目以降は候補の決まった順で使い、ブランドの色相に近い候補を飛ばす（通らないときだけ、順を保って飛ばす色を増やす）', () => {
    for (const b of brands) {
      const brand = hexToOklch(b.ramp[500]);
      const achromatic = brand.C < CHART_ACHROMATIC_C;
      const candidates = CHART_POOL.filter((c) => achromatic || hueDist(hexToOklch(c.light).H, brand.H) >= CHART_HUE_GAP).map((c) => c.key);
      const keys = chartPaletteFor(b.ramp[500]).keys.slice(achromatic ? 0 : 1);
      // 候補の部分列で、順を保っている
      let at = -1;
      for (const k of keys) {
        const idx = candidates.indexOf(k as (typeof candidates)[number]);
        expect(idx, `${b.key}: ${k}`).toBeGreaterThan(at);
        at = idx;
      }
    }
  });

  it('ブランドごとの並び（変わったら、使っている画面のグラフの色が変わる。意図した変更か確かめる）', () => {
    const got = Object.fromEntries(brands.map((b) => [b.key, chartPaletteFor(b.ramp[500]).keys.join('>')]));
    expect(got).toEqual({
      corporate: 'brand>slate>amber>rose>violet',
      polastack: 'brand>amber>rose>violet>teal',
      proofline: 'brand>amber>rose>violet>teal',
      'out-reacher': 'brand>amber>teal>orange>magenta',
      'ad-operator': 'brand>amber>rose>violet>teal',
      'content-maker': 'brand>slate>amber>violet>teal',
      peerdesk: 'slate>amber>rose>violet>teal',
      'peerdesk-taxpeer': 'brand>slate>amber>rose>violet',
    });
  });

  it('候補の並びは変えない（並びが見分けやすさを保つ。変えるなら検査を流してから）', () => {
    expect(CHART_POOL.map((c) => c.key)).toEqual(['slate', 'amber', 'rose', 'violet', 'teal', 'orange', 'magenta']);
  });

  it('候補は状態の色（成功・注意・エラー）と紛れない（ΔE >= 7）', () => {
    const status = [success[500], success[600], warning[500], warning[600], error[500], error[600]];
    for (const c of CHART_POOL) {
      for (const hex of [c.light, c.dark]) {
        for (const s of status) expect(chartDeltaE(hex, s), `${c.key} ${hex} と ${s}`).toBeGreaterThanOrEqual(7);
      }
    }
  });
});
