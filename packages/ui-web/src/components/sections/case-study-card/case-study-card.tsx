import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import type { LogoMarkProps } from '@/components/primitives/logo-mark';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './case-study-card.module.css';

export interface CaseStudy {
  companyName: string;
  /** LogoMark の要素のみ受け付ける（高さと彩度の正規化のため。workorder §4） */
  companyLogo?: React.ReactElement<LogoMarkProps>;
  /**
   * インタビュー写真（任意）。カード上部に 16:9 固定で表示し、
   * トリミングはシステムが行う（縦横比の違う写真を渡しても崩れない）。
   * **alt は必須** — 写真は装飾ではなく実在性の証拠なので、
   * 人物と文脈を書く（例: 「経理部長の田中様が事務所で書類を確認している様子」）。
   * 写真つきカードでは引用を1〜2文に絞ること（GUIDELINES §3。写真が語る分、文字を減らす）
   */
  photo?: { src: string; alt: string };
  quote: string;
  metrics?: { label: string; value: string }[];
  href?: string;
  linkLabel?: string;
}

export interface CaseStudySectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 列数は件数から導出する（1→1 / 2→2 / 3件以上→3。workorder §3） */
  cases: CaseStudy[];
}

function columnsFor(count: number): 1 | 2 | 3 {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  return 3;
}

export const CaseStudySection = React.forwardRef<HTMLElement, CaseStudySectionProps>(
  ({ eyebrow, title, subtitle, cases, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Grid columns={columnsFor(cases.length)} gap="lg">
          {cases.map((c, i) => (
            <div key={i} className={styles.card}>
              {c.photo && (
                <img className={styles.photo} src={c.photo.src} alt={c.photo.alt} loading="lazy" />
              )}
              <div className={styles.cardBody}>
              {c.companyLogo ? (
                <div className={styles.logo}>{c.companyLogo}</div>
              ) : (
                <div className={styles.companyName}>
                  <Text as="div" size="body-sm" tone="inherit">
                    {c.companyName}
                  </Text>
                </div>
              )}

              <div className={styles.quote}>
                <Text size="body-md">&ldquo;{c.quote}&rdquo;</Text>
              </div>

              {c.metrics && c.metrics.length > 0 && (
                <div className={styles.metrics}>
                  {c.metrics.map((m, j) => (
                    <div key={j}>
                      <div className={styles.metricValue}>{m.value}</div>
                      <Text as="div" size="caption" tone="muted">
                        {m.label}
                      </Text>
                    </div>
                  ))}
                </div>
              )}

              {c.href && (
                <div className={styles.linkRow}>
                  {/* 矢印は Link の arrow バリアントが持つ（アイコンを各所で足さない） */}
                  <Link href={c.href} variant="arrow">
                    {c.linkLabel ?? '詳しく見る'}
                  </Link>
                </div>
              )}
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  ),
);
CaseStudySection.displayName = 'CaseStudySection';
