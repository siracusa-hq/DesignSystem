import type * as React from 'react';
import type { PageBrand, PageTone, PageCTAClickHandler } from '@/components/layout/page';
import type { HeroSectionProps } from '@/components/sections/hero-section';
import type { LogoCloudProps } from '@/components/sections/logo-cloud';
import type { StatsSectionProps } from '@/components/sections/stats-section';
import type { FeatureGridProps } from '@/components/sections/feature-grid';
import type { PricingTableProps } from '@/components/sections/pricing';
import type { CaseStudySectionProps } from '@/components/sections/case-study-card';
import type { CaseStudyListSectionProps } from '@/components/sections/case-study-list';
import type { CaseStudyMeta, CaseStudyListItem } from '@/components/sections/case-card';
import type { ArticleListSectionProps } from '@/components/sections/article-list';
import type { ArticleListItem } from '@/components/sections/article-card';
import type { ArticleBodySectionProps } from '@/components/sections/article-body';
import type { ResourceListSectionProps } from '@/components/sections/resource-list';
import type { SeminarListSectionProps } from '@/components/sections/seminar-list';
import type { SeminarDetailSectionProps } from '@/components/sections/seminar-detail';
import type { ContentHubSectionProps } from '@/components/sections/content-hub';
import type {
  CasePhoto,
  CaseSpeakerList,
  CaseSummary,
  CaseChapter,
  CaseStudyArticleLabels,
} from '@/components/sections/case-study-article';
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
  'title' | 'subtitle' | 'image' | 'imagePlacement' | 'backdrop' | 'backdropTone'
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
  /**
   * コンテンツ回遊（実測 9/13）。FAQ の後・締めの前に描画される。
   * **任意。** 9/13（69%）は必須化の水準ではなく、持たない4ページは
   * フッターに逃がす構成で成立している（content-hub-workorder.md §9）。
   */
  contentHub?: Slot<ContentHubSectionProps>;
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
  /** コンテンツ回遊（任意）。事例の後・締めの前に描画される */
  contentHub?: Slot<ContentHubSectionProps>;
  closing: LandingClosing;
}

/**
 * 獲得専用 LP。**既定ではグローバルナビを剥がす**（実測 2/2）。締めはフォーム。
 *
 * ただし**資料の個票ページは 6/6 がグローバルナビを持つ**（`[RS]` §3-2）。
 * 資料個票のためのページ型を新設せず、この型に `header?` を戻して兼ねる
 * （`lead-gen` との差分が `header` 1点しか無いため。
 * acquisition-pages-workorder.md §2）。**省略時に剥がす既定は据え置き**なので
 * 既存の呼び出しは1つも変わらない。
 */
