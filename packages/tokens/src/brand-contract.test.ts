/**
 * テーマ契約テスト — docs/theme-contract-spec.md §8 の実装
 *
 * バクラクの実測で確認された「契約の破れ方」を CI で塞ぐ:
 *   (a) 段の L 混在（-60/-70 分裂で L* が 38.5〜57.0 にばらけた事故）と、段の並びの崩れ
 *       （deep 型で 600 が 500 より明るく、ホバーで色が明るくなる。2026-10-27 に契約にした）
 *   (b) AA 不適合の操作色（バクラク7色中4色が白地 AA 未達だった事故）
 *   (c) ダーク面での不適合（操作段はダーク面テキストに使えない）
 *   (d) 公開済みの現行色とのドリフト
 *   (e) 生成 CSS とレジストリのズレ（コミット漏れ・手編集の検出）
 *   (f) :root 凍結（ブランド上書き変数を参照するプロパティが :root にだけ
 *       宣言され、data-brand 切替に追従しなくなる事故）
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { primary } from './colors';
import { contrastRatio, hexToOklch } from './color';
import {
  ACTION_CHROMA_BAND,
  CTA_SLOTS,
  ACTION_L_BAND,
  ACTION_MIN_CONTRAST,
  SLOTS,
  STEPS,
  STEP_VALUES,
  stepLightness,
} from './ramp';
import { registry, resolveAllBrands } from './brand-registry';

const brands = resolveAllBrands();
const contractL = Object.fromEntries(STEPS.map((s) => [s.step, s.L]));

/** ダーク面の基準色（spec §12 Q5: 最悪ケース #1C1C1F を含める） */
const DARK_SURFACES = ['#09090b', '#1C1C1F'];

describe('(a) 段の規則 — L の混在と並びの崩れを許さない', () => {
  for (const b of brands) {
    it(`${b.key}: 段の数字が大きいほど暗い（L が単調に減る）`, () => {
      for (let i = 1; i < STEP_VALUES.length; i++) {
        const prev = STEP_VALUES[i - 1]!;
        const step = STEP_VALUES[i]!;
        expect(
          hexToOklch(b.ramp[step]).L,
          `${b.key}-${step}（${b.ramp[step]}）が ${prev}（${b.ramp[prev]}）より暗くない`,
        ).toBeLessThan(hexToOklch(b.ramp[prev]).L);
      }
    });

    it(`${b.key}: アンカーの段は登録した hex のまま、ほかの段の L は契約（暗い側は 500 とアンカーを通る写像）に一致する`, () => {
      const anchors = b.entry.anchors ?? {};
      const L500 = hexToOklch(b.ramp[500]).L;
      const expectedL = stepLightness(L500, anchors);
      for (const step of STEP_VALUES) {
        const fixed = anchors[step];
        if (fixed) {
          expect(b.ramp[step], `${b.key}-${step}`).toBe(fixed.toLowerCase());
          continue;
        }
        const actual = hexToOklch(b.ramp[step]).L;
        const expected = step === 500 ? (b.entry.actionL ?? contractL[500]) : expectedL[step];
        expect(
          Math.abs(actual - expected),
          `${b.key}-${step}: L=${actual.toFixed(4)} 期待=${expected.toFixed(4)}`,
        ).toBeLessThanOrEqual(0.004);
      }
    });
  }

  it('操作段は L 帯・彩度帯（契約改定 2026-08-03）の内側にある（理由を宣言したブランドは帯を見ない）', () => {
    for (const b of brands) {
      const { L, C } = hexToOklch(b.ramp[500]);
      if (b.entry.actionBandExemption) {
        expect(b.entry.actionBandExemption.length).toBeGreaterThan(0);
        continue;
      }
      expect(L, `${b.key}-500 の L`).toBeGreaterThanOrEqual(ACTION_L_BAND.min - 0.004);
      expect(L, `${b.key}-500 の L`).toBeLessThanOrEqual(ACTION_L_BAND.max + 0.004);
      expect(C, `${b.key}-500 の C`).toBeGreaterThanOrEqual(ACTION_CHROMA_BAND.min);
      expect(C, `${b.key}-500 の C`).toBeLessThanOrEqual(ACTION_CHROMA_BAND.max + 0.001);
    }
  });
});

