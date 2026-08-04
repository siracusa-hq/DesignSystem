/**
 * ブランドレジストリ — テーマ契約の登録簿
 *
 * ブランドの追加は原則ここに **色相1つ**（mode: 'generated'）を書くだけ。
 * 既存公開色を持つブランド（コーポレート・タックスピア等）だけが
 * mode: 'explicit' で hex を直接登録できる。
 *
 * 段の契約（L / C）からの逸脱は `deviations` に理由を書かない限り
 * brand-contract.test.ts が落とす。
 *
 * 決定の経緯は docs/theme-contract-spec.md §12 を参照。
 */

import { generateRamp, type Step } from './ramp';

/** スロット名 → 参照する段の上書き（deep 型ブランドのホバー段差し替え等） */
export type SlotOverrides = Partial<Record<string, Step>>;

interface BrandCommon {
  /** 表示名 */
  label: string;
  /** スロットの参照段をブランド単位で上書きする（例: deep 型は hover を 700 に） */
  slotOverrides?: SlotOverrides;
  /**
   * 段契約からの意図的な逸脱の宣言。キー = 段、値 = 理由。
   * explicit 登録で |L - 契約L| > EXPLICIT_L_TOLERANCE の段はここに必須。
   */
  deviations?: Partial<Record<Step, string>>;
}

export interface GeneratedBrand extends BrandCommon {
  mode: 'generated';
  /** OKLCH 色相角（0..360）。ブランド登録で書く唯一の色情報 */
  hue: number;
  /** 彩度倍率（契約帯: 操作段実効 C 0.06〜0.15）。既定 1 */
  chromaScale?: number;
  /** 操作段の L（deep 型）。契約帯 0.500〜0.553。既定 0.553 */
  actionL?: number;
  /** 仮登録（実物確認前）なら true */
  provisional?: boolean;
}

export interface ExplicitBrand extends BrandCommon {
  mode: 'explicit';
  /** explicit 登録が必要な理由（既存公開色の維持など） */
  reason: string;
  ramp: Record<Step, string>;
}

export type BrandEntry = (GeneratedBrand | ExplicitBrand) & {
  /** 配下製品（ピアデスクシリーズ等）。data-brand は `${親キー}-${製品キー}` になる */
  products?: Record<string, GeneratedBrand | ExplicitBrand>;
};

/**
 * 既定ブランド（data-brand 属性なし = :root のスロットが指す先）
 */
export const DEFAULT_BRAND = 'corporate';

