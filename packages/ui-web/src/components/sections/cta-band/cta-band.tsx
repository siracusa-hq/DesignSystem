import * as React from 'react';
import { Container } from '@/components/primitives/container';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Text } from '@/components/primitives/text';
import { markPageSurface } from '@/lib/page-surface';
import styles from './cta-band.module.css';

export interface CTABandAction {
  label: string;
  href: string;
}

export interface CTABandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  /** 短い一文（例: 「まずは資料からご覧ください」）。見出しではなく強調段落として描画する */
  title: React.ReactNode;
  /** 1〜2オファー。1つ目 = cta（コンバージョン強調）/ 2つ目 = secondary */
  actions: CTABandAction[];
  /** 補足（例: 「無料・1分で完了」） */
  note?: string;
}

/**
 * CTABand — セクション区切りに**繰り返し置く**コンバージョン帯。
 *
 * LP 実測の標準形は「同じ2種のプライマリ CTA ラベルをセクション区切りごとに
 * 4〜6回反復する」（composition-redesign.md §3-3）。CTABand はそのための部品で、
 * 「ページに2つしか置けない特別なコンポーネント」ではない。
 * ページ末尾の締めには従来どおり CTASection（暗面・kicker あり）を使う。
 *
 * ラベルの種類だけは規範がある: プライマリ CTA のラベルは2種類まで
 * （Page 配下では3種類目で dev 警告）。
 */
export const CTABand = React.forwardRef<HTMLElement, CTABandProps>(
  ({ title, actions, note, ...props }, ref) => (
    <aside ref={ref as React.Ref<HTMLElement>} className={styles.band} {...props}>
      <Container>
        <div className={styles.row}>
          <div>
            <p className={styles.title}>{title}</p>
            {note && (
              <div className={styles.note}>
                <Text as="div" size="body-sm" tone="muted">
                  {note}
                </Text>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            {actions.slice(0, 2).map((action, i) => (
              <MarketingButton
                key={i}
                variant={i === 0 ? 'cta' : 'secondary'}
                size="md"
                href={action.href}
              >
                {action.label}
              </MarketingButton>
            ))}
          </div>
        </div>
      </Container>
    </aside>
  ),
);
CTABand.displayName = 'CTABand';
// 自前の強調面（淡いブランド面）を塗るため、Page のリズムから除外する
markPageSurface(CTABand, 'accent');
