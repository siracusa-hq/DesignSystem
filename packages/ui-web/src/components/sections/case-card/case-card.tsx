import * as React from 'react';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import type { LogoMarkProps } from '@/components/primitives/logo-mark';
import { cn } from '@/lib/cn';
import styles from './case-card.module.css';

/**
 * 事例1件のカード（内部共有部品）。
 *
 * `CaseStudySection`（`case-study-card/`）とは別物。あちらは**引用が必須**の
 * 「1件を大きく見せる」部品で、こちらは**タイトル + 社名 + メタ**の一覧用カード。
 * 一覧ページ（`CaseStudyListSection`）と事例記事末尾の「関連事例」の
 * **両方がこのファイルを使う**（見た目の二重実装を作らないため。
 * docs/research/research-case-study-detail.md §4-5）。
 *
 * 公開 API には出さない。利用者から見える口は `CaseStudyListSection` と
 * `case-study-detail` パターンの2つだけである。
 */

/** 実測のフィルタ軸4種（SmartHR /case/・バクラク /case/。composition-redesign.md §3-1） */
export const CASE_STUDY_FILTER_AXES = [
  'service',
  'industry',
  'employeeRange',
  'challenges',
] as const;
export type CaseStudyFilterAxis = (typeof CASE_STUDY_FILTER_AXES)[number];

/**
 * 一覧カードと記事ヘッダで共有するメタ情報。
 *
 * 軸は一覧のフィルタ軸（`CASE_STUDY_FILTER_AXES`）と同一。
 * 実測では 9/9 サイトが同じ語彙（業種 / 従業員規模 / サービス / 課題）を使い、
 * 4/9 は値を一覧のフィルタ URL へリンクさせている
 * （docs/research/research-case-study-detail.md §3-1）。
 *
 * **1件のデータから一覧カードと記事ヘッダの両方を作れる**ことがこの型の目的。
 * 値を2箇所に書かないため、`CaseStudyListItem` も記事の `profile` もここを参照する。
 */
export interface CaseStudyMeta {
  companyName: string;
  /** LogoMark の要素のみ受け付ける（高さと彩度の正規化のため。CaseStudy と同じ制約） */
  companyLogo?: React.ReactElement<LogoMarkProps>;
  /** 例: 'タックスピア' */
  service?: string;
  /** 例: '製造業' */
  industry?: string;
  /** 例: '51〜300名' */
  employeeRange?: string;
  /** 例: ['書類回収', '月次決算']（複数可。フィルタは「含むか」で判定する） */
  challenges?: string[];
}

export interface CaseStudyListItem extends CaseStudyMeta {
  /**
   * インタビュー写真（任意）。カード上部に 16:9 固定・トリミング自動。
   * alt 必須（人物と文脈を書く）。CaseStudySection の photo と同じ契約
   */
  photo?: { src: string; alt: string };
  /** 一覧カードは引用ではなく要約（詳細記事の導入文にあたる） */
  summary: string;
  href?: string;
  metrics?: { label: string; value: string }[];
}

/** カードのメタ情報（フィルタ軸の値）。チップにはしない — 押せると誤解させないため */
export function caseMetaValues(c: CaseStudyMeta): string[] {
  return [c.service, c.industry, c.employeeRange, ...(c.challenges ?? [])].filter(
    (v): v is string => Boolean(v),
  );
}

export interface CaseCardProps {
  item: CaseStudyListItem;
  /** ピックアップ枠（一覧の先頭）。本文を1段大きくする */
  featured?: boolean;
  /** 詳細リンクの文言（ハードコードしない） */
  readMore: string;
}

export function CaseCard({ item, featured, readMore }: CaseCardProps) {
  const meta = caseMetaValues(item);
  return (
    <div className={cn(styles.card, featured && styles.cardFeatured)}>
      {item.photo && (
        <img className={styles.photo} src={item.photo.src} alt={item.photo.alt} loading="lazy" />
      )}
      <div className={styles.cardBody}>
        {item.companyLogo ? (
          <div className={styles.logo}>{item.companyLogo}</div>
        ) : (
          <div className={styles.companyName}>
            <Text as="div" size="body-sm" tone="inherit">
              {item.companyName}
            </Text>
          </div>
        )}

        <div className={styles.summary}>
          <Text size={featured ? 'body-md' : 'body-sm'}>{item.summary}</Text>
        </div>

        {meta.length > 0 && (
          <div className={styles.meta}>
            {meta.map((m, i) => (
              <Text key={i} as="span" size="caption" tone="muted">
                {m}
              </Text>
            ))}
          </div>
        )}

        {item.metrics && item.metrics.length > 0 && (
          <div className={styles.metrics}>
            {item.metrics.map((m, i) => (
              <div key={i}>
                <div className={styles.metricValue}>{m.value}</div>
                <Text as="div" size="caption" tone="muted">
                  {m.label}
                </Text>
              </div>
            ))}
          </div>
        )}

        {item.href && (
          <div className={styles.linkRow}>
            {/* 矢印は Link の arrow バリアントが持つ（アイコンを各所で足さない） */}
            <Link href={item.href} variant="arrow">
              {readMore}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
