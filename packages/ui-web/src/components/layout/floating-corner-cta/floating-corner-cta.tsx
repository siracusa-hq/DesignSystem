'use client';

import * as React from 'react';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Text } from '@/components/primitives/text';
import styles from './floating-corner-cta.module.css';

export interface FloatingCornerCTAAction {
  label: string;
  href: string;
}

export interface FloatingCornerCTALabels {
  /** 閉じるボタンの読み上げ名（既定: 「閉じる」） */
  close?: string;
  /** カード領域の読み上げ名（既定: `title`） */
  region?: string;
}

export interface FloatingCornerCTAProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  /** 短い一文。領域の読み上げ名にも使うため文字列で受ける */
  title: string;
  /** 補足（例: 「無料・1分で完了」） */
  description?: string;
  /** 1〜2オファー。1つ目 = cta（コンバージョン強調）/ 2つ目 = secondary */
  actions: FloatingCornerCTAAction[];
  /**
   * 閉じられたときに呼ばれる。**閉じた状態は永続化しない**
   * （再訪時にまた出るのが実測どおりの挙動）。
   * localStorage 等に覚えさせたい場合はここで受けて利用側が実装する。
   */
  onDismiss?: () => void;
  labels?: FloatingCornerCTALabels;
}

/** ハードコードテキストを持たないための既定ラベル（日本語） */
const DEFAULT_LABELS = {
  close: '閉じる',
} as const;

/**
 * FloatingCornerCTA — 右下に浮かせる追従 CTA カード
 * （composition-redesign.md §4-2。実測: カミナシ）。
 *
 * `position: fixed; bottom: 30px; right: 30px; width: 380px`。
 * モバイルでは画面幅に収まるよう左右 `1rem` に張り、内部ボタンは `90%`（実測）。
 *
 * ### 閉じるボタンは必須（オプションではない）
 *
 * 閉じられない追従要素はモバイルで本文を覆う。そのため × は**常に描画され、
 * 消すための props を持たない**。読み上げ名だけ `labels.close` で差し替えられる。
 * 閉じると同じマウントの間は再表示しない（内部 state。永続化はしない）。
 *
 * ### 計測（data-cta）
 *
 * CTA には `floating-${i}` が自動割当される。
 * ただしこの部品は `Page` の**外**（`PageLayout` 直下や body 直下）に
 * 置かれる想定のため、**`Page.onCTAClick` では拾えない**。
 * `PageLayout`（または任意の祖先要素）の `onClickCapture` に
 * `createCTAClickCapture()` を張ること（stage4-workorder.md §7）。
 */
export const FloatingCornerCTA = React.forwardRef<HTMLElement, FloatingCornerCTAProps>(
  ({ title, description, actions, onDismiss, labels, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;

    return (
      <aside
        ref={ref}
        role="complementary"
        aria-label={labels?.region ?? title}
        className={styles.card}
        {...props}
      >
        <button
          type="button"
          className={styles.close}
          aria-label={labels?.close ?? DEFAULT_LABELS.close}
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="4" x2="4" y2="12" />
            <line x1="4" y1="4" x2="12" y2="12" />
          </svg>
        </button>

        <p className={styles.title}>{title}</p>
        {description && (
          <div className={styles.description}>
            <Text as="div" size="body-sm" tone="muted">
              {description}
            </Text>
          </div>
        )}

        <div className={styles.actions}>
          {actions.slice(0, 2).map((action, i) => (
            <MarketingButton
              key={i}
              variant={i === 0 ? 'cta' : 'secondary'}
              size="md"
              href={action.href}
              /* 計測用 ID は部品が自動割当する（stage4-workorder.md §3） */
              ctaId={`floating-${i}`}
            >
              {action.label}
            </MarketingButton>
          ))}
        </div>
      </aside>
    );
  },
);
FloatingCornerCTA.displayName = 'FloatingCornerCTA';
