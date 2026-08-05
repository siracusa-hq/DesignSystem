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
}

/** セクション冒頭の定型。全セクションで同一の並び・余白にする（内部共有） */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  headingSize = 'display-md',
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
        <Heading as="h2" size={headingSize}>
          {title}
        </Heading>
      )}
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