describe('(b) 操作段の白文字 AA — 全ブランド', () => {
  for (const b of brands) {
    it(`${b.key}: 500 の白文字コントラスト ≥ ${ACTION_MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(b.ramp[500], '#ffffff')).toBeGreaterThanOrEqual(ACTION_MIN_CONTRAST);
    });
  }
});

describe('(c) 装飾段の構造的保証 — 全ブランド', () => {
  for (const b of brands) {
    it(`${b.key}: 300 は明背景テキストに使えず（<4.5）、ダーク面テキストには使える（≥4.5）`, () => {
      expect(
        contrastRatio(b.ramp[300], '#ffffff'),
        '装飾段が白地 AA を満たしてしまう場合、操作/装飾の分離が壊れている',
      ).toBeLessThan(4.5);
      for (const dark of DARK_SURFACES) {
        expect(
          contrastRatio(b.ramp[300], dark),
          `${b.key}-300 は ${dark} 上で AA 未達`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${b.key}: 操作段(500)をダーク面のテキストに使ってはならない根拠（参考値の記録）`, () => {
      // 500 がダーク面で AA を満たすブランド（peerdesk 等の暗色）は例外的に存在するが、
      // 契約としては「ダーク面のテキストは 300（--color-text-brand-on-dark）」で統一する。
      // このテストは 300 が常に使えること（上のテスト）で担保されるため、ここでは退行検知のみ:
      expect(contrastRatio(b.ramp[300], '#09090b')).toBeGreaterThan(
        contrastRatio(b.ramp[500], '#09090b'),
      );
    });
  }
});

describe('(d) 公開済みの現行色とのドリフト検出', () => {
  it('primary スケール（colors.ts・ui-app と ui-web の CSS）は corporate ランプと一致する（300 段だけは primary 独自の #4db6ac）', () => {
    // 2026-10-27 に corporate を生成へ移したので、向きを「ランプが正、primary はその写し」にした
    const corporate = brands.find((b) => b.key === 'corporate')!;
    for (const step of STEP_VALUES) {
      if (step === 300) continue;
      expect(primary[step as keyof typeof primary], `primary-${step}`).toBe(corporate.ramp[step]);
    }
  });

  it('ロゴの色（アンカー）が再現される', () => {
    const get = (key: string) => brands.find((b) => b.key === key)!.ramp;
    expect(get('corporate')[500]).toBe('#008575');
    expect(get('polastack')[500]).toBe('#2f4989');
    expect(get('proofline')[500]).toBe('#06617c');
    expect(get('peerdesk')[500]).toBe('#4a464e');
    expect(get('peerdesk')[300]).toBe('#aca4b1');
    expect(get('peerdesk-taxpeer')[500]).toBe('#2f6847');
  });
});

describe('(e) 生成 CSS とレジストリの同期', () => {
  // ui-app には出力しない（spec §12 Q10: スコープ外・コーポレート固定。
  // 装飾色を業務UIに公開しない原則にも反するため）
  const cssFiles = [
    resolve(__dirname, '../css/brand.css'),
    resolve(__dirname, '../../ui-web/src/styles/generated-brand.css'),
  ];

  for (const file of cssFiles) {
    const short = file.split('/packages/')[1];
    it(`${short}: 全ブランド・全段のランプ変数が最新値で存在する`, () => {
      const css = readFileSync(file, 'utf8');
      for (const b of brands) {
        for (const step of STEP_VALUES) {
          expect(css, `--ramp-${b.key}-${step}`).toContain(
            `--ramp-${b.key}-${step}: ${b.ramp[step]};`,
          );
        }
        expect(css).toContain(`[data-brand='${b.dataBrand}']`);
      }
      for (const slot of SLOTS) {
        expect(css, slot.name).toContain(slot.name);
      }
    });
  }

  it('ホバー・押下はどのブランドも 600・700（段の並びを統一したので、ブランドごとの差し替えはない）', () => {
    const css = readFileSync(cssFiles[0], 'utf8');
    for (const b of brands) {
      expect(css).toContain(`--color-bg-brand-hover: var(--ramp-${b.key}-600);`);
      expect(css).toContain(`--color-bg-brand-active: var(--ramp-${b.key}-700);`);
    }
  });

  it('CTA スロット（第3役割）が既定フォールバックとして出力されている', () => {
    for (const file of cssFiles) {
      const css = readFileSync(file, 'utf8');
      for (const slot of CTA_SLOTS) {
        expect(css, slot.name).toContain(`${slot.name}: var(${slot.fallback});`);
      }
    }
  });

  it('SLOTS の参照段はすべて契約の段に存在する', () => {
    for (const slot of SLOTS) {
      if (slot.step !== undefined) {
        expect(STEP_VALUES).toContain(slot.step);
      }
    }
    for (const [key, entry] of Object.entries(registry)) {
      for (const step of Object.keys(entry.anchors ?? {})) {
        expect(STEP_VALUES, `${key} のアンカーの段 ${step}`).toContain(Number(step));
      }
    }
  });
});

