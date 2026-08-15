import * as React from 'react';
import { Page, type PageSlotSurface } from '@/components/layout/page';
import { PageLayout } from '@/components/layout/page-layout';
import { createCTAClickCapture } from '@/lib/cta-click';
import { isDev } from '@/lib/dev';
import { HeroSection } from '@/components/sections/hero-section';
import { LogoCloud } from '@/components/sections/logo-cloud';
import { StatsSection } from '@/components/sections/stats-section';
import { FeatureGrid } from '@/components/sections/feature-grid';
import { PricingTable } from '@/components/sections/pricing';
import { CaseStudySection } from '@/components/sections/case-study-card';
import { CaseStudyListSection } from '@/components/sections/case-study-list';
import {
  CaseStudyArticleSection,
  CaseStudyRelatedSection,
} from '@/components/sections/case-study-article';
import { ArticleListSection } from '@/components/sections/article-list';
import { ArticleBodySection, ArticleRelatedSection } from '@/components/sections/article-body';
import { ResourceListSection } from '@/components/sections/resource-list';
import { SeminarListSection } from '@/components/sections/seminar-list';
import { SeminarDetailSection } from '@/components/sections/seminar-detail';
import { ContentHubSection } from '@/components/sections/content-hub';
import { FAQSection } from '@/components/sections/faq-section';
import { ServicePortfolio } from '@/components/sections/service-portfolio';
import { CTASection } from '@/components/sections/cta-section';
import { CTABand } from '@/components/sections/cta-band';
import type {
  LandingPageProps,
  LandingHero,
  LandingProof,
  LandingMidCta,
  LandingClosing,
  OfferAction,
} from './define-landing-page';
import styles from './landing-page.module.css';

/**
 * LandingPage — defineLandingPage() の実行エンジン（composition-redesign.md §3-5a）。
 *
 * セクションの順序・章立て余白・CTA の配置はすべてここ（=パターン）が決める。
 * 順序の根拠は製品系 12 ページの最大公約数（§3-2。料金 → 事例、FAQ は任意）。
 */

/*
 * offers は **必ず分割代入で取り除いてから** HeroSection へ渡すこと。
 * HeroSection は未知の props を Section 経由で DOM に素通しするため、
 * `{...h}` のまま渡すと生成 HTML に `offers="[object Object],[object Object]"` という
 * 無効な属性が焼き付く（Stage 5 Slice 2 の Astro 結合テストで発覚。§7-9）。
 */
const hero = ({
  offers,
  ...h
}: LandingHero | (Omit<LandingHero, 'offers'> & { offers?: OfferAction[] })) => (
  <HeroSection key="hero" {...h} actions={offers} />
);

const proof = (p: LandingProof | undefined) => {
  if (!p) return null;
  /* ヒーロー直下の社会的証明（実測 9/12）はヒーローの章に属する → attached */
  const inner = 'logos' in p ? <LogoCloud {...p.logos} /> : <StatsSection {...p.stats} />;
  return (
    <div key="proof" className={styles.attached}>
      {inner}
    </div>
  );
};

const midCta = (m: LandingMidCta | undefined, offers: OfferAction[]) =>
  m ? <CTABand key="mid-cta" title={m.title} note={m.note} actions={offers} /> : null;

const closing = (c: LandingClosing | undefined, offers: OfferAction[]) =>
  c ? <CTASection key="closing" {...c} actions={c.actions ?? offers} /> : null;

/* ============================================================
   面の割当（2026-08）

   LP では白 × ブランドティント淡色で面を作る。国内 BtoB SaaS 実測 8 サイト中
   5 サイトが淡い有彩色面を使っており（SmartHR #f4f8f9 = 1.069:1、
   マネーフォワード #f2f5ff = 1.089:1、Chatwork #f7f1e7 = 1.124:1、kintone #fff5e1、
   バクラク #f4f9ff、加えてカミナシ #e8f2ff。docs/research/research-eyebrow.md §4-3）、
   面交替の対比は 1.04〜1.12:1・中央値 1.07:1。

   **機械的な ABAB ゼブラの実サイトは実測で確認できていない。** 交替回数は 1〜3 回が
   主流で、白ベース（面をほとんど使わない）も 8 サイト中 3 例あった。そこで LP 系の
   パターンでは「白の連続の中に、社会的証明の塊だけがティントで浮かぶ」割当にする。
   どのセクションを浮かせるかはページの意味の問題であり、Page からは分からないため
   パターン側が明示する。事例系・コーポレートトップは従来の自動ゼブラのまま。

   記事系（article-*）・獲得系（resources-library / seminar-*）は **surface 指定なし
   （= auto、従来の自動ゼブラ）で据え置く**。ティント化の要否はこれらの型の実測を
   踏まえて別途検討する（2026-08 ブランド決定）。
   ============================================================ */

