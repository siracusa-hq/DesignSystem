/**
 * codegen — レジストリ → CSS 変数
 *
 * 入力: dist/index.js（要 `pnpm build` 済み。CI は Build → Codegen の順）
 * 出力:
 *   packages/tokens/css/brand.css                     骨格 + ランプ + スロット（全置換）
 *   packages/ui-web/src/styles/generated-brand.css    ランプ + スロット
 *   packages/ui-app/src/styles/generated-brand.css    業務 UI のブランド（primary の段・選択中の面・グラフの 1 色目・装飾）
 *
 * 業務 UI（ui-app）は 2026-10-27 にブランドを持つようにした（spec §12 Q10 改定）。部品は primary の段を
 * 直接参照しているので、[data-brand] で primary の段そのものを入れ替える（段の並びは Q13 で全ブランド統一済み）。
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
  CTA_SLOTS,
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
    lines.push(`  /* ${b.entry.label} */`);
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
    lines.push(`  ${slot.name}: var(--ramp-${b.key}-${slot.step});`);
  }
  const decorStep = 300;
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
  parts.push(
    [
      '/* CTA 専用アクセント（第3のオプション役割）。既定は操作色へのフォールバック。',
      '   セレクタが `:root, [data-brand]` なのは CSS の仕様上の要請（theme.css の',
      '   ティント面と同じ）。カスタムプロパティ内の var() は宣言された要素で解決されて',
      '   から継承されるため、:root だけに書くと [data-brand] 子孫でブランドの操作色に',
      '   追従せず、既定ブランドの色で凍結される（polastack の料金 CTA がティールに',
      "   なる実バグが出た）。専用 CTA 色を持つブランドのみ [data-brand='...'] で上書きする。 */",
      ':root,',
      '[data-brand] {',
      ...CTA_SLOTS.map((s) => `  ${s.name}: var(${s.fallback});`),
      '}',
    ].join('\n'),
  );
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

// ---- 業務 UI（ui-app）: [data-brand] で primary の段と、それに続いて決まる色を入れ替える ----
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** a を t の割合で b に混ぜる（semantic.css の選択中の面と同じ作り方） */
const mix = (a, b, t) => '#' + hexToRgb(a).map((x, i) => Math.round(x * t + hexToRgb(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
const DARK_SURFACE = '#121215';
/**
 * ブランドごとの値。コーポレートは既定（:root の tokens.css・semantic.css）と同じ値にする（入れ子で切り替えても既定に戻れるように）。
 * 装飾（ログインの画面の地・光・文字など）のコーポレートの値は、従来どおり装飾用の brand スケール。
 */
function appValues(b) {
  const corp = b.key === DEFAULT_BRAND;
  const r = b.ramp;
  return {
    light: {
      ...Object.fromEntries(STEP_VALUES.map((s) => [`--color-primary-${s}`, corp ? colors.primary[s] : r[s]])),
      '--color-surface-accent': corp ? '#E6F3F2' : mix(r[500], '#ffffff', 0.1),
      '--color-chart-1': corp ? colors.primary[500] : r[500],
      '--color-chart-1-subtle': corp ? colors.primary[50] : r[50],
      '--color-bg-brand-deep': corp ? colors.brand[950] : r[950],
      '--color-decor-brand': corp ? colors.brand[500] : r[300],
      '--color-decor-brand-strong': corp ? colors.brand[700] : r[700],
      '--color-text-brand-on-dark': corp ? colors.brand[300] : r[200],
    },
    dark: {
      '--color-surface-accent': corp ? '#0E2926' : mix(r[500], DARK_SURFACE, 0.2),
      '--color-chart-1': corp ? colors.primary[300] : r[300],
      '--color-chart-1-subtle': corp ? colors.primary[900] : r[900],
    },
  };
}
const decl = (o) => Object.entries(o).map(([k, v]) => `  ${k}: ${v};`).join('\n');
const appCss = [
  BANNER('業務 UI（ui-app）のブランド — data-brand で primary の段・選択中の面・グラフの 1 色目・装飾を切り替える'),
  '',
  '/* 装飾の既定（data-brand なし = コーポレート）。装飾色は濃い地の上の飾り（ログインの画面の地・光・アイコン・濃い地の文字）に使う。',
  '   白い地の上の文字・ボタンには使わない（コントラストが足りない）。 */',
  ':root {',
  decl(Object.fromEntries(Object.entries(appValues(brands.find((b) => b.key === DEFAULT_BRAND)).light).filter(([k]) => !k.startsWith('--color-primary-') && !k.startsWith('--color-chart') && k !== '--color-surface-accent'))),
  '}',
  '',
  ...brands.flatMap((b) => {
    const v = appValues(b);
    const sel = `[data-brand='${b.dataBrand}']`;
    return [
      `/* ${b.entry.label} */`,
      `${sel} {\n${decl(v.light)}\n}`,
      // ダークモード: .dark と data-brand が同じ要素にあっても、親子どちらにあっても効くように
      `.dark${sel},\n.dark ${sel},\n${sel} .dark {\n${decl(v.dark)}\n}`,
      '',
    ];
  }),
].join('\n');

writeFileSync(resolve(tokensRoot, 'css/brand.css'), brandCss);
writeFileSync(resolve(repoRoot, 'packages/ui-app/src/styles/generated-brand.css'), appCss);
writeFileSync(resolve(repoRoot, 'packages/ui-web/src/styles/generated-brand.css'), uiCss);

console.log(`codegen: ${brands.length} ブランドを出力（${brands.map((b) => b.key).join(', ')}）`);
console.log('  - packages/tokens/css/brand.css');
console.log('  - packages/ui-web/src/styles/generated-brand.css');
console.log('  - packages/ui-app/src/styles/generated-brand.css');
