/**
 * codegen — レジストリ → CSS 変数
 *
 * 入力: dist/index.js（要 `pnpm build` 済み。CI は Build → Codegen の順）
 * 出力:
 *   packages/tokens/css/brand.css                     骨格 + ランプ + スロット（全置換）
 *   packages/ui-app/src/styles/generated-brand.css    ランプ + スロット
 *   packages/ui-web/src/styles/generated-brand.css    ランプ + スロット
 *
 * 実行: pnpm --filter @siracusahq/tokens codegen（ルートからは pnpm codegen）
 */

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensRoot = resolve(here, '..');
const repoRoot = resolve(tokensRoot, '../..');

const {
  colors,
  fontFamily,
  fontWeight,
  radii,
  shadows,
  duration,
  easing,
  STEP_VALUES,
  SLOTS,
  DEFAULT_BRAND,
  resolveAllBrands,
  hexToRgbTriplet,
} = await import(resolve(tokensRoot, 'dist/index.js'));

const BANNER = (purpose) => `/**
 * ${purpose}
 *
 * ⚠️ 自動生成ファイル — 手で編集しないこと。
 * 生成元: packages/tokens/src/brand-registry.ts（+ 骨格は packages/tokens/src/*.ts）
 * 再生成: pnpm --filter @siracusahq/tokens codegen
 */
`;

const brands = resolveAllBrands();

// ---- ランプ実体（全ブランド分を常に :root へ） ----
function rampsBlock() {
  const lines = [':root {'];
  for (const b of brands) {
    lines.push(`  /* ${b.entry.label} — ${b.entry.mode} */`);
    for (const step of STEP_VALUES) {
      lines.push(`  --ramp-${b.key}-${step}: ${b.ramp[step]};`);
    }
  }
  lines.push('}');
  return lines.join('\n');
}

// ---- 抽象スロット ----
function slotLines(b) {
  const lines = [];
  for (const slot of SLOTS) {
    if (slot.fixed !== undefined) {
      lines.push(`  ${slot.name}: ${slot.fixed};`);
      continue;
    }
    const step = b.entry.slotOverrides?.[slot.name] ?? slot.step;
    lines.push(`  ${slot.name}: var(--ramp-${b.key}-${step});`);
  }
  const decorStep = b.entry.slotOverrides?.['--color-decor-brand'] ?? 300;
  const glowRgb = hexToRgbTriplet(b.ramp[decorStep]);
  lines.push(`  --shadow-glow-brand: 0 0 24px rgb(${glowRgb} / 0.25);`);
  lines.push(`  --shadow-glow-brand-lg: 0 0 48px rgb(${glowRgb} / 0.3);`);
  return lines;
}

function slotsBlock() {
  const def = brands.find((b) => b.key === DEFAULT_BRAND);
  const parts = [];
  parts.push(`/* 既定ブランド（data-brand なし = ${DEFAULT_BRAND}） */`);
  parts.push(':root {\n' + slotLines(def).join('\n') + '\n}');
  for (const b of brands) {
    parts.push(`[data-brand='${b.dataBrand}'] {\n` + slotLines(b).join('\n') + '\n}');
  }
  return parts.join('\n\n');
}

const contractCss = [
  '/* ============================================================',
  '   テーマ契約: 層2（ブランドランプ実体）',
  '   ============================================================ */',
  '',
  rampsBlock(),
  '',
  '/* ============================================================',
  '   テーマ契約: 層3（抽象スロット）',
  '   コンポーネントはこの --color-*-brand-* だけを参照すること。',
  '   --ramp-* の直接参照は禁止（テストが検出する）。',
  '   ============================================================ */',
  '',
  slotsBlock(),
].join('\n');

// ---- 骨格（層1）— brand.css のみに含める ----
const kebab = (k) => k.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());

function scale(prefix, obj) {
  return Object.entries(obj)
    .map(([k, v]) => `  ${prefix}-${kebab(k)}: ${v};`)
    .join('\n');
}

const skeleton = `:root {
  /* ── 操作用プライマリ（WCAG AA 準拠） ───────────────── */
${scale('--color-primary', colors.primary)}

  /* ── 装飾用ブランドアクセント（テキスト・ボタン背景には使わない） ── */
${scale('--color-brand', colors.brand)}

  /* ── ニュートラル ───────────────────────────────── */
${scale('--color-neutral', colors.neutral)}

  /* ── セマンティック ─────────────────────────────── */
${scale('--color-success', colors.success)}
${scale('--color-warning', colors.warning)}
${scale('--color-error', colors.error)}
${scale('--color-info', colors.info)}

  /* ── タイポグラフィ ─────────────────────────────── */
  --font-sans: ${fontFamily.sans};
  --font-mono: ${fontFamily.mono};

${scale('  --font-weight', fontWeight).replace(/^ {2}/gm, '')}

  /* ── ボーダーラディウス ─────────────────────────── */
${scale('--radius', radii)}

  /* ── シャドウ ───────────────────────────────────── */
${scale('--shadow', shadows)}

  /* ── モーション ─────────────────────────────────── */
${scale('--duration', duration)}

${scale('--easing', easing)}
}`;

const brandCss = [
  BANNER(
    'Siracusa ブランド基盤トークン + テーマ契約 — CSS変数版\n *\n * React を使わないサイト（Astro・静的HTML等）向け。\n * <link rel="stylesheet" href="node_modules/@siracusahq/tokens/css/brand.css">\n * あるいは CSS 側で: @import \'@siracusahq/tokens/brand.css\';',
  ),
  '',
  skeleton,
  '',
  contractCss,
  '',
].join('\n');

const uiCss = [BANNER('テーマ契約（ブランドランプ + 抽象スロット）'), '', contractCss, ''].join(
  '\n',
);

writeFileSync(resolve(tokensRoot, 'css/brand.css'), brandCss);
writeFileSync(resolve(repoRoot, 'packages/ui-app/src/styles/generated-brand.css'), uiCss);
writeFileSync(resolve(repoRoot, 'packages/ui-web/src/styles/generated-brand.css'), uiCss);

console.log(`codegen: ${brands.length} ブランドを出力（${brands.map((b) => b.key).join(', ')}）`);
console.log('  - packages/tokens/css/brand.css');
console.log('  - packages/ui-app/src/styles/generated-brand.css');
console.log('  - packages/ui-web/src/styles/generated-brand.css');