/** 面の指定と中身を1つの単位で持つ。分けて配列にすると条件付きスロットで添字がズレる */
interface PageSlot {
  node: React.ReactNode;
  /** 省略時は 'auto' = Page の自動ゼブラに任せる */
  surface?: PageSlotSurface;
}

/**
 * スロット定義から Page への引数を作る。
 *
 * **空スロット（`props.pricing && …` が false になった側）は node と surface を
 * 対にしたまま落とす**ので、条件付きスロットがあっても添字がズレようがない。
 * 全スロットが 'auto' のパターンでは surfaces を渡さない（従来の自動ゼブラそのまま）。
 */
function buildSlots(list: (PageSlot | null | false | undefined)[]): {
  children: React.ReactNode[];
  surfaces?: PageSlotSurface[];
} {
  const kept: PageSlot[] = [];
  for (const slot of list) {
    /* node が falsy なスロット（props.pricing 未指定 等）は surface ごと落とす */
    if (!slot || !slot.node) continue;
    kept.push(slot);
  }
  const surfaces = kept.map((slot) => slot.surface ?? 'auto');
  return {
    children: kept.map((slot) => slot.node),
    surfaces: surfaces.every((s) => s === 'auto') ? undefined : surfaces,
  };
}

/** proof スロットを持つパターン（ヒーロー直下の社会的証明帯を置ける型） */
const PATTERNS_WITH_PROOF = ['product', 'product-portfolio-top'] as const;

/**
 * 社会的証明スロットの空検査（Stage 5 Slice 1）。
 *
 * 実測（[LP] 19社）では **19/19 が数値訴求を持っていた**。
 * ロゴ帯と数値バッジは代替関係なので「どちらか」でよいが、
 * **どちらも無いページは1件も無かった**。
 * 1マウントにつき1回だけ警告する（effect なので SSR では何もしない）。
 */
function useSocialProofCheck(pattern: string, hasProof: boolean) {
  React.useEffect(() => {
    if (!isDev) return;
    if (hasProof) return;
    if (!(PATTERNS_WITH_PROOF as readonly string[]).includes(pattern)) return;
    console.warn(
      `[LandingPage] 社会的証明スロット（proof）が空です（pattern="${pattern}"）。` +
        '実測では 19/19 のページが数値訴求を持っており、ロゴ帯も数値も無いページは0件でした。' +
        'proof.stats（数値訴求）か proof.logos（ロゴ帯・6社以上）のどちらかを必ず置いてください' +
        '（composition-redesign.md §Stage 5）。',
    );
  }, [pattern, hasProof]);
}

