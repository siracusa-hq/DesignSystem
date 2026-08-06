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
 * CTABand — ページ中間に置くコンバージョン帯。
 *
 * 実測では**面を持つ CTA 帯の反復は中間1〜2回 + 末尾**が上限で、
 * それ以上の高頻度反復（4〜6回）は面を持たない裸の CTA が担っている
 * （docs/research/research-cta-band.md §3-1。面なし反復用の部品は別途検討）。
 * CTABand は前者のための部品で、Page 配下に3つ以上置くと dev 警告が出る。
 * ページ末尾の締めには従来どおり CTASection（暗面・kicker あり）を使う。
 *
 * ラベルの規範: プライマリ CTA のラベルは2種類まで
 * （Page 配下では3種類目で dev 警告。反復自体は自由）。
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
              // lg: 淡面に線を引かない代わりに、中身の濃さで面を立たせる
              // （freee人事労務の実測パターン）
              <MarketingButton
                key={i}
                variant={i === 0 ? 'cta' : 'secondary'}
                size="lg"
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
