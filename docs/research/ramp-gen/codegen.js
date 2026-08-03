/**
 * codegen プロトタイプ: レジストリ -> CSS
 *
 *   node codegen.js            # CSS を標準出力へ
 *
 * 出力は 3 ブロック:
 *   1. 各ブランドのランプ実体   --ramp-<brand>-<step>
 *   2. 抽象スロットの既定値      :root（コーポレート）
 *   3. ブランド切替             [data-brand="..."]
 */

import { generateRamp, STEPS, ACTION_STEP, DECOR_STEP } from './ramp.js';
import { registry } from './registry.js';

/** 抽象スロット -> ランプの段。ここが「契約」の本体 */
export const SLOTS = {
  'color-bg-brand-subtle': 50,
  'color-bg-brand-muted': 100,
  'color-bg-brand-primary': ACTION_STEP,
  'color-bg-brand-hover': 600,
  'color-bg-brand-active': 700,
  'color-bg-brand-strong': 800,
  'color-text-brand': ACTION_STEP,
  'color-text-brand-on-dark': DECOR_STEP,
  'color-border-brand': 200,
  'color-border-brand-strong': ACTION_STEP,
  'color-ring-brand': ACTION_STEP,
  'color-decor-brand': DECOR_STEP,
  'color-decor-brand-soft': 200,
};

/** ランプに依存しない固定スロット */
const FIXED_SLOTS = {
  'color-on-brand': '#ffffff', // 操作段(500)の面に載せる文字。AA は生成器が保証する
};

export function rampFor(entry) {
  return entry.mode === 'explicit' ? entry.ramp : generateRamp(entry.hue).steps;
}

function emit() {
  const out = [];
  out.push('/* 自動生成ファイル — 手で編集しないこと。');
  out.push(' * 生成元: packages/tokens/src/brand-registry.ts');
  out.push(' * 再生成: pnpm --filter @polastack/tokens codegen');
  out.push(' */');
  out.push('');

  out.push('/* ---- 1. ブランドごとのランプ実体 ---- */');
  out.push(':root {');
  for (const [name, entry] of Object.entries(registry)) {
    const ramp = rampFor(entry);
    out.push(`  /* ${entry.label}${entry.mode === 'explicit' ? ' — explicit 登録' : ` — H=${entry.hue} から生成`}${entry.provisional ? '（仮）' : ''} */`);
    for (const { step } of STEPS) out.push(`  --ramp-${name}-${step}: ${ramp[step]};`);
  }
  out.push('}');
  out.push('');

  const names = Object.keys(registry);
  out.push('/* ---- 2. 抽象スロットの既定値（コーポレート） ---- */');
  out.push(':root {');
  for (const [slot, step] of Object.entries(SLOTS)) {
    out.push(`  --${slot}: var(--ramp-${names[0]}-${step});`);
  }
  for (const [slot, value] of Object.entries(FIXED_SLOTS)) out.push(`  --${slot}: ${value};`);
  out.push('}');
  out.push('');

  out.push('/* ---- 3. ブランド切替 ---- */');
  for (const name of names.slice(1)) {
    out.push(`[data-brand='${name}'] {`);
    for (const [slot, step] of Object.entries(SLOTS)) {
      out.push(`  --${slot}: var(--ramp-${name}-${step});`);
    }
    out.push('}');
  }

  // 製品は既定でシリーズ色を継承する。hue を持つ製品だけ上書きブロックが出る。
  for (const [name, entry] of Object.entries(registry)) {
    for (const [pName, p] of Object.entries(entry.products ?? {})) {
      if (p.hue == null) {
        out.push(`/* ${p.label}: 専用色は未設定。data-brand='${name}' のシリーズ色をそのまま使う */`);
        continue;
      }
      const ramp = generateRamp(p.hue).steps;
      out.push(`[data-brand='${pName}'] {`);
      for (const { step } of STEPS) out.push(`  --ramp-${pName}-${step}: ${ramp[step]};`);
      for (const [slot, step] of Object.entries(SLOTS)) {
        out.push(`  --${slot}: var(--ramp-${pName}-${step});`);
      }
      out.push('}');
    }
  }

  return out.join('\n');
}

console.log(emit());
