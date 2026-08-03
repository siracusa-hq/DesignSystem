/**
 * 色空間変換・WCAGコントラストのユーティリティ（依存なし）
 *
 * docs/research/ramp-gen/color.js（プロトタイプ・検証済み）からの移植。
 * 扱う空間: sRGB(hex) <-> linear sRGB <-> OKLab/OKLCH
 *
 * 参照:
 *   OKLab: Björn Ottosson の定義（https://bottosson.github.io/posts/oklab/）
 *   コントラスト比: WCAG 2.x
 */

export type Rgb = [number, number, number];
export interface Oklch {
  L: number;
  C: number;
  H: number;
}

/** '#rrggbb' -> [0..1, 0..1, 0..1]（ガンマ付き） */
export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

/** [0..1]^3（ガンマ付き）-> '#rrggbb'。範囲外は clamp */
export function rgbToHex(rgb: Rgb): string {
  return (
    '#' +
    rgb
      .map((c) => {
        const v = Math.round(Math.min(1, Math.max(0, c)) * 255);
        return v.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function linearToOklab([r, g, b]: Rgb): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToLinear([L, a, b]: [number, number, number]): Rgb {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** '#rrggbb' -> { L, C, H }（L: 0..1, C: 0..~0.4, H: 0..360） */
export function hexToOklch(hex: string): Oklch {
  const [L, a, b] = linearToOklab(hexToRgb(hex).map(toLinear) as Rgb);
  const C = Math.hypot(a, b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

function oklchToLinear({ L, C, H }: Oklch): Rgb {
  const rad = (H * Math.PI) / 180;
  return oklabToLinear([L, C * Math.cos(rad), C * Math.sin(rad)]);
}

const IN_GAMUT_EPS = 1e-6;
const inGamut = (lin: Rgb) => lin.every((c) => c >= -IN_GAMUT_EPS && c <= 1 + IN_GAMUT_EPS);

/** その (L, H) で sRGB に収まる最大彩度を二分探索で求める */
export function maxChroma(L: number, H: number, hi = 0.45): number {
  if (!inGamut(oklchToLinear({ L, C: 0, H }))) return 0;
  let lo = 0;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear({ L, C: mid, H }))) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * OKLCH -> hex。sRGB 色域外なら L と H を保ったまま C だけを落として収める
 * （CSS Color 4 の gamut mapping と同方針。明度と色相は絶対に変えない）。
 */
export function oklchToHex({ L, C, H }: Oklch): { hex: string; clipped: number; chroma: number } {
  const lin = oklchToLinear({ L, C, H });
  if (inGamut(lin)) {
    return { hex: rgbToHex(lin.map(toGamma) as Rgb), clipped: 0, chroma: C };
  }
  const cMax = maxChroma(L, H, C);
  const mapped = oklchToLinear({ L, C: cMax, H });
  return { hex: rgbToHex(mapped.map(toGamma) as Rgb), clipped: C - cMax, chroma: cMax };
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** '#rrggbb' -> 'r g b'（CSS の rgb(r g b / a) 用） */
export function hexToRgbTriplet(hex: string): string {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(' ');
}
