/**
 * グラフの色（カテゴリ = 系列の見分け）— 2026-10-27（spec §12 Q15）
 *
 * 決め方:
 *   - 1 色目はブランドの色相。グラフ向けの明るさ・彩度に合わせて作る（ブランドの 500 そのものではない。
 *     500 は彩度が低い・暗すぎるブランドが多く、グラフの検査に通らないため）
 *   - 2 色目以降は CHART_POOL を決まった順で使い、ブランドの色相から CHART_HUE_GAP 未満の候補は飛ばす。
 *     その並びが検査に通らないときだけ、候補の順を保ったまま飛ばす色を増やし、最初に通る並びを使う（2026-10-27。Out Reacher の紫とスレートの青）
 *   - 色相がない（無彩色の）ブランドは、1 色目から CHART_POOL を使う
 *   - CHART_POOL の値は、この規則で全ブランドが下の検査に通るように選んだ（値は手で直さない。直すなら検査を流す）
 *
 * 検査（checkCategorical。どのブランドも明るい画面・暗い画面の両方で通ること。テストで確かめる）:
 *   - 明るさの帯: OKLCH L が明るい画面 0.43〜0.77・暗い画面 0.48〜0.67
 *   - 彩度の下限: OKLCH C >= 0.10（下回ると灰色に見え、見分けに使えない）
 *   - 地とのコントラスト: 3:1 以上（明るい画面 #ffffff・暗い画面 #1C1C1F）
 *   - 隣り合う色の差: 色覚の多様性（1 型・2 型。Machado ほか 2009・強度 1.0 のシミュレーション）で ΔE >= 8、
 *     そのままの見え方で ΔE >= 15（ΔE は OKLab の距離 ×100）
 *   - 散布図など、どの 2 色も隣り合いうるグラフ向けに、先頭 3 色はすべての組み合わせで同じ基準に通る
 *     （4 系列以上の散布図は「その他」にまとめるか、グラフを分ける）
 */

import { contrastRatio, hexToLinear, hexToOklch, linearToOklab, maxChroma, oklchToHex, type Rgb } from './color';

export const CHART_SLOTS = 5;
/** ブランドの色相からこれ未満の候補は飛ばす（度） */
export const CHART_HUE_GAP = 40;
/** これ未満の彩度のブランドは色相がないとみなす */
export const CHART_ACHROMATIC_C = 0.03;
export const CHART_SURFACE = { light: '#ffffff', dark: '#1C1C1F' } as const;
export const CHART_L_BAND = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const;
export const CHART_CHROMA_FLOOR = 0.1;
export const CHART_MIN_CONTRAST = 3;
export const CHART_CVD_MIN = 8;
export const CHART_NORMAL_MIN = 15;

export type ChartMode = 'light' | 'dark';

/** 2 色目以降の候補（この順で使う）。hue は OKLCH の色相 */
export const CHART_POOL = [
  { key: 'slate', label: 'スレートの青', light: '#026abe', dark: '#3c95f0' },
  { key: 'amber', label: '琥珀', light: '#a87502', dark: '#a87502' },
  { key: 'rose', label: 'ローズ', light: '#be425f', dark: '#e1627c' },
  { key: 'violet', label: 'スミレ', light: '#733699', dark: '#9d60c6' },
  { key: 'teal', label: 'ティール', light: '#049b8b', dark: '#04a291' },
  { key: 'orange', label: '橙', light: '#ba5002', dark: '#ca5b10' },
  { key: 'magenta', label: 'マゼンタ', light: '#b54d98', dark: '#d066b1' },
] as const;

/** 1 色目（ブランドの色相）の明るさの候補。検査の余裕がいちばん大きいものを選ぶ（同点なら先のもの） */
const BRAND_SLOT_L = { light: [0.46, 0.5, 0.54, 0.58, 0.62], dark: [0.6, 0.63, 0.67] } as const;
const MAX_CHROMA = 0.16;

// Machado, Oliveira & Fernandes (2009)・強度 1.0（linear sRGB に掛ける）
const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
} as const;

