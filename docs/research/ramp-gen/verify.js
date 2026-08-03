/**
 * 検証スクリプト（実行して仕様書に実数値を転記するためのもの）
 *
 *   node verify.js
 *
 * 1. H=180 の生成ランプ vs 現行 primary-50〜950 / brand-500（hex 比較 + ΔE2000）
 * 2. 任意色相（250 / 60 / 25）の生成ランプと、白地 / neutral-950 上のコントラスト
 * 3. 全 360 色相の操作段(500)・装飾段(300) スイープ（AA 保証と色域外の実態）
 */

import { contrastRatio, deltaE2000, hexToOklch, maxChroma } from './color.js';
import { ACTION_STEP, DECOR_STEP, STEPS, generateRamp } from './ramp.js';

const WHITE = '#ffffff';
const NEUTRAL_950 = '#09090b'; // packages/tokens/src/colors.ts の neutral-950

// 現行の正本（packages/tokens/src/colors.ts より転記）
const CURRENT_PRIMARY = {
  50: '#e0f2f1', 100: '#b2dfdb', 200: '#80cbc4', 300: '#4db6ac', 400: '#26a69a',
  500: '#008575', 600: '#007567', 700: '#006055', 800: '#004c43', 900: '#003831', 950: '#00231f',
};
const CURRENT_BRAND_500 = '#13c3a0';

const line = (s = '') => console.log(s);
const rule = (t) => { line(); line('='.repeat(78)); line(t); line('='.repeat(78)); };

// ---------------------------------------------------------------- 1
rule('1. H=180（コーポレート相当ティール）生成ランプ vs 現行 primary');

line('段   生成hex    現行hex    ΔE2000  生成L    現行L    生成C    現行C    生成H  現行H');
const teal = generateRamp(180);
let sumDe = 0;
let maxDe = 0;
for (const { step } of STEPS) {
  const gen = teal.steps[step];
  const cur = CURRENT_PRIMARY[step];
  const de = deltaE2000(gen, cur);
  sumDe += de;
  maxDe = Math.max(maxDe, de);
  const g = hexToOklch(gen);
  const c = hexToOklch(cur);
  line(
    `${String(step).padStart(3)}  ${gen}    ${cur}    ${de.toFixed(2).padStart(5)}   ` +
      `${g.L.toFixed(3)}   ${c.L.toFixed(3)}   ${g.C.toFixed(4)}  ${c.C.toFixed(4)}  ` +
      `${g.H.toFixed(1).padStart(5)}  ${c.H.toFixed(1).padStart(5)}`,
  );
}
line(`平均 ΔE2000 = ${(sumDe / STEPS.length).toFixed(2)} / 最大 ΔE2000 = ${maxDe.toFixed(2)}`);
line(`完全一致した段: ${STEPS.filter(({ step }) => teal.steps[step] === CURRENT_PRIMARY[step]).map((s) => s.step).join(', ') || 'なし'}`);

line();
line('装飾段 vs 現行 brand-500（別スケールの同機能段）');
const decorHex = teal.steps[DECOR_STEP];
const d = hexToOklch(decorHex);
const b = hexToOklch(CURRENT_BRAND_500);
line(`生成 ${DECOR_STEP}: ${decorHex}  L=${d.L.toFixed(4)} C=${d.C.toFixed(4)} H=${d.H.toFixed(1)} 白地=${contrastRatio(decorHex, WHITE).toFixed(2)}:1`);
line(`現行 brand-500: ${CURRENT_BRAND_500}  L=${b.L.toFixed(4)} C=${b.C.toFixed(4)} H=${b.H.toFixed(1)} 白地=${contrastRatio(CURRENT_BRAND_500, WHITE).toFixed(2)}:1`);
line(`ΔE2000 = ${deltaE2000(decorHex, CURRENT_BRAND_500).toFixed(2)}`);
line(`H=180 / L=0.730 で sRGB に収まる最大彩度 = ${maxChroma(0.73, 180).toFixed(4)}（brand-500 の C=${b.C.toFixed(4)} は H=${b.H.toFixed(1)} での値）`);
if (teal.notes.length) { line(); teal.notes.forEach((n) => line(`  [note] ${n}`)); }

