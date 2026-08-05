import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Avatar } from '@/components/primitives/avatar';
import type { LogoMarkProps } from '@/components/primitives/logo-mark';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './testimonial-section.module.css';

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  /**
   * 人物写真の URL。表示は Avatar が担う（1:1・円形・イニシャルへの
   * フォールバックを内部で処理するため、要素の素通しは受け付けない）。
   */
  avatarSrc?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  /** LogoMark の要素のみ受け付ける（高さと彩度の正規化のため。workorder §4） */
  companyLogo?: React.ReactElement<LogoMarkProps>;
}

export interface TestimonialSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 列数は件数から導出する（1→1 / 2→2 / 3件以上→3。workorder §3） */
  testimonials: Testimonial[];
}

function columnsFor(count: number): 1 | 2 | 3 {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  return 3;
}

export const TestimonialSection = React.forwardRef<HTMLElement, TestimonialSectionProps>(
  ({ eyebrow, title, subtitle, testimonials, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Grid columns={columnsFor(testimonials.length)} gap="lg">
          {testimonials.map((t, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.quoteBlock}>
                <span className={styles.quoteMark} aria-hidden="true">
                  &ldquo;
                </span>
                {t.rating && (
                  <div className={styles.rating} role="img" aria-label={`${t.rating} / 5`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg
                        key={s}
                        className={cn(styles.star, s < t.rating! && styles.starFilled)}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                <div className={styles.quote}>
                  <Text size="body-md">{t.quote}</Text>
                </div>
              </div>
              <div className={styles.person}>
                <Avatar src={t.avatarSrc} name={t.author} size="md" />
                <div>
                  <div className={styles.author}>
                    <Text as="div" size="body-sm">
                      {t.author}
                    </Text>
                  </div>
                  {(t.role || t.company) && (
                    <Text as="div" size="caption" tone="muted">
                      {[t.role, t.company].filter(Boolean).join(' / ')}
                    </Text>
                  )}
                </div>
                {t.companyLogo && <div className={styles.companyLogo}>{t.companyLogo}</div>}
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  ),
);
TestimonialSection.displayName = 'TestimonialSection';
