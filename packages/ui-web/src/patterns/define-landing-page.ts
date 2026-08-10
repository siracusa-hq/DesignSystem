import type * as React from 'react';
import type { PageBrand, PageTone, PageCTAClickHandler } from '@/components/layout/page';
import type { HeroSectionProps } from '@/components/sections/hero-section';
import type { LogoCloudProps } from '@/components/sections/logo-cloud';
import type { StatsSectionProps } from '@/components/sections/stats-section';
import type { FeatureGridProps } from '@/components/sections/feature-grid';
import type { PricingTableProps } from '@/components/sections/pricing';
import type { CaseStudySectionProps } from '@/components/sections/case-study-card';
import type { CaseStudyListSectionProps } from '@/components/sections/case-study-list';
import type { FAQSectionProps } from '@/components/sections/faq-section';
import type { ServicePortfolioProps } from '@/components/sections/service-portfolio';
import type { CTASectionProps } from '@/components/sections/cta-section';
import type { MarketingHeaderProps } from '@/components/layout/marketing-header';
import type { MarketingFooterProps } from '@/components/layout/marketing-footer';

/**
 * defineLandingPage — LP 量産のためのデータ駆動 API（composition-redesign.md §3-5a）。
 *
 * AI の仕事を「デザインする」から「フォームを埋める」に変える。
 * 構成（セクションの順序・面と余白のリズム・CTA の配置）はパターンが決め、
 * 呼び出し側は内容だけを渡す。必須スロットの欠落は型エラーで落ちる。
 *
 * この関数は JSX を作らない純粋な正規化（パターン既定の充填）だけを行い、
 * 描画順序の実装は <LandingPage> に一元化されている。
 */

/** 2オファー（軽+重 または 軽+軽）。1つ目がプライマリ CTA になる */
export interface OfferAction {
  label: string;
  href: string;
}

/** セクション Props からページ層が管理する項目を除いたもの */
type Slot<P> = Omit<P, 'children'>;

/** オファーは最大2本（FV の CTA 2本が実測 13/17。3本目は型エラーで落とす） */
export type OfferPair = [OfferAction] | [OfferAction, OfferAction];

export interface LandingHero extends Pick<
  HeroSectionProps,
  'badge' | 'title' | 'subtitle' | 'image' | 'imagePlacement' | 'backdrop' | 'backdropTone'
> {
  /** 1〜2オファー。midCta / closing にも同じラベルが再利用される（ラベル2種ルール） */
  offers: OfferPair;
}

/** 社会的証明帯（ヒーロー直下、実測 9/12）。ロゴか数値のどちらか */
export type LandingProof = { logos: Slot<LogoCloudProps> } | { stats: Slot<StatsSectionProps> };

/** 中間 CTA 帯。指定時のみ挿入され、オファーは hero と同じものを使う */
export interface LandingMidCta {
  title: React.ReactNode;
  note?: string;
}

/** 最終 CTA 面。actions 省略時は hero のオファーを再利用する */
export interface LandingClosing extends Omit<Slot<CTASectionProps>, 'actions'> {
  actions?: OfferPair;
}

interface LandingPageCommon {
  brand: PageBrand;
  /** 省略時はパターンごとの既定（product 系 = product / lead-gen = campaign / corporate-top = trust） */
  tone?: PageTone;
  header?: MarketingHeaderProps;
  footer?: MarketingFooterProps;
}

/** 単一製品 LP（実測最多）。順序: Hero → 証明 → 機能 → (帯) → 料金 → 選ばれる理由 → 事例 → FAQ → 締め */
export interface ProductPageInput extends LandingPageCommon {
  pattern: 'product';
  hero: LandingHero;
  proof?: LandingProof;
  features: Slot<FeatureGridProps>;
  midCta?: LandingMidCta;
  /** 料金 → 事例の順で描画される（実測 4:1。composition-redesign.md §3-2） */
  pricing?: Slot<PricingTableProps>;
  reasons?: Slot<FeatureGridProps>;
  cases?: Slot<CaseStudySectionProps>;
  /** FAQ は任意（実測 5/12。必須セクションではない） */
  faq?: Slot<FAQSectionProps>;
  closing: LandingClosing;
}

