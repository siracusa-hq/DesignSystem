import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Eyebrow } from '@/components/primitives/eyebrow';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './air-pocket-feature.module.css';

/** 証拠の数値。本文に埋めず、大きく表示して視線の錨にする */
export interface AirPocketProof {
  /** 例: '100万件 → ミリ秒' / 'SOC2 / ISMS' */
  value: string;
  /** 例: '全文検索の応答' / '要件を標準で充足' */
  label: string;
}

export interface AirPocket {
  module: string;
  /**
   * 1文のキャッチ。**数値・仕様は入れない**（数値は proof、仕様は points へ）。
   * 散文はここだけ — 説明の段落は受け付けない（ダラダラ感の温床。
   * ブランド決定 2026-08-11）
   */
  headline: string;
  /** 要点の箇条書き。名詞・動詞止めの短文で最大3点（4点目は型エラー） */
  points: [string] | [string, string] | [string, string, string];
  proof: AirPocketProof;
  competitors: { name: string; status: string }[];
  visual?: React.ReactNode;
}

export interface AirPocketFeatureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  airPockets: AirPocket[];
  /** 自社名（競合ステータス表の最終行）。既定は Polastack */
  ownName?: string;
  /** 自社の状態（競合ステータス表の最終行）。既定は「✓ 標準搭載」 */
  ownStatus?: string;
}

export const AirPocketFeature = React.forwardRef<HTMLElement, AirPocketFeatureProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      airPockets,
      ownName = 'Polastack',
      ownStatus = '✓ 標準搭載',
      ...props
    },
    ref,
  ) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.items}>
          {airPockets.map((pocket, i) => (
            <div key={i} className={cn(styles.row, i % 2 === 1 && styles.reversed)}>
              <div className={styles.copy}>
                <Eyebrow>{pocket.module}</Eyebrow>
                <Heading as="h3" size="display-sm">
                  {pocket.headline}
                </Heading>
                <ul className={styles.points}>
                  {pocket.points.map((point, j) => (
                    <li key={j} className={styles.point}>
                      <Text as="span" size="body-md" tone="secondary">
                        {point}
                      </Text>
                    </li>
                  ))}
                </ul>
                <div className={styles.proof}>
                  <span className={styles.proofValue}>{pocket.proof.value}</span>
                  <Text as="span" size="caption" tone="muted">
                    {pocket.proof.label}
                  </Text>
                </div>

                {/* 競合ステータス */}
                <div className={styles.competitors}>
                  {pocket.competitors.map((comp, j) => (
                    <div key={j} className={styles.competitorRow}>
                      <span className={styles.competitorName}>
                        <Text as="span" size="caption" tone="muted">
                          {comp.name}
                        </Text>
                      </span>
                      <Text as="span" size="caption" tone="muted">
                        {comp.status}
                      </Text>
                    </div>
                  ))}
                  <div className={cn(styles.competitorRow, styles.ownRow)}>
                    <span className={styles.competitorName}>
                      <Text as="span" size="caption" tone="brand">
                        {ownName}
                      </Text>
                    </span>
                    <Text as="span" size="caption" tone="brand">
                      {ownStatus}
                    </Text>
                  </div>
                </div>
              </div>

              {pocket.visual && <div className={styles.media}>{pocket.visual}</div>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
AirPocketFeature.displayName = 'AirPocketFeature';
