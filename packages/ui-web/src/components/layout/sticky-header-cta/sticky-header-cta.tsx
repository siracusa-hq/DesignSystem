import * as React from 'react';
import { Logo } from '@/components/primitives/logo';
import { MarketingButton } from '@/components/primitives/marketing-button';
import styles from './sticky-header-cta.module.css';

export interface StickyHeaderCTAAction {
  label: string;
  href: string;
}

export interface StickyHeaderCTAProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  /** 省略時は Polastack ロゴ。デスクトップでのみ表示される */
  logo?: React.ReactNode;
  /** 1〜2オファー。1つ目 = cta（コンバージョン強調）/ 2つ目 = secondary */
  actions: StickyHeaderCTAAction[];
}

/**
 * StickyHeaderCTA — 固定ヘッダーに CTA を2本内包する追従形態
 * （composition-redesign.md §4-2。実測: カミナシ）。
 *
 * `position: fixed; top: 0; width: 100%`。固定要素は本文を覆うため、
 * **同じ高さのスペーサーを自分で出す**（呼び出し側で余白を作る必要はない）。
 *
 * モバイルでは CTA 2本が各 `45vw` / 高さ `40px` で横並びになり、
 * ロゴは出さない（実測どおり。2本で 90vw を使い切る）。
 *
 * ### MarketingHeader との役割分担
 *
 * この部品は**獲得 LP 用の簡易ヘッダー**であり、グローバルナビを持たない。
 * ナビ・ドロップダウン・モバイルメニューが要る通常のページでは
 * `MarketingHeader`（`sticky` 既定 ON）を使うこと。
 * 「ナビを剥がして CTA だけを常時見せる」のが獲得 LP の実測形
 * （`lead-gen` は実測 2/2 でグローバルナビなし）。
 *
 * ### 計測（data-cta）
 *
 * CTA には `sticky-header-${i}` が自動割当される。
 * ただしこの部品は `Page` の**外**（`PageLayout` の `header` スロットや
 * body 直下）に置かれるため、**`Page.onCTAClick` では拾えない**。
 * `PageLayout`（または任意の祖先要素）の `onClickCapture` に
 * `createCTAClickCapture()` を張ること（stage4-workorder.md §7）。
 */
export const StickyHeaderCTA = React.forwardRef<HTMLElement, StickyHeaderCTAProps>(
  ({ logo, actions, ...props }, ref) => (
    <>
      <header ref={ref} className={styles.header} {...props}>
        <div className={styles.bar}>
          <div className={styles.logoBox}>{logo ?? <Logo variant="full" height={28} />}</div>
          <div className={styles.actions}>
            {actions.slice(0, 2).map((action, i) => (
              <MarketingButton
                key={i}
                variant={i === 0 ? 'cta' : 'secondary'}
                size="sm"
                href={action.href}
                /* 計測用 ID は部品が自動割当する（stage4-workorder.md §3） */
                ctaId={`sticky-header-${i}`}
              >
                {action.label}
              </MarketingButton>
            ))}
          </div>
        </div>
      </header>
      {/* 固定ヘッダーの高さぶんを本文から押し下げる */}
      <div className={styles.spacer} aria-hidden="true" />
    </>
  ),
);
StickyHeaderCTA.displayName = 'StickyHeaderCTA';