// ---------------------------------------------------------------- 2
rule('2. 任意色相のランプ生成とコントラスト（白地 / neutral-950 上）');

for (const hue of [250, 60, 25]) {
  const r = generateRamp(hue);
  line();
  line(`--- H=${hue} ---`);
  line('段   hex        L      C       白地      neutral-950上   色域丸め  役割');
  for (const { step } of STEPS) {
    const hex = r.steps[step];
    const m = r.meta[step];
    const role = step === ACTION_STEP ? '操作(ACTION)' : step === DECOR_STEP ? '装飾(DECOR)' : '';
    line(
      `${String(step).padStart(3)}  ${hex}  ${m.L.toFixed(3)}  ${m.C.toFixed(4)}  ` +
        `${contrastRatio(hex, WHITE).toFixed(2).padStart(6)}:1  ${contrastRatio(hex, NEUTRAL_950).toFixed(2).padStart(6)}:1        ` +
        `${m.gamutLimited ? 'あり' : '—  '}      ${role}`,
    );
  }
  const a = r.steps[ACTION_STEP];
  line(`  操作段 白文字 ${contrastRatio(a, WHITE).toFixed(2)}:1 (AA ${contrastRatio(a, WHITE) >= 4.5 ? 'OK' : 'NG'})`);
  const dec = r.steps[DECOR_STEP];
  line(`  装飾段 白地 ${contrastRatio(dec, WHITE).toFixed(2)}:1 / neutral-950上 ${contrastRatio(dec, NEUTRAL_950).toFixed(2)}:1 (ダーク面テキスト AA ${contrastRatio(dec, NEUTRAL_950) >= 4.5 ? 'OK' : 'NG'})`);
  r.notes.forEach((n) => line(`  [note] ${n}`));
}

// ---------------------------------------------------------------- 3
rule('3. 全 360 色相スイープ');

const rows = [];
for (let h = 0; h < 360; h += 1) {
  const r = generateRamp(h);
  const a = r.steps[ACTION_STEP];
  const dec = r.steps[DECOR_STEP];
  rows.push({
    h,
    actionOnWhite: contrastRatio(a, WHITE),
    actionL: r.meta[ACTION_STEP].L,
    actionC: r.meta[ACTION_STEP].C,
    actionLowered: r.meta[ACTION_STEP].loweredForContrast,
    actionGamut: r.meta[ACTION_STEP].gamutLimited,
    actionOnDark: contrastRatio(a, NEUTRAL_950),
    decorOnWhite: contrastRatio(dec, WHITE),
    decorOnDark: contrastRatio(dec, NEUTRAL_950),
    decorC: r.meta[DECOR_STEP].C,
    decorGamut: r.meta[DECOR_STEP].gamutLimited,
  });
}

const min = (f) => rows.reduce((a, b) => (f(a) <= f(b) ? a : b));
const max = (f) => rows.reduce((a, b) => (f(a) >= f(b) ? a : b));

line(`操作段(500) 白文字コントラスト: min ${min((r) => r.actionOnWhite).actionOnWhite.toFixed(2)}:1 (H=${min((r) => r.actionOnWhite).h}) / max ${max((r) => r.actionOnWhite).actionOnWhite.toFixed(2)}:1 (H=${max((r) => r.actionOnWhite).h})`);
line(`  AA(4.5:1) 未達の色相数: ${rows.filter((r) => r.actionOnWhite < 4.5 - 1e-9).length} / 360`);
const lowered = rows.filter((r) => r.actionLowered > 1e-6);
line(`  L=0.553 のままでは AA 未達で L を下げた色相: ${lowered.length} / 360` +
  (lowered.length ? `（H=${lowered[0].h}〜${lowered[lowered.length - 1].h}、最大 -${max((r) => r.actionLowered).actionLowered.toFixed(4)} @H=${max((r) => r.actionLowered).h}）` : ''));