export const LandingPage: React.FC<LandingPageProps> = (props) => {
  const { brand, tone, footer, onCTAClick } = props;
  /* lead-gen は既定でグローバルナビを剥がす（実測 2/2）。
     ただし**資料個票は 6/6 が持つ**ため、明示的に header を渡したときだけ出す
     （acquisition-pages-workorder.md §2。省略時に剥がす既定は据え置きなので非破壊） */
  const header = props.header;

  useSocialProofCheck(props.pattern, 'proof' in props && props.proof != null);

  /* CTA クリックの委譲は Page ではなく PageLayout に張る。
     ヘッダー（header-${i}）は Page の外・PageLayout の直下に描画されるため、
     Page.onCTAClick に素通しするとヘッダーの CTA だけ取りこぼす
     （stage4-workorder.md §7）。委譲は1箇所だけに置き、二重発火を避ける */
  const handleClickCapture = createCTAClickCapture<HTMLDivElement>(onCTAClick, undefined);

  let slots: (PageSlot | null | false | undefined)[];
  switch (props.pattern) {
    case 'product': {
      const offers = props.hero.offers;
      /* 白の連続の中に、社会的証明（proof / cases）だけがティントの塊として浮かぶ。
         面の交替は2回で、実測の主流レンジ（1〜3回）に収まる */
      slots = [
        { node: hero(props.hero) },
        { node: proof(props.proof), surface: 'tinted' },
        { node: <FeatureGrid key="features" {...props.features} />, surface: 'default' },
        { node: midCta(props.midCta, offers) }, // CTABand が accent を自己申告する
        {
          node: props.pricing && <PricingTable key="pricing" {...props.pricing} />,
          surface: 'default',
        },
        {
          node: props.reasons && <FeatureGrid key="reasons" {...props.reasons} />,
          surface: 'default',
        },
        {
          node: props.cases && <CaseStudySection key="cases" {...props.cases} />,
          surface: 'tinted',
        },
        { node: props.faq && <FAQSection key="faq" {...props.faq} />, surface: 'default' },
        /* コンテンツ回遊（実測 9/13）。FAQ の後・締めの前。11/11 が最終CTAの前に置く。
           面は白に置く。ティントは社会的証明の塊に与える語彙であり、回遊は説得の流れでは
           なく導線だから。ContentHub 自身も「セクションは塗らず Page のリズムに乗る」
           設計（content-hub-workorder.md §9） */
        {
          node: props.contentHub && <ContentHubSection key="content-hub" {...props.contentHub} />,
          surface: 'default',
        },
        { node: closing(props.closing, offers) }, // CTASection が dark を自己申告する
      ];
      break;
    }
    case 'product-portfolio-top': {
      const offers = props.hero.offers;
      slots = [
        { node: hero(props.hero) },
        { node: proof(props.proof), surface: 'tinted' },
        { node: <ServicePortfolio key="products" {...props.products} />, surface: 'default' },
        { node: midCta(props.midCta, offers) },
        {
          node: props.features && <FeatureGrid key="features" {...props.features} />,
          surface: 'default',
        },
        {
          node: props.cases && <CaseStudySection key="cases" {...props.cases} />,
          surface: 'tinted',
        },
        /* コンテンツ回遊。事例の後・締めの前。面は product と同じ理由で白 */
        {
          node: props.contentHub && <ContentHubSection key="content-hub" {...props.contentHub} />,
          surface: 'default',
        },
        { node: closing(props.closing, offers) },
      ];
      break;
    }
    case 'lead-gen': {
      /* 獲得LPは短いので、資料の中身とフォームをティントで浮かせて視線を落とす */
      slots = [
        { node: hero(props.hero) },
        { node: <FeatureGrid key="contents" {...props.contents} />, surface: 'tinted' },
        { node: props.stats && <StatsSection key="stats" {...props.stats} />, surface: 'default' },
        /* 締めはフォーム。獲得専用ページなので CTASection は置かない */
        {
          node: React.isValidElement(props.form)
            ? React.cloneElement(props.form, { key: 'form' })
            : props.form,
          surface: 'tinted',
        },
      ];
      break;
    }
    case 'corporate-top': {
      /* 読み手が買い手ではない型。面はニュートラルの自動ゼブラのままにする */
      slots = [
        { node: hero(props.hero) },
        { node: <ServicePortfolio key="services" {...props.services} /> },
        { node: props.about && <FeatureGrid key="about" {...props.about} /> },
        { node: props.stats && <StatsSection key="stats" {...props.stats} /> },
        /* コンバージョン CTA は置かない型。closing は採用等の導線に限る */
        { node: closing(props.closing, props.hero.offers ?? []) },
      ];
      break;
    }
    case 'case-study-list': {
      /* ヒーローを持たない唯一の型。ページタイトルは一覧セクションの見出しが兼ねる
         （新しいヒーロー部品は作らない。§3-1 の実測どおり） */
      slots = [
        {
          node: (
            <CaseStudyListSection
              key="list"
              {...props.list}
              eyebrow={props.page.eyebrow}
              title={props.page.title}
              subtitle={props.page.description}
            />
          ),
        },
        /* オファーの再利用元（hero）が無いため、closing の actions は呼び出し側が必ず渡す */
        { node: props.closing && <CTASection key="closing" {...props.closing} /> },
      ];
      break;
    }
    case 'case-study-detail': {
      /* 記事本体は「1セクション」として置く。実測 9/9 が本文を単一の面に置いており、
         章のあいだに Page の面リズム（default ↔ muted）を入れてはいけない
         （docs/research/research-case-study-detail.md §4-5）。
         リズムの対象になるのは 記事本体 / 関連事例 / 締め の3スロットだけ。

         末尾 CTA は CTASection（中央寄せ・暗面）を使う。実測の末尾は
         「中央寄せの見出し + 1〜2本のオファー」（SmartHR の h2 26px/700・中央、
         ANDPAD / HRBrain / Chatwork の2本併置）で、左に文・右にボタンを置く
         CTABand の行レイアウトより CTASection の centered が実測の型に近い。 */
      slots = [
        {
          node: (
            <CaseStudyArticleSection
              key="article"
              {...props.article}
              profile={props.profile}
              speakers={props.speakers}
              summary={props.summary}
              chapters={props.chapters}
              labels={props.labels}
            />
          ),
        },
        {
          node: (
            <CaseStudyRelatedSection
              key="related"
              cases={props.related}
              backTo={props.article.backTo}
              labels={props.labels}
            />
          ),
        },
        { node: <CTASection key="closing" {...props.closing} /> },
      ];
      break;
    }
    case 'article-list': {
      /* case-study-list と同じくヒーローを持たない。ページタイトルは一覧セクションが兼ねる。
         末尾 CTA は任意（実測 News 7/12・ブログ 11/15。事例の 27/27 とは違う） */
      slots = [
        {
          node: (
            <ArticleListSection
              key="list"
              {...props.list}
              eyebrow={props.page.eyebrow}
              title={props.page.title}
              subtitle={props.page.description}
            />
          ),
        },
        { node: props.closing && <CTASection key="closing" {...props.closing} /> },
      ];
      break;
    }
    case 'article-detail': {
      /* 記事本体は「1セクション」として置く。章のあいだに Page の面リズムを
         入れてはならない（case-study-detail と同じ。実測で本文は単一の面）。
         リズムの対象は 記事本体 / 関連記事 / 締め の3スロットだけ。 */
      slots = [
        { node: <ArticleBodySection key="article" {...props.article} /> },
        {
          node: props.related && (
            <ArticleRelatedSection
              key="related"
              title={props.related.title}
              articles={props.related.articles}
              backTo={props.article.backTo}
            />
          ),
        },
        { node: props.closing && <CTASection key="closing" {...props.closing} /> },
      ];
      break;
    }
    case 'resources-library': {
      /* ヒーローを持たない。**末尾 CTA も持たない** — 資料そのものがオファーであり、
         フォームの手前で他ページへ逃がさないのが獲得系の設計（実測 資料 0/6） */
      slots = [
        {
          node: (
            <ResourceListSection
              key="list"
              {...props.list}
              eyebrow={props.page.eyebrow}
              title={props.page.title}
              subtitle={props.page.description}
            />
          ),
        },
      ];
      break;
    }
    case 'seminar-list': {
      slots = [
        {
          node: (
            <SeminarListSection
              key="list"
              {...props.list}
              eyebrow={props.page.eyebrow}
              title={props.page.title}
              subtitle={props.page.description}
            />
          ),
        },
      ];
      break;
    }
    case 'seminar-detail': {
      /* 1セクションで完結する。末尾 CTA も関連コンテンツも持たない（実測 0/21）。
         フォーム自体が CTA なので、seminar.form に渡されたものが締めになる */
      slots = [{ node: <SeminarDetailSection key="seminar" {...props.seminar} /> }];
      break;
    }
  }

  const { children: sections, surfaces } = buildSlots(slots);

  return (
    <PageLayout
      headerProps={header}
      footerProps={footer}
      data-brand={brand}
      data-tone={tone}
      onClickCapture={handleClickCapture}
    >
      <Page brand={brand} tone={tone} surfaces={surfaces}>
        {sections}
      </Page>
    </PageLayout>
  );
};
