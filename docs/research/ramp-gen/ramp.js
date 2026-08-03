/**
 * ブランドカラーランプ生成器（プロトタイプ・依存なし）
 *
 * 入力: 色相 H（0..360）1つだけ
 * 出力: 50..950 の 11 段。全ブランドで **段ごとの OKLCH L が完全に一致する**。
 *
 * 設計の核:
 *   1. L（明度）は段ごとに固定。色相によって絶対に変えない
 *      → これが「同一トーン・色相違い」を機械的に成立させる唯一の装置。
 *   2. C（彩度）は「絶対上限」と「その (L,H) で sRGB に収まる最大彩度の 95%」の
 *      小さい方。色域の狭い色相（黄・シアン）で破綻させないための譲歩。
 *   3. 操作段（500）だけは C=0.100 に固定し、さらに白文字 4.5:1 を
 *      満たさなければ L を下げて必ず満たす（AA を彩度より優先する）。
 */

import { contrastRatio, maxChroma, oklchToHex } from './color.js';

/** 段の定義。L は不変の契約値、cCeil は彩度の絶対上限 */
export const STEPS = [
  { step: 50,  L: 0.950, cCeil: 0.022 },
  { step: 100, L: 0.880, cCeil: 0.050 },
  { step: 200, L: 0.810, cCeil: 0.085 },
  { step: 300, L: 0.730, cCeil: 0.135 }, // ← 装飾段（DECOR）
  { step: 400, L: 0.650, cCeil: 0.120 },
  { step: 500, L: 0.553, cCeil: 0.100 }, // ← 操作段（ACTION）
  { step: 600, L: 0.504, cCeil: 0.092 },
  { step: 700, L: 0.439, cCeil: 0.080 },
  { step: 800, L: 0.374, cCeil: 0.068 },
  { step: 900, L: 0.306, cCeil: 0.056 },
  { step: 950, L: 0.230, cCeil: 0.042 },
];

/** 役割に対応する段。テストはこの定数を参照して「段の混在」を検出する */
export const ACTION_STEP = 500;
export const DECOR_STEP = 300;

/** 操作段が保証しなければならない白文字コントラスト */
export const ACTION_MIN_CONTRAST = 4.5;

/** 彩度を色域最大の何割までに抑えるか（境界ちょうどは丸め誤差で外れやすい） */
const GAMUT_SAFETY = 0.95;

const WHITE = '#ffffff';

/**
 * 色相1つからランプを生成する。
 *
 * 契約の不変量は **段ごとの L と C** であって「ランプ内の色相が単一であること」ではない。
 * よって段ごとの色相微回転（オプション `hueShift`）を与えても契約は壊れない。
 * 明るい段で色相を回すのはカラーデザインとして正常な手法であり、
 * 実際に現行 corporate ランプは 50 段 H=192.8 → 500 段 H=180.4 と 12° 回っている。
 *
 * @param {number} hue OKLCH の色相角（0..360）。ブランド登録で書く唯一の値
 * @param {{ hueShift?: Record<number, number> }} [opts] 段ごとの色相オフセット（度）
 * @returns {{ hue:number, steps:Record<number,string>, meta:Record<number,object>, notes:string[] }}
 */
export function generateRamp(hue, opts = {}) {
  const steps = {};
  const meta = {};
  const notes = [];
  const shift = opts.hueShift ?? {};

  for (const { step, L: baseL, cCeil } of STEPS) {
    const hueAt = ((hue + (shift[step] ?? 0)) % 360 + 360) % 360;
    let L = baseL;
    let cTarget = cCeil;
    let loweredForContrast = 0;

    if (step === ACTION_STEP) {
      // 操作段: AA を彩度・明度より優先する。
      // C=0.100 のまま L を下げていき、白文字 4.5:1 を満たす最大の L を採る。
      let probe = oklchToHex({ L, C: Math.min(cTarget, maxChroma(L, hueAt)), H: hueAt });
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
          `H=${hueAt.toFixed(1)}: 操作段(500) は L=${baseL} では白文字 ${contrastRatio(probe.hex, WHITE).toFixed(2)}:1 で AA 未達。` +
            `L を ${L.toFixed(4)} まで下げて ${ACTION_MIN_CONTRAST}:1 を確保した（-${loweredForContrast.toFixed(4)}）。`,
        );
      }
    }

    const cLimit = maxChroma(L, hueAt) * GAMUT_SAFETY;
    const C = Math.min(cTarget, cLimit);
    const gamutLimited = cLimit < cTarget - 1e-4;

    const { hex, chroma } = oklchToHex({ L, C, H: hueAt });
    steps[step] = hex;
    meta[step] = {
      L,
      C: chroma,
      H: hueAt,
      cCeil,
      gamutLimited,
      loweredForContrast,
      onWhite: contrastRatio(hex, WHITE),
    };

    if (gamutLimited && (step === ACTION_STEP || step === DECOR_STEP)) {
      notes.push(
        `H=${hueAt.toFixed(1)}: ${step} 段は sRGB 色域の制約で C=${chroma.toFixed(4)}（上限 ${cCeil}）に丸められた。`,
      );
    }
  }

  return { hue, steps, meta, notes };
}
