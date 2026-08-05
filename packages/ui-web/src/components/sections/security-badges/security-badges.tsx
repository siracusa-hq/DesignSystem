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

export interface SecurityBadgesProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  badges: SecurityBadge[];
}

export const SecurityBadges = React.forwardRef<HTMLElement, SecurityBadgesProps>(
  ({ eyebrow, title, subtitle, badges, ...props }, ref) => (
    // 面はページ（Page のリズム）が決める。自己 muted は Stage 3 で廃止
    <Section ref={ref} background="default" spacing="md" {...props}>
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
              {/* 意匠（太字・読み幅・ピル枠）はラッパーが持つ（Text は className を受け取らない） */}
              <div className={styles.name}>
                <Text as="div" size="body-sm">
                  {badge.name}
                </Text>
              </div>
              {badge.description && (
                <div className={styles.description}>
                  <Text as="div" size="caption" tone="muted">
                    {badge.description}
                  </Text>
                </div>
              )}
              {badge.category && (
                <div className={styles.categoryTag}>
                  <Text as="div" size="caption" tone="muted">
                    {CATEGORY_LABEL[badge.category]}
                  </Text>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
SecurityBadges.displayName = 'SecurityBadges';
