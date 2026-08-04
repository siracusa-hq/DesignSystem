import * as React from 'react';
import styles from './eyebrow.module.css';

export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  /** アイコン等を先頭に添える場合 */
  icon?: React.ReactNode;
  as?: 'span' | 'p';
}

/**
 * Eyebrow — セクション見出しの上の小ラベル。
 *
 * 旧 `Text` の overline 系 7 バリアントの後継（見た目の選択肢は持たない。
 * 装飾のばらつきは統一感を壊すため、形は1つに固定している）。
 * 色はスロット参照のため data-brand に自動追従する。
 */
export const Eyebrow = React.forwardRef<HTMLElement, EyebrowProps>(
  ({ icon, as: Tag = 'span', children, ...props }, ref) => (
    <Tag ref={ref as React.Ref<never>} className={styles.eyebrow} {...props}>
      {icon}
      {children}
    </Tag>
  ),
);
Eyebrow.displayName = 'Eyebrow';