line(`  操作段 L のレンジ: ${min((r) => r.actionL).actionL.toFixed(4)} 〜 ${max((r) => r.actionL).actionL.toFixed(4)}`);
line(`  操作段 C=0.100 に届かず色域で丸められた色相: ${rows.filter((r) => r.actionGamut).length} / 360` +
  (rows.filter((r) => r.actionGamut).length ? `（最小 C=${min((r) => r.actionC).actionC.toFixed(4)} @H=${min((r) => r.actionC).h}）` : ''));

line(`操作段(500) を neutral-950 の面に文字として置いた場合: min ${min((r) => r.actionOnDark).actionOnDark.toFixed(2)}:1 (H=${min((r) => r.actionOnDark).h}) / max ${max((r) => r.actionOnDark).actionOnDark.toFixed(2)}:1 (H=${max((r) => r.actionOnDark).h})`);
line(`  → 全色相で 4.5:1 未満か: ${rows.every((r) => r.actionOnDark < 4.5) ? 'YES（ダーク面のテキストに操作段を使ってはならない。装飾段(300)を使う）' : 'NO'}`);

line();
line(`装飾段(300) 白地コントラスト: min ${min((r) => r.decorOnWhite).decorOnWhite.toFixed(2)}:1 (H=${min((r) => r.decorOnWhite).h}) / max ${max((r) => r.decorOnWhite).decorOnWhite.toFixed(2)}:1 (H=${max((r) => r.decorOnWhite).h})`);
line(`  → 全色相で 4.5:1 未満か: ${rows.every((r) => r.decorOnWhite < 4.5) ? 'YES（明背景のテキスト/ボタン背景に使えないことが構造的に確定）' : 'NO'}`);
line(`装飾段(300) neutral-950 上コントラスト: min ${min((r) => r.decorOnDark).decorOnDark.toFixed(2)}:1 (H=${min((r) => r.decorOnDark).h}) / max ${max((r) => r.decorOnDark).decorOnDark.toFixed(2)}:1 (H=${max((r) => r.decorOnDark).h})`);
line(`  → 全色相で 4.5:1 以上か: ${rows.every((r) => r.decorOnDark >= 4.5) ? 'YES（ダーク面のテキストに使える）' : 'NO'}`);
line(`  装飾段が色域で丸められた色相: ${rows.filter((r) => r.decorGamut).length} / 360（C レンジ ${min((r) => r.decorC).decorC.toFixed(4)} 〜 ${max((r) => r.decorC).decorC.toFixed(4)}）`);

// ---------------------------------------------------------------- 4
rule('4. explicit 登録（コーポレート）が段の契約 L からどれだけズレているか');
line('→ テストの L 許容差をこの実測から決める');
line('段   hex        契約L    実測L    差       白地       neutral-950上');
const step2L = (s) => STEPS.find((x) => x.step === s).L;
let maxDev = 0;
for (const { step, L } of STEPS) {
  const hex = CURRENT_PRIMARY[step];
  const actual = hexToOklch(hex).L;
  const dev = Math.abs(actual - L);
  maxDev = Math.max(maxDev, dev);
  line(
    `${String(step).padStart(3)}  ${hex}   ${L.toFixed(3)}   ${actual.toFixed(3)}   ` +
      `${dev.toFixed(4)}   ${contrastRatio(hex, WHITE).toFixed(2).padStart(5)}:1   ${contrastRatio(hex, NEUTRAL_950).toFixed(2).padStart(5)}:1`,
  );
}
line(`最大乖離 = ${maxDev.toFixed(4)}（${STEPS.find(({ step }) => Math.abs(hexToOklch(CURRENT_PRIMARY[step]).L - step2L(step)) === maxDev)?.step ?? '?'} 段）` +
  ` → 許容差 ±0.020 なら通る（±0.015 だと落ちる）`);
