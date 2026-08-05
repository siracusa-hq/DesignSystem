import * as React from 'react';
import { cn } from '@/lib/cn';
import { isDev } from '@/lib/dev';
import { resolvePageSurface } from '@/lib/page-surface';
import styles from './page.module.css';

/** brand-registry のキーと一致すること（page.test.tsx が突き合わせる） */
export const PAGE_BRANDS = ['corporate', 'polastack', 'peerdesk', 'peerdesk-taxpeer'] as const;
export type PageBrand = (typeof PAGE_BRANDS)[number];

/**
 * トーン = 何を狙うページか。装飾量・コントラスト・余白量を決める。
 * ブランド軸（誰の顔か）と直交し、組み合わせを禁止しない。
 */
export const PAGE_TONES = ['trust', 'product', 'campaign'] as const;
export type PageTone = (typeof PAGE_TONES)[number];

export interface PageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** 誰の顔か。色相・視覚デバイスを決める（既定: corporate） */
  brand?: PageBrand;
  /** 何を狙うページか。余白・装飾量を決める（既定: product = 基準） */
  tone?: PageTone;
  children?: React.ReactNode;
}

/**
 * Page — ページのリズムを割り当てるコンテナ（composition-redesign.md §3-3）。
 *
 * - 面: 自分で暗面を塗るセクション（pageSurface 申告）を除き、
 *   default ↔ muted を交互に割り当てる。暗面で交互カウンタをリセットする
 *   （暗面直後は必ず default から再開）
 * - 暗面の3連続は禁止（dev 警告）。可読性の問題であり、確定規則
 * - トーン/ブランドは data 属性で配下に伝播する
 */
export const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ brand = 'corporate', tone = 'product', children, ...props }, ref) => {
    const items = React.Children.toArray(children);

    let alternation = 0;
    let darkRun = 0;
    let darkRunWarned = false;

    const assigned = items.map((child, i) => {
      if (!React.isValidElement(child)) return child;

      const surface = resolvePageSurface(child.type, child.props);
      if (surface === 'dark') {
        darkRun += 1;
        alternation = 0;
        if (isDev && darkRun >= 3 && !darkRunWarned) {
          darkRunWarned = true;
          console.warn(
            '[Page] 暗い面のセクションが3つ連続しています。暗面の連続は可読性を損なうため禁止です。' +
              '間に明るい面のセクションを挟んでください（composition-redesign.md §3-3）。',
          );
        }
        return child;
      }

      darkRun = 0;
      const muted = alternation % 2 === 1;
      alternation += 1;
      if (!muted) return child;
      return (
        <div key={`page-slot-${i}`} className={styles.slotMuted}>
          {child}
        </div>
      );
    });

    return (
      <div
        ref={ref}
        data-brand={brand}
        data-tone={tone}
        className={cn(styles.page)}
        {...props}
      >
        {assigned}
      </div>
    );
  },
);
Page.displayName = 'Page';
