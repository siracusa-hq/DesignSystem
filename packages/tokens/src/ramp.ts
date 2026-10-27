/**
 * ブランドカラーランプの契約と生成器
 *
 * **STEPS と SLOTS は仕様であってデータではない。** 変更には設計判断が要る
 * （docs/theme-contract-spec.md が正本。値を動かすと全ブランドの色が変わる）。
 *
 * 設計の核:
 *   1. L（明度）は段ごとに固定。色相によって絶対に変えない
 *      → 「同一トーン・色相違い」を機械的に成立させる唯一の装置
 *      例外は 500 より暗い側（600〜950）だけ: 操作段（500）を深く置くブランド（deep 型）や、
 *      公開済みの決定色を固定する段（anchors）があるときは、500 の実際の L と暗い側のアンカーを通る
 *      折れ線で契約 L を写し、**段の数字が大きいほど暗い**を必ず保つ（2026-10-27。spec §12 Q13）
 *   1b. 公開済みの決定色（ロゴ・公開サイトで使っている色）は anchors でその段に固定する。
 *      固定した段は生成せず、その hex をそのまま使う
 *   2. C（彩度）はブランドごとの倍率（chromaScale）×段の上限。ただし
 *      その (L,H) で sRGB に収まる最大彩度 × GAMUT_SAFETY を超えない
 *   3. 操作段（500）は白文字 4.5:1 を必ず満たす（AA を彩度・明度の見た目より優先）
 */

import { contrastRatio, hexToOklch, maxChroma, oklchToHex } from './color';

export const STEP_VALUES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEP_VALUES)[number];

/** 段の契約。L は不変の契約値、cCeil は彩度上限（chromaScale=1 のとき） */
export const STEPS: ReadonlyArray<{ step: Step; L: number; cCeil: number }> = [
  { step: 50, L: 0.95, cCeil: 0.022 },
  { step: 100, L: 0.88, cCeil: 0.05 },
  { step: 200, L: 0.81, cCeil: 0.085 },
  { step: 300, L: 0.73, cCeil: 0.135 }, // ← 装飾段（DECOR）
  { step: 400, L: 0.65, cCeil: 0.12 },
  { step: 500, L: 0.553, cCeil: 0.1 }, // ← 操作段（ACTION）
  { step: 600, L: 0.504, cCeil: 0.092 },
  { step: 700, L: 0.439, cCeil: 0.08 },
  { step: 800, L: 0.374, cCeil: 0.068 },
  { step: 900, L: 0.306, cCeil: 0.056 },
  { step: 950, L: 0.23, cCeil: 0.042 },
];

export const ACTION_STEP: Step = 500;
export const DECOR_STEP: Step = 300;

/** 操作段が保証しなければならない白文字コントラスト */
export const ACTION_MIN_CONTRAST = 4.5;


/**
 * 彩度を色域最大の何割までに抑えるか。
 * プロトタイプは 0.95 だったが、ブランド側が目視承認したスウォッチの実値が
 * 0.98 で計算されているため 0.98 を正とする（oklchToHex 側にも gamut mapping が
 * あるため安全性は変わらない）。
 */
export const GAMUT_SAFETY = 0.98;

const WHITE = '#ffffff';

/** ブランド操作色の彩度帯（契約改定 2026-08-03）。chromaScale×0.100 がこの範囲に入ること */
export const ACTION_CHROMA_BAND = { min: 0.06, max: 0.15 } as const;
/**
 * 生成ブランドの操作段 L 帯。
 * 下限 0.42 は Polastack 濃紺決定（2026-08-04）で拡大した。
 * 家族の実測レンジは 0.40（ピアデスク）〜0.553（コーポレート）であり、
 * 深い操作色は白文字コントラストが増える方向のため AA は常に満たす。
 */
export const ACTION_L_BAND = { min: 0.42, max: 0.553 } as const;

export interface GenerateRampOptions {
  /** 彩度倍率。段の cCeil に一律に掛かる。既定 1（コーポレート相当） */
  chromaScale?: number;
  /** 操作段（500）の L 上書き。deep 型ブランド用。既定は契約値 0.553 */
  actionL?: number;
  /** 段ごとの色相オフセット（度）。通常は使わない */
  hueShift?: Partial<Record<Step, number>>;
  /** 公開済みの決定色を固定する段（例: { 500: '#008575' }）。固定した段は生成しない */
  anchors?: Partial<Record<Step, string>>;
}

/**
 * 段の L を決める。500 以下（明るい側）は契約 L のまま。500 より暗い側は、
 * (契約 L, 実際の L) の点 — 500・暗い側のアンカー・(0, 0) — を通る折れ線で写す。
 * 点の実際の L が単調に減らない（アンカーの並びが崩れている）なら例外を投げる。
 */
export function stepLightness(L500: number, anchors: Partial<Record<Step, string>> = {}): Record<Step, number> {
  const action = STEPS.find((s) => s.step === ACTION_STEP)!.L;
  const pts: [number, number][] = [[action, L500], [0, 0]];
  for (const { step, L } of STEPS) {
    const hex = anchors[step];
    if (hex && step > ACTION_STEP) pts.push([L, hexToOklch(hex).L]);
  }
  pts.sort((a, b) => b[0] - a[0]);
  for (let i = 1; i < pts.length; i++) {
    if (pts[i]![1] >= pts[i - 1]![1]) throw new Error(`アンカーの明るさが段の順に暗くなっていない: ${JSON.stringify(pts)}`);
  }
  const map = (L: number) => {
    if (L >= action) return L;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]!;
      const [x1, y1] = pts[i]!;
      if (L <= x0 && L >= x1) return y1 + ((y0 - y1) * (L - x1)) / (x0 - x1);
    }
    return L;
  };
  return Object.fromEntries(STEPS.map(({ step, L }) => [step, map(L)])) as Record<Step, number>;
}