/** 複数プロダクトの玄関（コンパウンド企業の主戦場・実測 7/19）。カードグリッドで下層 LP へ分岐 */
export interface PortfolioTopInput extends LandingPageCommon {
  pattern: 'product-portfolio-top';
  hero: LandingHero;
  proof?: LandingProof;
  products: Slot<ServicePortfolioProps>;
  midCta?: LandingMidCta;
  features?: Slot<FeatureGridProps>;
  cases?: Slot<CaseStudySectionProps>;
  closing: LandingClosing;
}

/** 獲得専用 LP。グローバルナビを剥がす（実測 2/2）。締めはフォーム */
export interface LeadGenInput extends Omit<LandingPageCommon, 'header'> {
  pattern: 'lead-gen';
  hero: Omit<LandingHero, 'offers'> & {
    /** フォームへ誘導する1オファーのみ（例: ページ内アンカー） */
    offers?: [OfferAction];
  };
  /** 資料の中身の箇条書き */
  contents: Slot<FeatureGridProps>;
  stats?: Slot<StatsSectionProps>;
  /** ContactForm / ResourceRequestForm / DemoRequestForm 等のフォーム要素 */
  form: React.ReactElement;
}

/** コーポレートトップ（ビジョンステートメント型）。コンバージョン CTA を持たない */
export interface CorporateTopInput extends LandingPageCommon {
  pattern: 'corporate-top';
  hero: Omit<LandingHero, 'offers'> & {
    /** 採用・会社案内など。コンバージョン用途に使わないこと */
    offers?: OfferPair;
  };
  services: Slot<ServicePortfolioProps>;
  stats?: Slot<StatsSectionProps>;
  about?: Slot<FeatureGridProps>;
  /** 主要導線は採用（LayerX 型）。省略可 */
  closing?: LandingClosing;
}

/**
 * 事例の一覧ページ（実測 2/2: SmartHR `/case/`、バクラク `/case/`）。
 *
 * この型だけヒーローを持たない。キャッチコピー型のヒーローではなく
 * 短いページタイトルから始まり、ピックアップ + 多軸フィルタ + カードグリッド
 * + ページネーションで構成される（composition-redesign.md §3-1）。
 */
export interface CaseStudyListInput extends LandingPageCommon {
  pattern: 'case-study-list';
  /** キャッチコピー型ヒーローは使わない（実測）。短いページタイトル */
  page: { eyebrow?: string; title: React.ReactNode; description?: string };
  list: Slot<CaseStudyListSectionProps>;
  /**
   * 事例ページ末尾の導線（任意）。
   * hero が無く再利用できるオファーが存在しないため、actions は必須。
   */
  closing?: Slot<CTASectionProps>;
}

export type LandingPageInput =
  ProductPageInput | PortfolioTopInput | LeadGenInput | CorporateTopInput | CaseStudyListInput;

export type LandingPagePattern = LandingPageInput['pattern'];

/** パターンごとの tone 既定 */
const DEFAULT_TONES: Record<LandingPagePattern, PageTone> = {
  product: 'product',
  'product-portfolio-top': 'product',
  'lead-gen': 'campaign',
  'corporate-top': 'trust',
  'case-study-list': 'product',
};

/**
 * ページ型の一覧（実行時に列挙できる形）。
 *
 * 実体は `DEFAULT_TONES` のキーで、`Record<LandingPagePattern, …>` により
 * **型が網羅を保証する**（型を増やして書き忘れるとコンパイルが落ちる）。
 * 値を2箇所に書かないため、配列リテラルとしては持たない。
 * 規範ファイル（AGENTS.md / GUIDELINES.md）との突き合わせに使う
 * （`src/test/guidelines-sync.test.ts`）。
 */
export const LANDING_PAGE_PATTERNS = Object.keys(DEFAULT_TONES) as readonly LandingPagePattern[];

/**
 * defineLandingPage が扱う「内容」とは別に、描画時に渡すイベント（計測フック）。
 * データ記述に混ぜないため、入力型ではなく LandingPage の props 側に足す。
 */
export interface LandingPageEvents {
  /**
   * ページ内の CTA クリックを一括で受け取る（Page.onCTAClick への素通し）。
   * 各 CTA の id はセクションが自動割当する（stage4-workorder.md §3）。
   */
  onCTAClick?: PageCTAClickHandler;
}

export type LandingPageProps = LandingPageInput & { tone: PageTone } & LandingPageEvents;

export function defineLandingPage<T extends LandingPageInput>(input: T): T & { tone: PageTone } {
  return {
    ...input,
    tone: input.tone ?? DEFAULT_TONES[input.pattern],
  };
}
