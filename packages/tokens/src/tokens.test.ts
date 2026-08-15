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

describe('ブランド濃色面の上でブランド色をアクセントに使わない', () => {
  /* ContentHub の入口タイル（tone="brand"）は 800 段の面を持つ。
     そこへ 300 段（暗面用のブランドアクセント）を文字色に置く形は採らない。

     理由は2つ。①面そのものがブランド色である以上、同系色のアクセントは前に出ない。
     ②**ブランドによっては AA を割る** — corporate は 4.42:1 で 14px/700 の文字では
     AA（4.5:1）に届かない（2026-08-16 の指摘で発覚）。全ブランドで安全ではない
     組み合わせをシステムの既定にはできない。

     代わりに面の前景色（neutral-50）を使う。こちらは全ブランドで AA を満たす。
     jsdom の axe は色計算ができずこの種の欠陥を検出できないため、ここで実値検査する。 */
  const FOREGROUND = '#fafafa';

  it('800 段の面 × 300 段の文字は、少なくとも1ブランドで AA を割る（だから使わない）', () => {
    const failing = resolveAllBrands().filter(
      (b) => contrastRatio(b.ramp[300], b.ramp[800]) < 4.5,
    );
    expect(failing.length).toBeGreaterThan(0);
  });

  it.each(resolveAllBrands().map((b) => [b.dataBrand, b.ramp[800]] as const))(
    '%s: 800 段の面 × 前景色（neutral-50）は AA を満たす',
    (_brand, surface) => {
      expect(contrastRatio(FOREGROUND, surface)).toBeGreaterThanOrEqual(4.5);
    },
  );
});

describe('LP のティント面（白 50% + ramp-50）は実測レンジに収まる', () => {
  /* ui-web の Page が LP パターンで使う面（--color-surface-tinted =
     color-mix(in srgb, #ffffff 50%, var(--color-bg-brand-subtle))）の検証。

     根拠: 国内 BtoB SaaS 8 サイトの面交替は対比 1.04〜1.12:1、中央値 1.07:1
     （SmartHR #f4f8f9 = 1.069、マネーフォワード #f2f5ff = 1.089、
     Chatwork #f7f1e7 = 1.124、ANDPAD #f9f9f9 = 1.053。
     docs/research/research-eyebrow.md §4-3）。
     ramp-50 を素で使うと CTABand の面（--color-bg-brand-subtle = ramp-50）と
     1.000:1 で完全に衝突するため、白で半分に薄めて 3 段の等間隔を作っている。

     jsdom の axe は色計算ができずコントラスト違反を検出できないので、
     面の値を変えるときはここが唯一の検査になる（ルート CLAUDE.md の規定）。 */

  /** sRGB ガンマ空間での混合（CSS の color-mix(in srgb, …) と同じ） */
  function mixSrgb(a: string, b: string, ratioA: number): string {
    const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
    return (
      '#' +
      [1, 3, 5]
        .map((i) => Math.round(channel(a, i) * ratioA + channel(b, i) * (1 - ratioA)))
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
    );
  }

  const cases = resolveAllBrands().map(
    (b) => [b.dataBrand, mixSrgb(WHITE, b.ramp[50], 0.5), b.ramp[50]] as const,
  );

  it.each(cases)('%s のティント面 %s は白との対比が実測レンジ内（1.04〜1.12:1）', (_b, tint) => {
    const ratio = contrastRatio(tint, WHITE);
    expect(ratio).toBeGreaterThanOrEqual(1.04);
    expect(ratio).toBeLessThanOrEqual(1.12);
  });

  it.each(cases)(
    '%s のティント面 %s は CTABand の面（ramp-50）とも 1.05:1 以上の差を持つ',
    (_b, tint, subtle) => {
      expect(contrastRatio(tint, subtle)).toBeGreaterThanOrEqual(1.05);
    },
  );

  it.each(cases)('%s のティント面 %s の上で本文（neutral-900）が 4.5:1 以上', (_b, tint) => {
    expect(contrastRatio(tint, colors.neutral[900])).toBeGreaterThanOrEqual(4.5);
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
