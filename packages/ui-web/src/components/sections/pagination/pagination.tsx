import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './pagination.module.css';

/** ページ送りの文言（このパッケージは文言を持たないため利用側から渡す） */
export interface PaginationLabels {
  previous: string;
  next: string;
  /** nav の aria-label */
  pagination: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: PaginationLabels;
}

/**
 * Pagination — ページ送り（内部共有）。
 *
 * 事例一覧（CaseStudyListSection）と記事一覧（ArticleListSection）で同じものを使う。
 * 値を2箇所に書かないため、意匠も挙動もここに1つだけ置く。
 * 1ページ以下では何も描かない（呼び出し側で条件分岐しなくてよい）。
 */
export function Pagination({ currentPage, totalPages, onPageChange, labels }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label={labels.pagination}>
      <button
        type="button"
        className={styles.pageStep}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {labels.previous}
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={cn(styles.pageNumber, n === currentPage && styles.pageCurrent)}
          aria-current={n === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(n)}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className={styles.pageStep}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {labels.next}
      </button>
    </nav>
  );
}
