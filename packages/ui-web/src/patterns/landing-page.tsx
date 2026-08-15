import * as React from 'react';
import { Page } from '@/components/layout/page';
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
import {
  ArticleBodySection,
  ArticleRelatedSection,
} from '@/components/sections/article-body';
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
  const header = props.pattern === 'lead-gen' ? undefined : props.header;

  useSocialProofCheck(props.pattern, 'proof' in props && props.proof != null);

  /* CTA クリックの委譲は Page ではなく PageLayout に張る。
     ヘッダー（header-${i}）は Page の外・PageLayout の直下に描画されるため、
     Page.onCTAClick に素通しするとヘッダーの CTA だけ取りこぼす
     （stage4-workorder.md §7）。委譲は1箇所だけに置き、二重発火を避ける */
  const handleClickCapture = createCTAClickCapture<HTMLDivElement>(onCTAClick, undefined);

  let sections: React.ReactNode[];
  switch (props.pattern) {
    case 'product': {
      const offers = props.hero.offers;
      sections = [
        hero(props.hero),
        proof(props.proof),
        <FeatureGrid key="features" {...props.features} />,
        midCta(props.midCta, offers),
        props.pricing && <PricingTable key="pricing" {...props.pricing} />,
        props.reasons && <FeatureGrid key="reasons" {...props.reasons} />,
        props.cases && <CaseStudySection key="cases" {...props.cases} />,
        props.faq && <FAQSection key="faq" {...props.faq} />,
        closing(props.closing, offers),
      ];
      break;
    }
    case 'product-portfolio-top': {
      const offers = props.hero.offers;
      sections = [
        hero(props.hero),
        proof(props.proof),
        <ServicePortfolio key="products" {...props.products} />,
        midCta(props.midCta, offers),
        props.features && <FeatureGrid key="features" {...props.features} />,
        props.cases && <CaseStudySection key="cases" {...props.cases} />,
        closing(props.closing, offers),
      ];
      break;
    }
    case 'lead-gen': {
      sections = [
        hero(props.hero),
        <FeatureGrid key="contents" {...props.contents} />,
        props.stats && <StatsSection key="stats" {...props.stats} />,
        /* 締めはフォーム。獲得専用ページなので CTASection は置かない */
        React.isValidElement(props.form)
          ? React.cloneElement(props.form, { key: 'form' })
          : props.form,
      ];
      break;
    }
    case 'corporate-top': {
      sections = [
        hero(props.hero),
        <ServicePortfolio key="services" {...props.services} />,
        props.about && <FeatureGrid key="about" {...props.about} />,
        props.stats && <StatsSection key="stats" {...props.stats} />,
        /* コンバージョン CTA は置かない型。closing は採用等の導線に限る */
        closing(props.closing, props.hero.offers ?? []),
      ];
      break;
    }
    case 'case-study-list': {
      /* ヒーローを持たない唯一の型。ページタイトルは一覧セクションの見出しが兼ねる
         （新しいヒーロー部品は作らない。§3-1 の実測どおり） */
      sections = [
        <CaseStudyListSection
          key="list"
          {...props.list}
          eyebrow={props.page.eyebrow}
          title={props.page.title}
          subtitle={props.page.description}
        />,
        /* オファーの再利用元（hero）が無いため、closing の actions は呼び出し側が必ず渡す */
        props.closing && <CTASection key="closing" {...props.closing} />,
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
      sections = [
        <CaseStudyArticleSection
          key="article"
          {...props.article}
          profile={props.profile}
          speakers={props.speakers}
          summary={props.summary}
          chapters={props.chapters}
          labels={props.labels}
        />,
        <CaseStudyRelatedSection
          key="related"
          cases={props.related}
          backTo={props.article.backTo}
          labels={props.labels}
        />,
        <CTASection key="closing" {...props.closing} />,
      ];
      break;
    }
    case 'article-list': {
      /* case-study-list と同じくヒーローを持たない。ページタイトルは一覧セクションが兼ねる。
         末尾 CTA は任意（実測 News 7/12・ブログ 11/15。事例の 27/27 とは違う） */
      sections = [
        <ArticleListSection
          key="list"
          {...props.list}
          eyebrow={props.page.eyebrow}
          title={props.page.title}
          subtitle={props.page.description}
        />,
        props.closing && <CTASection key="closing" {...props.closing} />,
      ];
      break;
    }
    case 'article-detail': {
      /* 記事本体は「1セクション」として置く。章のあいだに Page の面リズムを
         入れてはならない（case-study-detail と同じ。実測で本文は単一の面）。
         リズムの対象は 記事本体 / 関連記事 / 締め の3スロットだけ。 */
      sections = [
        <ArticleBodySection key="article" {...props.article} />,
        props.related && (
          <ArticleRelatedSection
            key="related"
            title={props.related.title}
            articles={props.related.articles}
            backTo={props.article.backTo}
          />
        ),
        props.closing && <CTASection key="closing" {...props.closing} />,
      ];
      break;
    }
  }

  return (
    <PageLayout
      headerProps={header}
      footerProps={footer}
      data-brand={brand}
      data-tone={tone}
      onClickCapture={handleClickCapture}
    >
      <Page brand={brand} tone={tone}>
        {sections.filter(Boolean)}
      </Page>
    </PageLayout>
  );
};