const clamp01 = (c: number) => Math.max(0, Math.min(1, c));
function simulate(lin: Rgb, kind: keyof typeof MACHADO): Rgb {
  const M = MACHADO[kind];
  return M.map((row) => clamp01(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2])) as Rgb;
}
/** OKLab の距離 ×100。kind なしはそのままの見え方 */
export function chartDeltaE(a: string, b: string, kind?: keyof typeof MACHADO): number {
  const la = hexToLinear(a);
  const lb = hexToLinear(b);
  const x = linearToOklab(kind ? simulate(la, kind) : la);
  const y = linearToOklab(kind ? simulate(lb, kind) : lb);
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

export interface ChartCheck {
  /** 帯・彩度・コントラストがすべて通るか */
  inGamutOk: boolean;
  problems: string[];
  /** 隣り合う色（または all のときすべての組み合わせ）の、色覚シミュレーションでの最小の差 */
  cvd: number;
  /** そのままの見え方での最小の差 */
  normal: number;
}

/** カテゴリの色の並びを検査する。pairs: 'adjacent'（棒・積み上げ・線）| 'all'（散布図など） */
export function checkCategorical(hexes: readonly string[], mode: ChartMode, pairs: 'adjacent' | 'all' = 'adjacent'): ChartCheck {
  const problems: string[] = [];
  const [lo, hi] = CHART_L_BAND[mode];
  for (const h of hexes) {
    const { L, C } = hexToOklch(h);
    if (L < lo || L > hi) problems.push(`${h}: L ${L.toFixed(3)} が帯 ${lo}〜${hi} の外`);
    if (C < CHART_CHROMA_FLOOR) problems.push(`${h}: C ${C.toFixed(3)} < ${CHART_CHROMA_FLOOR}`);
    const cr = contrastRatio(h, CHART_SURFACE[mode]);
    if (cr < CHART_MIN_CONTRAST) problems.push(`${h}: 地とのコントラスト ${cr.toFixed(2)} < ${CHART_MIN_CONTRAST}`);
  }
  const list: [number, number][] = [];
  for (let i = 0; i < hexes.length; i++) {
    if (pairs === 'adjacent') {
      if (i + 1 < hexes.length) list.push([i, i + 1]);
    } else for (let j = i + 1; j < hexes.length; j++) list.push([i, j]);
  }
  let cvd = Infinity;
  let normal = Infinity;
  for (const [i, j] of list) {
    cvd = Math.min(cvd, chartDeltaE(hexes[i], hexes[j], 'protan'), chartDeltaE(hexes[i], hexes[j], 'deutan'));
    normal = Math.min(normal, chartDeltaE(hexes[i], hexes[j]));
  }
  return { inGamutOk: problems.length === 0, problems, cvd, normal };
}

/** 検査の余裕（CHART_CVD_MIN 以上なら通る。そのままの見え方は 15 → 8 の尺度にそろえる） */
function margin(hexes: readonly string[], mode: ChartMode): number {
  const adj = checkCategorical(hexes, mode, 'adjacent');
  const all3 = checkCategorical(hexes.slice(0, 3), mode, 'all');
  if (!adj.inGamutOk) return -Infinity;
  const scale = CHART_CVD_MIN / CHART_NORMAL_MIN;
  return Math.min(adj.cvd, adj.normal * scale, all3.cvd, all3.normal * scale);
}

const hueDist = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const chartHex = (L: number, H: number) => oklchToHex({ L, C: Math.min(MAX_CHROMA, maxChroma(L, H) * 0.995), H }).hex;
/** 淡い面（面グラフの塗り・背景） */
const subtleHex = (hex: string, mode: ChartMode) => {
  const { H } = hexToOklch(hex);
  return mode === 'light' ? oklchToHex({ L: 0.95, C: 0.03, H }).hex : oklchToHex({ L: 0.27, C: 0.05, H }).hex;
};

export interface ChartPalette {
  /** 使った色の名前（'brand' か CHART_POOL の key） */
  keys: string[];
  light: string[];
  dark: string[];
  lightSubtle: string[];
  darkSubtle: string[];
}

/** 候補の組み合わせ（順は保つ）を、辞書順（候補の先のものを優先）に列挙する */
function* combinations<T>(items: readonly T[], n: number, start = 0): Generator<T[]> {
  if (n === 0) {
    yield [];
    return;
  }
  for (let i = start; i <= items.length - n; i++) for (const rest of combinations(items, n - 1, i + 1)) yield [items[i], ...rest];
}

type PoolItem = (typeof CHART_POOL)[number];

/** 1 色目（ブランドの色相）の明るさを選び、並び全体の検査の余裕を返す */
function withBrandSlot(pool: readonly PoolItem[], H: number | null) {
  const out = { light: pool.map((p) => p.light as string), dark: pool.map((p) => p.dark as string) };
  let worst = Infinity;
  for (const mode of ['light', 'dark'] as const) {
    if (H === null) {
      worst = Math.min(worst, margin(out[mode], mode));
      continue;
    }
    let best: { m: number; hex: string } | null = null;
    for (const L of BRAND_SLOT_L[mode]) {
      const hex = chartHex(L, H);
      const m = margin([hex, ...out[mode]], mode);
      if (!best || m > best.m) best = { m, hex };
    }
    out[mode] = [best!.hex, ...out[mode]];
    worst = Math.min(worst, best!.m);
  }
  return { out, worst };
}

/**
 * ブランドの主色（500）から、グラフの 5 色を決める。
 * 候補を決まった順で使い、ブランドの色相に近い候補は飛ばす。その並びが検査に通らないときだけ、
 * 候補の順は保ったまま飛ばす色を増やし、最初に通る並びを使う（例: 紫のブランドではスレートの青も飛ばす）
 */
export function chartPaletteFor(brand500: string): ChartPalette {
  const { C, H } = hexToOklch(brand500);
  const achromatic = C < CHART_ACHROMATIC_C;
  const candidates = CHART_POOL.filter((p) => achromatic || hueDist(hexToOklch(p.light).H, H) >= CHART_HUE_GAP);
  const n = achromatic ? CHART_SLOTS : CHART_SLOTS - 1;
  let pool = candidates.slice(0, n);
  let { out, worst } = withBrandSlot(pool, achromatic ? null : H);
  if (worst < CHART_CVD_MIN) {
    for (const combo of combinations(candidates, n)) {
      const r = withBrandSlot(combo, achromatic ? null : H);
      if (r.worst >= CHART_CVD_MIN) {
        pool = combo;
        ({ out, worst } = r);
        break;
      }
    }
  }
  return {
    keys: [...(achromatic ? [] : ['brand']), ...pool.map((p) => p.key)],
    light: out.light,
    dark: out.dark,
    lightSubtle: out.light.map((h) => subtleHex(h, 'light')),
    darkSubtle: out.dark.map((h) => subtleHex(h, 'dark')),
  };
}
