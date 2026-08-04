import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import styles from './text.module.css';

export const textVariants = cva('', {
  variants: {
    size: {
      'body-lg': styles.bodyLg,
      'body-md': styles.bodyMd,
      'body-sm': styles.bodySm,
      caption: styles.caption,
      /** @deprecated Eyebrow コンポーネントを使うこと（Slice 4 で削除） */
      overline: cn(styles.overlineBase, styles.overlinePill),
      /** @deprecated 同上 */
      'overline-pill': cn(styles.overlineBase, styles.overlinePill),
      /** @deprecated 同上 */
      'overline-border': cn(styles.overlineBase, styles.overlineBorder),
      /** @deprecated 同上 */
      'overline-text': styles.overlineBase,
      /** @deprecated 同上 */
      'overline-dot': cn(styles.overlineBase, styles.overlineDot),
      /** @deprecated 同上 */
      'overline-gradient': cn(styles.overlineBase, styles.overlineGradient),
      /** @deprecated 同上 */
      'overline-icon-pill': cn(styles.overlineBase, styles.overlineIconPill),
    },
    tone: {
      default: styles.toneDefault,
      secondary: styles.toneSecondary,
      muted: styles.toneMuted,
      brand: styles.toneBrand,
      inherit: '',
    },
  },
  defaultVariants: {
    size: 'body-md',
    tone: 'default',
  },
});

/**
 * 和文リード文の改行を「読点・句点」に限定するための節分割。
 * 欧文（区切り文字なし）はそのまま返る。
 */
export function splitJaClauses(text: string): React.ReactNode {
  const parts = text.split(/(?<=[、。！？])/);
  if (parts.length <= 1) return text;
  return parts.map((part, i) => (
    <span key={i} className={styles.clause}>
      {part}
    </span>
  ));
}

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  /**
   * 和文リード文の改行を読点・句点に限定する（children が文字列のときのみ有効）。
   * センター寄せの短い説明文（subtitle 等）専用。長い段落には使わないこと。
   */
  clauseWrap?: boolean;
  /**
   * @deprecated 移行期間限定（未移行コンポーネントからのレイアウト調整用）。
   * Slice 6 で削除する（stage2-workorder.md §0）。新規利用は禁止。
   */
  className?: string;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, tone, as: Tag = 'p', clauseWrap = false, children, ...props }, ref) => (
    <Tag ref={ref} className={cn(textVariants({ size, tone }), className)} {...props}>
      {clauseWrap && typeof children === 'string' ? splitJaClauses(children) : children}
    </Tag>
  ),
);
Text.displayName = 'Text';