line(`操作段(500) 白文字 ${contrastRatio(CURRENT_PRIMARY[500], WHITE).toFixed(2)}:1 / 装飾段(300) 白地 ${contrastRatio(CURRENT_PRIMARY[300], WHITE).toFixed(2)}:1 / 装飾段 dark上 ${contrastRatio(CURRENT_PRIMARY[300], NEUTRAL_950).toFixed(2)}:1`);

// ---------------------------------------------------------------- 5
rule('5. 「色相回転を許せば現行ティールを生成で再現できるか」の検証');
line('現行 corporate ランプはランプ内で色相が回っている（50段 H=192.8 → 500段 H=180.4）。');
line('そこで各段に現行と同じ色相を与えた場合、残差がどこまで縮むかを測る。');
line();
const curHue = Object.fromEntries(STEPS.map(({ step }) => [step, hexToOklch(CURRENT_PRIMARY[step]).H]));
const shift = Object.fromEntries(STEPS.map(({ step }) => [step, curHue[step] - 180]));
const rotated = generateRamp(180, { hueShift: shift });
line('段   単一H=180  +色相回転  現行hex    ΔE(単一H)  ΔE(回転後)  C差(回転後)');
let sumRot = 0;
for (const { step } of STEPS) {
  const plain = teal.steps[step];
  const rot = rotated.steps[step];
  const cur = CURRENT_PRIMARY[step];
  const deRot = deltaE2000(rot, cur);
  sumRot += deRot;
  line(
    `${String(step).padStart(3)}  ${plain}    ${rot}    ${cur}    ` +
      `${deltaE2000(plain, cur).toFixed(2).padStart(5)}      ${deRot.toFixed(2).padStart(5)}      ` +
      `${(hexToOklch(rot).C - hexToOklch(cur).C).toFixed(4)}`,
  );
}
line(`平均 ΔE2000: 単一H=${(sumDe / STEPS.length).toFixed(2)} → 色相回転後=${(sumRot / STEPS.length).toFixed(2)}`);
line('→ 色相を合わせても残差は消えない。残差の主因は彩度（現行 200/300 段は彩度上限まで使っていない）。');
line(`   例: 300 段 現行 C=${hexToOklch(CURRENT_PRIMARY[300]).C.toFixed(4)} vs 生成 C=${hexToOklch(rotated.steps[300]).C.toFixed(4)}（契約上限 0.135）`);
line('→ したがってコーポレートは explicit 登録が必要。生成器のパラメータ調整で寄せる問題ではない。');
line();
line(`参考: 現行 brand-500 の H=${b.H.toFixed(1)} は現行 primary-500 の H=${hexToOklch(CURRENT_PRIMARY[500]).H.toFixed(1)} と ${(hexToOklch(CURRENT_PRIMARY[500]).H - b.H).toFixed(1)}° ずれている。`);
line('  単一色相の生成器では、この2色を同時に同じランプの2段として再現することは原理的にできない。');

line();
line('代表色相 24 本（15°刻み）の操作段/装飾段');
line('H    操作hex    L      C       白地      装飾hex    C       白地    dark上');
for (let h = 0; h < 360; h += 15) {
  const r = generateRamp(h);
  const a = r.steps[ACTION_STEP];
  const dec = r.steps[DECOR_STEP];
  line(
    `${String(h).padStart(3)}  ${a}  ${r.meta[ACTION_STEP].L.toFixed(3)}  ${r.meta[ACTION_STEP].C.toFixed(4)}  ` +
      `${contrastRatio(a, WHITE).toFixed(2).padStart(5)}:1  ${dec}  ${r.meta[DECOR_STEP].C.toFixed(4)}  ` +
      `${contrastRatio(dec, WHITE).toFixed(2).padStart(4)}:1  ${contrastRatio(dec, NEUTRAL_950).toFixed(2).padStart(5)}:1`,
  );
}