export const registry: Record<string, BrandEntry> = {
  /**
   * コーポレート（ティール）— 公開済みの現行色を一切変えないため explicit。
   * 300 段のみ現行 brand-500（#13c3a0）を採用（Q2 決定: 操作/装飾は同一ランプの2段）。
   * 現行 primary-300 #4db6ac は装飾段の役割を持たないため、ランプには含めない。
   */
  corporate: {
    label: 'コーポレート（Siracusa）',
    mode: 'explicit',
    reason:
      '公開済みの現行 primary スケールを維持する（生成器の単一色相では現行2色 H180.4/H173.4 を同時再現できない。spec §6.2）',
    ramp: {
      50: '#e0f2f1',
      100: '#b2dfdb',
      200: '#80cbc4',
      300: '#13c3a0', // 現行 brand-500。装飾段（Q2 決定）
      400: '#26a69a',
      500: '#008575',
      600: '#007567',
      700: '#006055',
      800: '#004c43',
      900: '#003831',
      950: '#00231f',
    },
  },

  /**
   * Polastack（濃紺・deep 型）— 2026-08-04 ブランド決定（スウォッチ v6〜v8 の3巡で確定）。
   * H=265 / C×1.10 / 操作段 L=0.420（#2f4989、白文字 8.62:1）。
   * 「存在感がありつつ落ち着いた濃紺」= 彩度を保ち明度を沈める。
   * deep 型のため 500 が 600 より暗い。ホバーは 700、押下は 800 を充てる。
   */
  polastack: {
    label: 'Polastack（Enterprise Agent Stack）',
    mode: 'generated',
    hue: 265,
    chromaScale: 1.1,
    actionL: 0.42,
    slotOverrides: {
      '--color-bg-brand-hover': 700,
      '--color-bg-brand-active': 800,
    },
  },

  /**
   * ピアデスク シリーズ（濃鼠・額縁戦略）— 2026-08-03 ブランド決定。
   * シリーズ色はほぼ無彩の暗色（#4a464e、白文字 9.22:1）にとどめ、
   * 配下製品の色を主役にする。500/600 は額縁用アンカーの explicit 値のため
   * 契約 L から大きく外れる（意図的・deviations 参照）。
   */
  peerdesk: {
    label: 'ピアデスク シリーズ',
    mode: 'explicit',
    reason:
      '額縁戦略: シリーズ色は L0.40 の濃鼠。操作段の契約 L 帯より暗いが、白文字コントラストは暗いほど強くなるため AA は常に満たす（spec §12 Q8/Q9）',
    ramp: {
      50: '#f3eff6',
      100: '#d9d6db',
      200: '#c3bfc7',
      300: '#aca4b1',
      400: '#928c98',
      500: '#4a464e', // 濃鼠（決定アンカー）
      600: '#3a363e', // hover（決定アンカー）
      700: '#545057',
      800: '#423f45',
      900: '#353139', // フッター濃色（決定アンカー）
      950: '#1e1c1f',
    },
    deviations: {
      500: '額縁戦略の決定アンカー #4a464e（L 0.40）。白文字 9.22:1 で AA 超過',
      600: 'hover アンカー #3a363e（L 0.34）。500 より暗い方向に統一',
    },
    slotOverrides: {
      // 700 (#545057) は 500 より明るいため押下には使えない。900 を充てる
      '--color-bg-brand-active': 900,
    },
    products: {
      /**
       * タックスピア — ピアデスク第一弾（実在製品）。既存3色を維持する explicit。
       * data-brand="peerdesk-taxpeer"
       */
      taxpeer: {
        label: 'タックスピア',
        mode: 'explicit',
        reason: '実在製品の既存公開色（千歳緑 #2F6847 / 濃色 #1D4630 / 淡色帯 #EAF3EC）を維持する',
        ramp: {
          50: '#eaf3ec', // 既存 淡色帯（≒50段、L差 .005）
          100: '#c3e0cc',
          200: '#9dcfaf',
          300: '#6abc8b',
          400: '#5aa176',
          500: '#2f6847', // 既存 主色 千歳緑（L .469）
          600: '#3e7152',
          700: '#325d43',
          800: '#1d4630', // 既存 濃色（≒800段、L差 .016）
          900: '#1b3626',
          950: '#0f2216',
        },
        deviations: {
          500: '既存製品の主色 #2F6847（L 0.469）。白文字 6.58:1 で AA 超過',
        },
        slotOverrides: {
          // 600 (#3e7152) は 500 より明るい。hover は 700、押下は 800 を充てる
          '--color-bg-brand-hover': 700,
          '--color-bg-brand-active': 800,
        },
      },
    },
  },
};

/** レジストリのエントリからランプ実体を解決する */
export function resolveRamp(entry: GeneratedBrand | ExplicitBrand): Record<Step, string> {
  if (entry.mode === 'explicit') return entry.ramp;
  return generateRamp(entry.hue, {
    chromaScale: entry.chromaScale,
    actionL: entry.actionL,
  }).steps;
}

export interface ResolvedBrand {
  /** レジストリのキー（製品は `${親}-${製品}`） */
  key: string;
  /** data-brand 属性値。既定ブランドは属性なしでも効く */
  dataBrand: string;
  entry: GeneratedBrand | ExplicitBrand;
  ramp: Record<Step, string>;
}

/** 全ブランド + 配下製品をフラットに解決する（codegen / テストの共通入力） */
export function resolveAllBrands(): ResolvedBrand[] {
  const out: ResolvedBrand[] = [];
  for (const [key, entry] of Object.entries(registry)) {
    out.push({ key, dataBrand: key, entry, ramp: resolveRamp(entry) });
    for (const [productKey, product] of Object.entries(entry.products ?? {})) {
      const full = `${key}-${productKey}`;
      out.push({ key: full, dataBrand: full, entry: product, ramp: resolveRamp(product) });
    }
  }
  return out;
}
