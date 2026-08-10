import * as React from 'react';
import { Eyebrow } from '@/components/primitives/eyebrow';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import styles from './section-header.module.css';

export interface SectionHeaderProps {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 見出しサイズ（セクションの格に応じて） */
  headingSize?: 'display-md' | 'display-sm' | 'heading-lg';
  /**
   * 見出しタグ。既定は h2。
   * ページタイトルを担うセクション（HeroSection を持たない case-study-list 型の
   * CaseStudyListSection）だけが h1 を使う。
   */
  as?: 'h1' | 'h2';
}

/** セクション冒頭の定型。全セクションで同一の並び・余白にする（内部共有） */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  headingSize = 'display-md',
  as = 'h2',
}: SectionHeaderProps) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div className={styles.header}>
      {eyebrow && (
        <div className={styles.eyebrowRow}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      {title && (
        <Heading as={as} size={headingSize}>
          {title}
        </Heading>
      )}
      {/* 区切りの既定は飾り線（見出しの下・実測: Bill One / MF 型）。
          文字を持たないため翻訳・語彙統一のコストがない。
          docs/research/research-eyebrow.md §4 案B（2026-08-10 ブランド決定） */}
      {title && <div className={styles.rule} aria-hidden="true" />}
      {/* 余白・読み幅はラッパーが持つ（Text は className を受け取らない） */}
      {subtitle && (
        <div className={styles.subtitle}>
          <Text size="body-lg" tone="secondary" clauseWrap>
            {subtitle}
          </Text>
        </div>
      )}
    </div>
  );
}
