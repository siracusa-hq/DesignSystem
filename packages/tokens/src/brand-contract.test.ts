/**
 * テーマ契約テスト — docs/theme-contract-spec.md §8 の実装
 *
 * バクラクの実測で確認された「契約の破れ方」を CI で塞ぐ:
 *   (a) 段の L 混在（-60/-70 分裂で L* が 38.5〜57.0 にばらけた事故）
 *   (b) AA 不適合の操作色（バクラク7色中4色が白地 AA 未達だった事故）
 *   (c) ダーク面での不適合（操作段はダーク面テキストに使えない）
 *   (d) 公開済みの現行色とのドリフト
 *   (e) 生成 CSS とレジストリのズレ（コミット漏れ・手編集の検出）
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { primary, brand } from './colors';
import { contrastRatio, hexToOklch } from './color';
import {
  ACTION_CHROMA_BAND,
  ACTION_L_BAND,
  ACTION_MIN_CONTRAST,
  EXPLICIT_L_TOLERANCE,
  SLOTS,
  STEPS,
  STEP_VALUES,
} from './ramp';
import { registry, resolveAllBrands } from './brand-registry';

const brands = resolveAllBrands();
const contractL = Object.fromEntries(STEPS.map((s) => [s.step, s.L]));

/** ダーク面の基準色（spec §12 Q5: 最悪ケース #1C1C1F を含める） */
const DARK_SURFACES = ['#09090b', '#1C1C1F'];

describe('(a) 段の規則 — L の混在を許さない', () => {
  for (const b of brands) {
    it(`${b.key}: 全段の L が契約値に一致する（explicit は ±${EXPLICIT_L_TOLERANCE}、宣言済み逸脱を除く）`, () => {
      for (const step of STEP_VALUES) {
        const actual = hexToOklch(b.ramp[step]).L;
        const declared = b.entry.deviations?.[step];
        if (declared) {
          expect(declared.length, `${b.key}-${step} の逸脱理由が空`).toBeGreaterThan(0);
          continue;
        }
        const expected =
          b.entry.mode === 'generated' && step === 500
            ? (b.entry.actionL ?? contractL[500])
            : contractL[step];
        const tolerance = b.entry.mode === 'generated' ? 0.004 : EXPLICIT_L_TOLERANCE;
        expect(
          Math.abs(actual - expected),
          `${b.key}-${step}: L=${actual.toFixed(4)} 期待=${expected}`,
        ).toBeLessThanOrEqual(tolerance);
      }
    });
  }

  it('生成ブランドの操作段は L 帯・彩度帯（契約改定 2026-08-03）の内側にある', () => {
    for (const b of brands) {
      if (b.entry.mode !== 'generated') continue;
      const { L, C } = hexToOklch(b.ramp[500]);
      expect(L).toBeGreaterThanOrEqual(ACTION_L_BAND.min - 0.004);
      expect(L).toBeLessThanOrEqual(ACTION_L_BAND.max + 0.004);
      expect(C).toBeGreaterThanOrEqual(ACTION_CHROMA_BAND.min);
      expect(C).toBeLessThanOrEqual(ACTION_CHROMA_BAND.max + 0.001);
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
      // 500 がダーク面で AA を満たすブランド（peerdesk 等の explicit 暗色）は例外的に存在するが、
      // 契約としては「ダーク面のテキストは 300（--color-text-brand-on-dark）」で統一する。
      // このテストは 300 が常に使えること（上のテスト）で担保されるため、ここでは退行検知のみ:
      expect(contrastRatio(b.ramp[300], '#09090b')).toBeGreaterThan(
        contrastRatio(b.ramp[500], '#09090b'),
      );
    });
  }
});

describe('(d) 公開済みの現行色とのドリフト検出', () => {
  it('corporate ランプは現行 primary スケールと一致する（300 段のみ現行 brand-500）', () => {
    const corporate = brands.find((b) => b.key === 'corporate')!;
    for (const step of STEP_VALUES) {
      const expected = step === 300 ? brand[500] : primary[step as keyof typeof primary];
      expect(corporate.ramp[step], `corporate-${step}`).toBe(expected);
    }
  });

  it('ブランド決定のアンカー hex（スウォッチ承認値）が再現される', () => {
    const get = (key: string) => brands.find((b) => b.key === key)!.ramp;
    // Polastack deep（2026-08-03 決定）
    expect(get('polastack')[500]).toBe('#3d5eaf');
    expect(get('polastack')[300]).toBe('#7da5fd');
    expect(get('polastack')[900]).toBe('#1c2d55');
    expect(get('polastack')[950]).toBe('#101b37');
    // ピアデスク 濃鼠（2026-08-03 決定）
    expect(get('peerdesk')[500]).toBe('#4a464e');
    expect(get('peerdesk')[600]).toBe('#3a363e');
    expect(get('peerdesk')[50]).toBe('#f3eff6');
    expect(get('peerdesk')[900]).toBe('#353139');
    // タックスピア既存3色
    expect(get('peerdesk-taxpeer')[500]).toBe('#2f6847');
    expect(get('peerdesk-taxpeer')[800]).toBe('#1d4630');
    expect(get('peerdesk-taxpeer')[50]).toBe('#eaf3ec');
  });
});

describe('(e) 生成 CSS とレジストリの同期', () => {
  const cssFiles = [
    resolve(__dirname, '../css/brand.css'),
    resolve(__dirname, '../../ui-app/src/styles/generated-brand.css'),
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

  it('スロットの参照段（slotOverrides 適用後）が CSS に反映されている', () => {
    const css = readFileSync(cssFiles[0], 'utf8');
    // polastack: deep 型のため hover=700 / active=800
    expect(css).toContain('--color-bg-brand-hover: var(--ramp-polastack-700);');
    expect(css).toContain('--color-bg-brand-active: var(--ramp-polastack-800);');
    // peerdesk: active=900
    expect(css).toContain('--color-bg-brand-active: var(--ramp-peerdesk-900);');
    // taxpeer: hover=700 / active=800
    expect(css).toContain('--color-bg-brand-hover: var(--ramp-peerdesk-taxpeer-700);');
  });

  it('SLOTS の参照段はすべて契約の段に存在する', () => {
    for (const slot of SLOTS) {
      if (slot.step !== undefined) {
        expect(STEP_VALUES).toContain(slot.step);
      }
    }
    for (const [key, entry] of Object.entries(registry)) {
      for (const [slotName, step] of Object.entries(entry.slotOverrides ?? {})) {
        expect(
          SLOTS.map((s) => s.name),
          `${key} の slotOverrides キー ${slotName}`,
        ).toContain(slotName);
        expect(STEP_VALUES).toContain(step);
      }
    }
  });
});
