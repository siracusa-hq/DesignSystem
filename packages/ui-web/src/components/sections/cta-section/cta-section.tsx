import * as React from 'react';
import { sectionVariants } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import styles from './cta-section.module.css';
import { cn } from '@/lib/cn';

export interface CTAAction {
  label: string;
  href: string;
}

export interface CTASectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  /** キッカー（例: 「＼5分でわかる資料をプレゼント／」。LP調査で実測7種のほぼ必須要素） */
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  /**
   * 2オファー（軽+重 または 軽+軽）。variant は自動割当:
   * 1つ目 = cta（第3役割・コンバージョン強調）/ 以降 = secondary
   */
  actions: CTAAction[];
  note?: string;
  socialProof?: string;
  layout?: 'centered' | 'split';
}

export const CTASection = React.forwardRef<HTMLElement, CTASectionProps>(
  ({ kicker, title, subtitle, actions, note, socialProof, layout = 'centered', ...props }, ref) => {
    const buttons = actions.map((action, i) => (
      <MarketingButton key={i} variant={i === 0 ? 'cta' : 'secondary'} size="lg" href={action.href}>
        {action.label}
      </MarketingButton>
    ));
    const meta = (note || socialProof) && (
      <div className={styles.meta}>
        {socialProof && (
          <Text as="div" size="body-sm" tone="muted">
            {socialProof}
          </Text>
        )}
        {note && (
          <Text as="div" size="caption" tone="muted">
            {note}
          </Text>
        )}
      </div>
    );

    if (layout === 'split') {
      return (
        <section
          ref={ref}
          className={cn(sectionVariants({ background: 'dark', spacing: 'lg' }), styles.section)}
          {...props}
        >
          <Container>
            <div className={styles.splitRow}>
              <div className={styles.splitText}>
                {kicker && <span className={styles.kicker}>{kicker}</span>}
                <Heading as="h2" size="display-sm">
                  {title}
                </Heading>
                {subtitle && (
                  <div className={styles.subtitleSplit}>
                    <Text size="body-lg" tone="secondary" clauseWrap>
                      {subtitle}
                    </Text>
                  </div>
                )}
                {meta}
              </div>
              <div className={styles.actionsSplit}>{buttons}</div>
            </div>
          </Container>
        </section>
      );
    }

    return (
      <section
        ref={ref}
        className={cn(
          sectionVariants({ background: 'dark', spacing: 'lg' }),
          styles.section,
          styles.centered,
        )}
        {...props}
      >
        <Container size="md">
          {kicker && <span className={styles.kicker}>{kicker}</span>}
          <Heading as="h2" size="display-md">
            {title}
          </Heading>
          {subtitle && (
            <div className={styles.subtitleCentered}>
              <Text size="body-lg" tone="secondary" clauseWrap>
                {subtitle}
              </Text>
            </div>
          )}
          <div className={styles.actionsCentered}>{buttons}</div>
          {meta}
        </Container>
      </section>
    );
  },
);
CTASection.displayName = 'CTASection';