describe('(f) :root 凍結ガード — ブランド追従すべき変数が :root にだけ宣言されていない', () => {
  /*
   * カスタムプロパティ内の var() は**宣言された要素で解決されてから継承される**
   * （CSS Custom Properties の仕様）。そのため、[data-brand='…'] で上書きされる
   * 変数を参照するプロパティを :root にだけ宣言すると、その解決結果が既定
   * ブランドの色で凍結され、data-brand 切替に追従しない。
   *
   * 実際に --color-bg-cta がこの形で全ブランドでティールに凍結されていた
   * （polastack の製品LPで料金 CTA だけ青にならない形で顕在化）。
   * 修正はセレクタを `:root, [data-brand]` にすること。ここではその再発を
   * 特定の変数名ではなく**構造**で止める: 「ブランド上書き変数を参照する
   * プロパティは、[data-brand] を含むセレクタでも宣言されていなければならない」。
   */
  const generatedCssFiles = [
    resolve(__dirname, '../css/brand.css'),
    resolve(__dirname, '../../ui-web/src/styles/generated-brand.css'),
  ];

  interface Rule {
    selector: string;
    declarations: [name: string, value: string][];
  }

  function parseFlatRules(css: string): Rule[] {
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const rules: Rule[] = [];
    for (const m of noComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = m[1].trim();
      if (selector.startsWith('@')) continue;
      const declarations = [...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(
        (d) => [d[1], d[2].trim()] as [string, string],
      );
      rules.push({ selector, declarations });
    }
    return rules;
  }

  for (const file of generatedCssFiles) {
    const short = file.split('/packages/')[1];
    it(`${short}: ブランド上書き変数を参照するプロパティは [data-brand] でも宣言されている`, () => {
      const rules = parseFlatRules(readFileSync(file, 'utf8'));

      /* [data-brand='x'] ブロックで上書きされる変数（= ブランドごとに値が変わる変数） */
      const brandOverridden = new Set(
        rules
          .filter((r) => r.selector.includes("[data-brand='"))
          .flatMap((r) => r.declarations.map(([name]) => name)),
      );
      expect(brandOverridden.size).toBeGreaterThan(0);

      /* 各プロパティが [data-brand]（無印含む）を含むセレクタで宣言されているか */
      const declaredUnderDataBrand = new Set(
        rules
          .filter((r) => r.selector.includes('[data-brand'))
          .flatMap((r) => r.declarations.map(([name]) => name)),
      );

      for (const rule of rules) {
        if (rule.selector.includes('[data-brand')) continue;
        if (!rule.selector.split(',').some((s) => s.trim() === ':root')) continue;
        for (const [name, value] of rule.declarations) {
          const refs = [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((r) => r[1]);
          const frozenRefs = refs.filter((ref) => brandOverridden.has(ref));
          if (frozenRefs.length === 0) continue;
          expect(
            declaredUnderDataBrand.has(name),
            `${name} は ${frozenRefs.join(', ')} を参照しているのに :root にしか宣言がない。` +
              '解決結果が既定ブランドで凍結され data-brand 切替に追従しなくなる。' +
              'セレクタを `:root, [data-brand]` にすること（codegen.mjs の slotsBlock 参照）',
          ).toBe(true);
        }
      }
    });
  }
});
