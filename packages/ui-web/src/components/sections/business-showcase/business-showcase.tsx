import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { MediaFrame, type MediaFrameProps } from '@/components/primitives/media-frame';
import type { ProductShotProps } from '@/components/primitives/product-shot';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './business-showcase.module.css';

export interface BusinessProduct {
  /** テーマ契約のブランドキー（polastack / peerdesk …）。CTA とアクセントがその色になる */
  brand?: string;
  name: string;
  description: string;
  /** 読み手の当てはまり判定に使う1行（例: 「受託開発企業・SaaS 運営者」）。ラベルは audienceLabel */
  audience?: string;
  /** プロダクトごとの導線。商談の入口なので省略できない */
  cta: { label: string; href: string };
  /** MediaFrame / ProductShot の要素のみ（FeatureShowcase と同じ制約）。
      未指定なら MediaFrame のプレースホルダで枠を保ち、素材が揃う前に構成を組める */
  image?: React.ReactElement<MediaFrameProps | ProductShotProps>;
}

/** 1事業あたりのプロダクトは最大3（発注元の実需は1〜2・将来3想定。上限は型で縛る） */
export type BusinessLineProducts =
  | [BusinessProduct]
  | [BusinessProduct, BusinessProduct]
  | [BusinessProduct, BusinessProduct, BusinessProduct];

export interface BusinessLine {
  /** 事業の小見出し（h3） */
  name: string;
  /** 事業のリード文は1本だけ。概要・対象・導線はプロダクト側が持つ */
  lead?: string;
  products: BusinessLineProducts;
}

export interface BusinessShowcaseProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  businesses: BusinessLine[];
  /** audience 行の先頭ラベル。既定「対象」（英語ページでは 'For' 等を渡す） */
  audienceLabel?: string;
}

/**
 * BusinessShowcase — 事業内容（corporate-top）の主役セクション。
 *
 * 「事業内容」というひとまとまりの中に、事業の小見出し（h3）がぶら下がり、
 * さらにその下にプロダクト（h4）が並ぶ2階層を1セクションで組む。
 * ServicePortfolio（フラットなカードグリッド）では事業→プロダクトの階層が
 * 見た目に出ず、FeatureShowcase はプロダクトごとの導線を持てない —
 * その隙間を埋める部品（コーポレートサイト申し送り 2026-08-16 P1）。
 *
 * - プロダクトの見せ方は FeatureShowcase と同じ「文 + ビジュアル」の交互配置。
 *   交互は事業をまたいで通しで数える（セクション全体でリズムを保つ）
 * - 各プロダクトは data-brand を持ち、CTA とアクセントだけがそのブランド色になる
 *   （ServicePortfolio と同じテーマ契約。React 側にブランド分岐は無い）
 * - ビジュアル未指定時は MediaFrame のプレースホルダで枠を保つ。
 *   素材の推奨は 16:9・1600×900px 以上（MediaFrame の既定比率）
 */
export const BusinessShowcase = React.forwardRef<HTMLElement, BusinessShowcaseProps>(
  ({ eyebrow, title, subtitle, businesses, audienceLabel = '対象', ...props }, ref) => {
    /* 交互配置の通し番号。事業ごとにリセットすると、1プロダクト事業が続いたときに
       同じ側へビジュアルが並んでリズムが死ぬ */
    let rowIndex = 0;
    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container>
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {businesses.map((business, bi) => (
            <section key={bi} className={styles.business}>
              <div className={styles.businessHead}>
                <Heading as="h3" size="heading-lg">
                  {business.name}
                </Heading>
                {business.lead && (
                  <Text as="p" size="body-lg" tone="secondary" clauseWrap>
                    {business.lead}
                  </Text>
                )}
              </div>
              <div className={styles.products}>
                {business.products.map((product, pi) => {
                  const reversed = rowIndex % 2 === 1;
                  const ctaId = `business-${bi}-product-${pi}`;
                  rowIndex += 1;
                  return (
                    <div
                      key={pi}
                      data-brand={product.brand}
                      className={cn(styles.row, reversed && styles.reversed)}
                    >
                      <div className={styles.copy}>
                        <Heading as="h4" size="display-sm">
                          {product.name}
                        </Heading>
                        <Text size="body-lg" tone="secondary" clauseWrap>
                          {product.description}
                        </Text>
                        {product.audience && (
                          <Text as="p" size="body-sm" tone="secondary">
                            <span className={styles.audienceLabel}>{audienceLabel}</span>
                            {product.audience}
                          </Text>
                        )}
                        <div className={styles.action}>
                          <MarketingButton href={product.cta.href} size="lg" ctaId={ctaId}>
                            {product.cta.label}
                          </MarketingButton>
                        </div>
                      </div>
                      <div className={styles.media}>
                        {product.image ?? <MediaFrame placeholderLabel={product.name} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </Container>
      </Section>
    );
  },
);
BusinessShowcase.displayName = 'BusinessShowcase';
