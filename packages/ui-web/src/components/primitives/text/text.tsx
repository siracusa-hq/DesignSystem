import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './text.module.css';

export const textVariants = cva('', {
  variants: {
    size: {
      'body-lg': styles.bodyLg,
      'body-md': styles.bodyMd,
      'body-sm': styles.bodySm,
      caption: styles.caption,
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
 * 和文リード文の改行を「文章の切れ目」に限定するための階層分割。
 *
 * 句点（。！？）と読点（、）を同格に扱うと
 * 「〜シリーズ。色が違っても、」のように文の途中で行が継がれて気持ち悪い。
 * そこで2段構えにする:
 *   1. まず句点で「文」に分割し、各文を折り返し不能の塊（inline-block）にする
 *      → 文の途中から次の文が同じ行に載ることがなくなる
 *   2. 文が1行に収まらないときだけ、文の内部が読点で折れる
 *      （文の中の各節も inline-block のため）
 * 欧文（区切り文字なし）はそのまま返る。
 */
export function splitJaClauses(text: string): React.ReactNode {
  const splitBy = (input: string, re: RegExp) => input.split(re).filter((p) => p !== '');

  const wrapCommaParts = (sentence: string, keyBase: string): React.ReactNode => {
    const parts = splitBy(sentence, /(?<=、)/);
    if (parts.length <= 1) return sentence;
    return parts.map((part, i) => (
      <span key={`${keyBase}${i}`} className={styles.clause}>
        {part}
      </span>
    ));
  };

  const sentences = splitBy(text, /(?<=[。！？])/);
  if (sentences.length <= 1) {
    // 文が1つ（または句点なし）: 読点のみで分割（従来挙動）
    return wrapCommaParts(text, 'c');
  }
  return sentences.map((sentence, i) => (
    <span key={i} className={styles.clause}>
      {wrapCommaParts(sentence, `${i}-`)}
    </span>
  ));
}

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'className'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  /**
   * 和文リード文の改行を読点・句点に限定する（children が文字列のときのみ有効）。
   * センター寄せの短い説明文（subtitle 等）専用。長い段落には使わないこと。
   */
  clauseWrap?: boolean;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ size, tone, as: Tag = 'p', clauseWrap = false, children, ...props }, ref) => (
    <Tag ref={ref} className={textVariants({ size, tone })} {...props}>
      {clauseWrap && typeof children === 'string' ? splitJaClauses(children) : children}
    </Tag>
  ),
);
Text.displayName = 'Text';