export interface RampResult {
  hue: number;
  steps: Record<Step, string>;
  meta: Record<
    Step,
    { L: number; C: number; H: number; gamutLimited: boolean; loweredForContrast: number }
  >;
  notes: string[];
}

/** 色相1つ（+オプション）からランプを生成する */
export function generateRamp(hue: number, opts: GenerateRampOptions = {}): RampResult {
  const chromaScale = opts.chromaScale ?? 1;
  const shift = opts.hueShift ?? {};
  const anchors = opts.anchors ?? {};
  const steps = {} as Record<Step, string>;
  const meta = {} as RampResult['meta'];
  const notes: string[] = [];
  const actionAnchor = anchors[ACTION_STEP];
  const L500 = actionAnchor ? hexToOklch(actionAnchor).L : (opts.actionL ?? STEPS.find((s) => s.step === ACTION_STEP)!.L);
  const lightness = stepLightness(L500, anchors);

  for (const { step, cCeil } of STEPS) {
    const fixed = anchors[step];
    if (fixed) {
      const o = hexToOklch(fixed);
      steps[step] = fixed.toLowerCase();
      meta[step] = { L: o.L, C: o.C, H: o.H, gamutLimited: false, loweredForContrast: 0 };
      continue;
    }
    const hueAt = (((hue + (shift[step] ?? 0)) % 360) + 360) % 360;
    let L = step === ACTION_STEP && opts.actionL !== undefined ? opts.actionL : lightness[step];
    const cTarget = cCeil * chromaScale;
    let loweredForContrast = 0;

    if (step === ACTION_STEP) {
      // 操作段: AA を彩度・明度より優先する。
      const probe = oklchToHex({ L, C: Math.min(cTarget, maxChroma(L, hueAt)), H: hueAt });
      if (contrastRatio(probe.hex, WHITE) < ACTION_MIN_CONTRAST) {
        let lo = 0.2;
        let hi = L;
        for (let i = 0; i < 30; i++) {
          const mid = (lo + hi) / 2;
          const h = oklchToHex({ L: mid, C: Math.min(cTarget, maxChroma(mid, hueAt)), H: hueAt });
          if (contrastRatio(h.hex, WHITE) >= ACTION_MIN_CONTRAST) lo = mid;
          else hi = mid;
        }
        loweredForContrast = L - lo;
        L = lo;
        notes.push(
          `H=${hueAt.toFixed(1)}: 操作段(500) は AA 未達のため L を ${L.toFixed(4)} に下げた（-${loweredForContrast.toFixed(4)}）`,
        );
      }
    }

    const cLimit = maxChroma(L, hueAt) * GAMUT_SAFETY;
    const C = Math.min(cTarget, cLimit);
    const gamutLimited = cLimit < cTarget - 1e-4;
    const { hex, chroma } = oklchToHex({ L, C, H: hueAt });

    steps[step] = hex;
    meta[step] = { L, C: chroma, H: hueAt, gamutLimited, loweredForContrast };

    if (gamutLimited && (step === ACTION_STEP || step === DECOR_STEP)) {
      notes.push(
        `H=${hueAt.toFixed(1)}: ${step} 段は sRGB 色域の制約で C=${chroma.toFixed(4)}（目標 ${cTarget}）に丸められた`,
      );
    }
  }

  return { hue, steps, meta, notes };
}

/**
 * 抽象スロットの契約（層3）。コンポーネントが参照してよい唯一の層。
 * `step` はランプのどの段を指すか。`fixed` は段によらない固定値。
 */
export const SLOTS: ReadonlyArray<
  { name: string; step: Step; fixed?: never } | { name: string; fixed: string; step?: never }
> = [
  { name: '--color-bg-brand-subtle', step: 50 },
  { name: '--color-bg-brand-muted', step: 100 },
  { name: '--color-bg-brand-primary', step: 500 },
  { name: '--color-bg-brand-hover', step: 600 },
  { name: '--color-bg-brand-active', step: 700 },
  { name: '--color-bg-brand-strong', step: 800 },
  { name: '--color-text-brand', step: 500 },
  { name: '--color-text-brand-strong', step: 700 },
  { name: '--color-text-brand-on-dark', step: 300 },
  { name: '--color-border-brand', step: 200 },
  { name: '--color-border-brand-strong', step: 500 },
  { name: '--color-ring-brand', step: 500 },
  { name: '--color-decor-brand', step: 300 },
  { name: '--color-decor-brand-soft', step: 200 },
  { name: '--color-on-brand', fixed: '#ffffff' },
];

/**
 * 第3のオプション役割: CTA 専用アクセント（LP調査で確認された実務パターン。
 * 例: ブランド青に対し CTA だけ黄色）。
 * 既定では操作色スロットへの var() フォールバックとして `:root, [data-brand]` に
 * 出力される。カスタムプロパティ内の var() は**宣言された要素で解決されてから
 * 継承される**ため、:root だけに書くとブランド切替に追従しない（CSS の仕様。
 * theme.css のティント面と同じ理由で [data-brand] にも同じ宣言が要る）。
 * ブランドが専用 CTA 色を持つ場合のみ、将来 [data-brand] 側で上書きする。
 */
export const CTA_SLOTS: ReadonlyArray<{ name: string; fallback: string }> = [
  { name: '--color-bg-cta', fallback: '--color-bg-brand-primary' },
  { name: '--color-bg-cta-hover', fallback: '--color-bg-brand-hover' },
  { name: '--color-bg-cta-active', fallback: '--color-bg-brand-active' },
  { name: '--color-on-cta', fallback: '--color-on-brand' },
];
