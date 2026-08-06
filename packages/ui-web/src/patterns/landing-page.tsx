import * as React from 'react';
import { Page } from '@/components/layout/page';
import { PageLayout } from '@/components/layout/page-layout';
import { createCTAClickCapture } from '@/lib/cta-click';
import { HeroSection } from '@/components/sections/hero-section';
import { LogoCloud } from '@/components/sections/logo-cloud';
import { StatsSection } from '@/components/sections/stats-section';
import { FeatureGrid } from '@/components/sections/feature-grid';
import { PricingTable } from '@/components/sections/pricing';
import { CaseStudySection } from '@/components/sections/case-study-card';
import { CaseStudyListSection } from '@/components/sections/case-study-list';
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

const hero = (h: LandingHero | (Omit<LandingHero, 'offers'> & { offers?: OfferAction[] })) => (
  <HeroSection key="hero" {...h} actions={h.offers} />
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

export const LandingPage: React.FC<LandingPageProps> = (props) => {
  const { brand, tone, footer, onCTAClick } = props;
  const header = props.pattern === 'lead-gen' ? undefined : props.header;

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