export interface LeadGenInput extends LandingPageCommon {
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

/**
 * 個別の事例記事（実測 9 サイト × 3 記事 = 27 記事。
 * docs/research/research-case-study-detail.md）。
 *
 * `case-study-list` の遷移先で、この型もヒーローを持たない。
 * 記事タイトル → 会社プロフィール → 写真 → サマリー → 章 → 関連事例 → 締め、
 * という順序はパターンが決める（実測 9/9 で一致）。
 *
 * 実測が示したのは「サイト内では構成が完全に固定（一致率 97.6%）、
 * サイト間では割れる」という性質である。**選択肢はパターンのレベルで固定し、
 * 記事ごとには選ばせない**のが実測に合う。記事ごとに変わるのは
 * 章数・文字数・写真枚数という「量」だけ。
 */
export interface CaseStudyDetailInput extends LandingPageCommon {
  pattern: 'case-study-detail';
  article: {
    /** 成果か課題を含む1文（実測 8/9 がこの型。会社名だけのタイトルは採らない） */
    title: string;
    /** 一覧への戻り導線。実測 9/9 が持つため必須 */
    backTo: { label: string; href: string };
    /** 冒頭写真（実測 8/9） */
    photo?: CasePhoto;
    /** 本文前のリード段落（実測 6/9） */
    lead?: string;
    /** 公開日・取材時点（実測 2/9。dev 警告は出さない） */
    publishedAt?: string;
  };
  /** 会社プロフィール。実測 9/9 が持つため必須。一覧カードと同じ型を共有する */
  profile: CaseStudyMeta;
  /** 話者（実測 3/9 が明示ブロック、3/9 が写真キャプション）。最大4名 */
  speakers?: CaseSpeakerList;
  /** 冒頭サマリー（実測 5/9。課題と効果は対で現れる） */
  summary?: CaseSummary;
  /** 本文。最低2章（実測の最小が 2 章）。中央値 5 章 */
  chapters: [CaseChapter, CaseChapter, ...CaseChapter[]];
  /** 関連事例（実測 9/9・3 件が最頻）。一覧のカードをそのまま使う。2件以上 */
  related: [CaseStudyListItem, CaseStudyListItem, ...CaseStudyListItem[]];
  /** UI 語彙（パンくず・サマリー/プロフィールのラベル・関連事例の見出し）。既定は日本語 */
  labels?: CaseStudyArticleLabels;
  /**
   * 末尾 CTA（実測 9/9）。hero が無く再利用できるオファーが存在しないため、
   * actions は必須（case-study-list と同じ扱い）。
   */
  closing: Slot<CTASectionProps>;
}

/**
 * お知らせ / ブログの一覧（実測 7 サイト。docs/research/research-news-blog.md）。
 *
 * `case-study-list` と同じくヒーローを持たず、短いページタイトルから始まる。
 * **News とブログで同じ型を使う。** 一覧の構造差は実測でサムネイルの有無だけで
 * （News 3/6・ブログ 5/7）、多数派のカードグリッドに寄せた（§9-1）。
 */
export interface ArticleListInput extends LandingPageCommon {
  pattern: 'article-list';
  page: { eyebrow?: string; title: React.ReactNode; description?: string };
  list: Slot<ArticleListSectionProps>;
  /** 末尾 CTA（任意。実測 News 7/12・ブログ 11/15 で必須ではない） */
  closing?: Slot<CTASectionProps>;
}

/**
 * 個別の記事（News n=12 / ブログ n=15）。
 *
 * **`kind` で News とブログを分ける判別ユニオン。** 両方 optional の1型にすると
 * 「著者と目次を持つ News」という実測に無い構成が型で許される（実測 0/12）。
 * News に存在しないのは 著者 / 監修者 / 目次 / 更新日 の4つ。
 *
 * 末尾 CTA と一覧への戻り導線は**必須にしない**（事例記事は 27/27 だったが、
 * News 7/12・ブログ 11/15。SmartHR ニュースは 0/3）。
 */
export interface ArticleDetailInput extends LandingPageCommon {
  pattern: 'article-detail';
  article: ArticleBodySectionProps;
  /** 関連記事（実測 ブログ 15/15）。一覧のカードをそのまま渡す */
  related?: { title: React.ReactNode; articles: ArticleListItem[] };
  /** 末尾 CTA（任意） */
  closing?: Slot<CTASectionProps>;
}

/**
 * 資料ライブラリ（実測 7サイト）。
 *
 * 記事一覧と違い**日付もページャも持たない**（日付 0/7・無限スクロール 0/31）。
 * カードの遷移先は詳細ページでもフォームでもよい（両方が実測に存在する。§9-1）。
 */
export interface ResourcesLibraryInput extends LandingPageCommon {
  pattern: 'resources-library';
  page: { eyebrow?: string; title: React.ReactNode; description?: string };
  list: Slot<ResourceListSectionProps>;
}

/**
 * セミナー一覧（実測 8サイト）。
 *
 * **予定用と終了用でページを分けない**（実測 0/8）。呼び出し側は `status` 付きで
 * 全件を渡し、グルーピングはパターンに任せる。
 */
export interface SeminarListInput extends LandingPageCommon {
  pattern: 'seminar-list';
  page: { eyebrow?: string; title: React.ReactNode; description?: string };
  list: Slot<SeminarListSectionProps>;
}

/**
 * セミナー詳細（実測 21本）。
 *
 * `status` の判別ユニオンで、アーカイブに開催日時が、開催予定に視聴期限が
 * 型として存在しないようにしてある。**末尾 CTA は持たない** — フォームが CTA
 * であり、フォームの手前で他ページへ逃がさないのが獲得系の設計（実測 0/21）。
 */
export interface SeminarDetailInput extends LandingPageCommon {
  pattern: 'seminar-detail';
  seminar: SeminarDetailSectionProps;
}

export type LandingPageInput =
  | ProductPageInput
  | PortfolioTopInput
  | LeadGenInput
  | CorporateTopInput
  | CaseStudyListInput
  | CaseStudyDetailInput
  | ArticleListInput
  | ArticleDetailInput
  | ResourcesLibraryInput
  | SeminarListInput
  | SeminarDetailInput;

export type LandingPagePattern = LandingPageInput['pattern'];

/** パターンごとの tone 既定 */
const DEFAULT_TONES: Record<LandingPagePattern, PageTone> = {
  product: 'product',
  'product-portfolio-top': 'product',
  'lead-gen': 'campaign',
  'corporate-top': 'trust',
  'case-study-list': 'product',
  /* 記事は製品面の続きであり、campaign でも trust でもない（case-study-list と同じ） */
  'case-study-detail': 'product',
  /* News / ブログは読み手が買い手とは限らない（投資家・採用候補・情報収集）ため trust。
     **これは実測ではなく判断**（research-news-blog.md §6-1）。実装後に見直す余地がある */
  'article-list': 'trust',
  'article-detail': 'trust',
  /* 獲得系3型は campaign。**これは実測ではなく判断**（research-resources-seminar.md §7-1）。
     実装後に見直す余地がある */
  'resources-library': 'campaign',
  'seminar-list': 'campaign',
  'seminar-detail': 'campaign',
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
