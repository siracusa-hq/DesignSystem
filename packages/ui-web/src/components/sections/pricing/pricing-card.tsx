import * as React from 'react';
import { cn } from '@/lib/cn';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Badge } from '@/components/primitives/badge';
import { Check, Minus } from 'lucide-react';
import styles from './pricing-card.module.css';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string;
  price: React.ReactNode;
  /** 「/月」等の単位。金額と大きさを揃えると数字が読み取りにくいので別スロットにする */
  priceUnit?: string;
  priceNote?: string;
  badge?: string;
  features: PricingFeature[];
  /**
   * ボタンの見た目は選べない（料金表のボタンは常にコンバージョン導線 = cta）。
   * 旧 action.variant は削除した（workorder §3）。
   */
  action: {
    label: string;
    href: string;
  };
  /** 推しプラン。ブランドのボーダーと持ち上げた影で1枚だけ強調する */
  highlighted?: boolean;
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      highlighted = false,
      name,
      description,
      price,
      priceUnit,
      priceNote,
      badge: badgeText,
      features,
      action,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(styles.card, highlighted && styles.highlighted, className)}
      {...props}
    >
      {badgeText && (
        <div className={styles.badgeSlot}>
          <Badge variant="new">{badgeText}</Badge>
        </div>
      )}

      <div className={styles.head}>
        <Heading as="h3" size="heading-lg">
          {name}
        </Heading>
        {description && (
          <Text size="body-sm" tone="secondary">
            {description}
          </Text>
        )}
      </div>

      <div className={styles.priceBlock}>
        <div className={styles.price}>
          {price}
          {priceUnit && <span className={styles.priceUnit}>{priceUnit}</span>}
        </div>
        {priceNote && (
          <Text size="caption" tone="muted">
            {priceNote}
          </Text>
        )}
      </div>

      <ul className={styles.features}>
        {features.map((feature, i) => (
          <li key={i} className={styles.feature}>
            <span className={feature.included ? styles.markYes : styles.markNo}>
              {feature.included ? (
                <Check className={styles.markIcon} />
              ) : (
                <Minus className={styles.markIcon} />
              )}
            </span>
            <Text as="span" size="body-sm" tone={feature.included ? 'default' : 'muted'}>
              {feature.text}
            </Text>
          </li>
        ))}
      </ul>

      <MarketingButton variant="cta" href={action.href} fullWidth>
        {action.label}
      </MarketingButton>
    </div>
  ),
);
PricingCard.displayName = 'PricingCard';
