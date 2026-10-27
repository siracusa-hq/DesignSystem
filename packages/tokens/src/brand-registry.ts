/**
 * ブランドレジストリ — テーマ契約の登録簿
 *
 * ブランドの追加はここに **色相1つ**（＋彩度倍率・操作段の L）を書くだけ。50〜950 の段は生成器が作る。
 * 公開済みの決定色（ロゴ・公開サイトで使っている色）は `anchors` でその段に固定する（固定した段は生成しない）。
 *
 * 2026-10-27 に、値を手で書く登録（explicit）を廃止し、全ブランドを生成＋アンカーに統一した。
 * あわせて「段の数字が大きいほど暗い」を全ブランドの契約にした（deep 型のホバー段の差し替え
 * slotOverrides は不要になったので廃止）。経緯は docs/theme-contract-spec.md §12 Q13。
 */

import { generateRamp, type Step } from './ramp';

export interface BrandEntry {
  /** 表示名 */
  label: string;
  /** OKLCH 色相角（0..360） */
  hue: number;
  /** 彩度倍率（契約帯: 操作段実効 C 0.06〜0.15）。既定 1 */
  chromaScale?: number;
  /** 操作段の L（deep 型）。契約帯 0.42〜0.553。既定 0.553。500 をアンカーで固定するときは使わない */
  actionL?: number;
  /** 公開済みの決定色を固定する段。理由はエントリの説明に書く */
  anchors?: Partial<Record<Step, string>>;
  /** 操作段の L 帯・彩度帯の契約から外れる理由（額縁戦略のような意図的な暗い無彩色など）。書いたときだけテストが帯を見ない */
  actionBandExemption?: string;
  /** 仮登録（実物確認前）なら true */
  provisional?: boolean;
  /** 配下製品（ピアデスクシリーズ等）。data-brand は `${親キー}-${製品キー}` になる */
  products?: Record<string, Omit<BrandEntry, 'products'>>;
}

/**
 * 既定ブランド（data-brand 属性なし = :root のスロットが指す先）
 */
export const DEFAULT_BRAND = 'corporate';

export const registry: Record<string, BrandEntry> = {
  /**
   * コーポレート（ティール）。色相・彩度は操作色 #008575 から求めた値（H 180.4・C 0.100）。
   * アンカー: 500 = 操作色 #008575（白文字 4.55:1）、300 = 装飾色 #13c3a0（現行 brand-500。Q2 決定: 操作/装飾は同一ランプの2段）。
   * 2026-10-27 に explicit（Material の teal の値）から生成に移した。ほかの段は契約どおりに作り直したため、わずかに変わった。
   */
  corporate: {
    label: 'コーポレート（Siracusa）',
    hue: 180.4,
    chromaScale: 1.0,
    anchors: { 300: '#13c3a0', 500: '#008575' },
  },

  /**
   * Polastack（濃紺・deep 型）— 2026-08-04 ブランド決定（スウォッチ v6〜v8 の3巡で確定）。
   * H=265 / C×1.10 / 操作段 L=0.420（#2f4989、白文字 8.62:1）。
   * 「存在感がありつつ落ち着いた濃紺」= 彩度を保ち明度を沈める。
   * アンカー: スウォッチで承認した 300・500・900・950。600〜800 は 500 と 900 のあいだに暗い順で並ぶ。
   */
  polastack: {
    label: 'Polastack（Enterprise Agent Stack）',
    hue: 265,
    chromaScale: 1.1,
    anchors: { 300: '#7da5fd', 500: '#2f4989', 900: '#202e4e', 950: '#121c33' },
  },

  /**
   * Proofline（深青・deep 型）— 2026-10-27 ブランド決定。
   * H=225 / C×1.05 / 操作段 L=0.460（#06617c、白文字 6.98:1）。
   * セキュリティ・ガバナンス製品のため、統制と検証を示す濃い青を基調にする。
   * 緑系は成功状態（--c-ok 相当）と意味が衝突し、状態色の設計余地を奪うため採らない。
   * 色相は社内で空いている帯を選んだ: コーポレート 180.4 から 45 度、
   * タックスピア 156.0 から 69 度、Polastack 265.3 から 40 度。
   * アンカー: ロゴの主色 500（#06617c）とアクセント 300（#14b8e7）。
   */
  proofline: {
    label: 'Proofline',
    hue: 225,
    chromaScale: 1.05,
    anchors: { 300: '#14b8e7', 500: '#06617c' },
  },

  /**
   * ピアデスク シリーズ（濃鼠・額縁戦略）— 2026-08-03 ブランド決定。
   * シリーズ色はほぼ無彩の暗色（#4a464e、白文字 9.22:1）にとどめ、配下製品の色を主役にする。
   * 色相・彩度は #4a464e から求めた値（H 308.1・C 0.014）。
   * アンカー: 50（淡色面）・300（ライト。ロゴの副次要素）・500（濃鼠）・600（hover）・900（フッター濃色）。
   */
  peerdesk: {
    label: 'ピアデスク シリーズ',
    hue: 308.1,
    chromaScale: 0.14,
    anchors: { 50: '#f3eff6', 300: '#aca4b1', 500: '#4a464e', 600: '#3a363e', 900: '#353139' },
    actionBandExemption: '額縁戦略: シリーズ色は L 0.40・ほぼ無彩（C 0.014）の濃鼠。操作段の帯より暗く無彩だが、白文字は暗いほど強くなるので AA は常に満たす。彩度で目立たせず、配下製品の色を主役にする（spec §12 Q8/Q9）',
    products: {
      /**
       * タックスピア — ピアデスク第一弾（実在製品）。data-brand="peerdesk-taxpeer"
       * 色相・彩度は千歳緑 #2F6847 から求めた値（H 156.0・C 0.081）。
       * アンカー: 既存の公開色（淡色帯 50 #EAF3EC・主色 500 #2F6847・濃色 800 #1D4630）。
       */
      taxpeer: {
        label: 'タックスピア',
        hue: 156.0,
        chromaScale: 0.81,
        anchors: { 50: '#eaf3ec', 500: '#2f6847', 800: '#1d4630' },
      },
    },
  },
};

/** レジストリのエントリからランプ実体を解決する */
export function resolveRamp(entry: Omit<BrandEntry, 'products'>): Record<Step, string> {
  return generateRamp(entry.hue, {
    chromaScale: entry.chromaScale,
    actionL: entry.actionL,
    anchors: entry.anchors,
  }).steps;
}

export interface ResolvedBrand {
  /** レジストリのキー（製品は `${親}-${製品}`） */
  key: string;
  /** data-brand 属性値。既定ブランドは属性なしでも効く */
  dataBrand: string;
  entry: Omit<BrandEntry, 'products'>;
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
