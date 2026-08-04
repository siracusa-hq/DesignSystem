import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import { ShieldCheck } from 'lucide-react';
import styles from './security-badges.module.css';

export interface SecurityBadge {
  name: string;
  icon?: React.ReactNode;
  description?: string;
  /**
   * 3系統の区分（LP調査: 認証 / 第三者レビュー受賞 / 業法の法定表示）。
   * 未取得の認証を掲載してはならない（法人購買は必ず裏取りする）。
   */
  category?: 'certification' | 'award' | 'legal';
}

const CATEGORY_LABEL: Record<NonNullable<SecurityBadge['category']>, string> = {
  certification: '認証',
  award: '受賞',
  legal: '法定表示',
};

export interface SecurityBadgesProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  badges: SecurityBadge[];
}

export const SecurityBadges = React.forwardRef<HTMLElement, SecurityBadgesProps>(
  ({ eyebrow, title, subtitle, badges, ...props }, ref) => (
    <Section ref={ref} background="muted" spacing="md" {...props}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          headingSize="heading-lg"
        />
        <div className={styles.row}>
          {badges.map((badge, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.iconBox}>{badge.icon ?? <ShieldCheck size={28} />}</div>
              <Text as="div" size="body-sm" className={styles.name}>
                {badge.name}
              </Text>
              {badge.description && (
                <Text as="div" size="caption" tone="muted" className={styles.description}>
                  {badge.description}
                </Text>
              )}
              {badge.category && (
                <Text as="div" size="caption" tone="muted" className={styles.categoryTag}>
                  {CATEGORY_LABEL[badge.category]}
                </Text>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
SecurityBadges.displayName = 'SecurityBadges';
