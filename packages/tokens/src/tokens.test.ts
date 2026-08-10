/**
 * 基盤トークンの契約テスト
 *
 * `@siracusahq/tokens` はブランドカラーの唯一の正本であり、
 * 下流（業務システムUI / Web・LP / React非依存サイト）はここを信じる。
 * よって「AA を満たす前提」と「CSS変数版が同値である前提」は
 * 正本側で機械的に保証する。
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  colors,
  primary,
  brand,
  shadows,
  radii,
  duration,
  easing,
  fontFamily,
  fontWeight,
  resolveAllBrands,
} from './index';

/** sRGB 相対輝度（WCAG 2.x 定義） */
function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** コントラスト比（WCAG 2.x 定義） */
function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = '#ffffff';

describe('primary は操作用として WCAG AA を満たす', () => {
  it('primary-500 + 白文字が 4.5:1 以上（Button背景に直接使える）', () => {
    expect(contrastRatio(primary[500], WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it('primary-500 以降の暗いシェードも全て 4.5:1 以上', () => {
    for (const shade of [500, 600, 700, 800, 900, 950] as const) {
      expect(contrastRatio(primary[shade], WHITE), `primary-${shade}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('primary-500 は白背景上のリンク文字としても 4.5:1 以上', () => {
    expect(contrastRatio(primary[500], WHITE)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('brand は装飾専用（AA を満たさないことを明示的に固定する）', () => {
  it('brand-500 は白との対比が 4.5:1 未満 — 文字・ボタン背景に使ってはならない', () => {
    // これは「バグ」ではなく設計上の事実。
    // 誤って brand を操作UIに使う変更が入った際に、この期待値が
    // 「なぜ使ってはいけないか」を示す。
    expect(contrastRatio(brand[500], WHITE)).toBeLessThan(4.5);
  });

  it('primary と brand は同一色相帯（ブランドとして一つの色に見える）', () => {
    // H≈173 の明度違い。色相が離れると別ブランドに見えるため範囲を固定する。
    const hue = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max === min) return 0;
      const d = max - min;
      const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return (((h * 60) % 360) + 360) % 360;
    };
    expect(Math.abs(hue(primary[500]) - hue(brand[500]))).toBeLessThan(10);
  });
});

describe('brand.css（React非依存サイト向け CSS変数版）が TS 定数と一致', () => {
  const cssPath = fileURLToPath(new URL('../css/brand.css', import.meta.url));
  const css = readFileSync(cssPath, 'utf8');

  const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

  /**
   * テーマ契約層（層2・層3）の変数は brand-contract.test.ts が検証するため、
   * ここでは骨格トークン（層1）のみを対象にする。
   * 除外: 抽象スロット（--color-bg-brand-* 等）とグロー（--shadow-glow-brand*）。
   * 注意: --color-brand-500 のような装飾スケール（層1）は除外しない。
   */
  const isContractVar = (full: string) =>
    /^(bg|text|border|ring|decor|on)-(brand|cta)/.test(full) || /^glow-brand/.test(full);

  function cssVars(prefix: string): Map<string, string> {
    const re = new RegExp(`--${prefix}-([a-z0-9-]+)\\s*:\\s*([^;]+);`, 'gi');
    const found = new Map<string, string>();
    for (const match of css.matchAll(re)) {
      if (isContractVar(match[1])) continue;
      found.set(match[1], normalize(match[2]));
    }
    return found;
  }

  it('brand.css に書かれたカラー変数は全て TS 定数と同値', () => {
    const declared = cssVars('color');
    const mismatches: string[] = [];

    for (const [key, cssValue] of declared) {
      const separator = key.lastIndexOf('-');
      const scale = key.slice(0, separator) as keyof typeof colors;
      const shade = key.slice(separator + 1);
      const expected = (colors[scale] as Record<string, string> | undefined)?.[shade];
      if (expected !== cssValue) {
        mismatches.push(`--color-${key}: ${cssValue} (TS: ${expected ?? '未定義'})`);
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('primary / brand / neutral は全シェードが CSS 側にも存在する', () => {
    const declared = cssVars('color');
    for (const scale of ['primary', 'brand', 'neutral'] as const) {
      for (const shade of Object.keys(colors[scale])) {
        expect(declared.has(`${scale}-${shade}`), `--color-${scale}-${shade}`).toBe(true);
      }
    }
  });

  it('shadows / radii / duration / easing も同値', () => {
    const toCssKey = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

    expect(Object.fromEntries(cssVars('shadow'))).toEqual(
      Object.fromEntries(Object.entries(shadows).map(([k, v]) => [k, normalize(v)])),
    );
    expect(Object.fromEntries(cssVars('radius'))).toEqual(radii);
    expect(Object.fromEntries(cssVars('duration'))).toEqual(duration);
    expect(Object.fromEntries(cssVars('easing'))).toEqual(
      Object.fromEntries(Object.entries(easing).map(([k, v]) => [toCssKey(k), normalize(v)])),
    );
  });

  it('フォント変数も同値', () => {
    const fonts = cssVars('font');
    expect(fonts.get('sans')).toBe(fontFamily.sans);
    expect(fonts.get('mono')).toBe(fontFamily.mono);
    for (const [key, value] of Object.entries(fontWeight)) {
      expect(fonts.get(`weight-${key}`), `--font-weight-${key}`).toBe(value);
    }
  });
});

describe('ブランドランプ 700 段は eyebrow 文字として WCAG AA を満たす', () => {
  /* ui-web の Eyebrow（18px/700 = WCAG の通常文字扱い）は
     --color-text-brand-strong（各ブランド 700 段）を文字色に使う。
     500 段は沈んだ面 #fafafa で 4.36:1（corporate）と AA 未達のため 700 段にした
     （docs/research/research-eyebrow.md の発見。jsdom の axe は色計算不能で
     この種の欠陥を検出できないため、ここで実値検査する） */
  const SUNKEN = '#fafafa';
  it.each(resolveAllBrands().map((b) => [b.dataBrand, b.ramp[700]] as const))(
    '%s の 700 段 × 沈んだ面が 4.5:1 以上',
    (_brand, hex) => {
      expect(contrastRatio(hex, SUNKEN)).toBeGreaterThanOrEqual(4.5);
    },
  );
});
