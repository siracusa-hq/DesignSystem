import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import type { LogoMarkProps } from '@/components/primitives/logo-mark';
import { SectionHeader } from '@/components/sections/section-header';
import { cn } from '@/lib/cn';
import styles from './case-study-list.module.css';

/** 実測のフィルタ軸4種（SmartHR /case/・バクラク /case/。composition-redesign.md §3-1） */
export const CASE_STUDY_FILTER_AXES = [
  'service',
  'industry',
  'employeeRange',
  'challenges',
] as const;
export type CaseStudyFilterAxis = (typeof CASE_STUDY_FILTER_AXES)[number];

export interface CaseStudyListItem {
  companyName: string;
  /** LogoMark の要素のみ受け付ける（高さと彩度の正規化のため。CaseStudy と同じ制約） */
  companyLogo?: React.ReactElement<LogoMarkProps>;
  /** 一覧カードは引用ではなく要約（詳細記事の導入文にあたる） */
  summary: string;
  href?: string;
  metrics?: { label: string; value: string }[];
  /** 例: 'タックスピア' */
  service?: string;
  /** 例: '製造業' */
  industry?: string;
  /** 例: '51〜300名' */
  employeeRange?: string;
  /** 例: ['書類回収', '月次決算']（複数可。フィルタは「含むか」で判定する） */
  challenges?: string[];
}

/**
 * UI 語彙。既定は日本語で、英語ページでは差し替える
 * （コンポーネントにハードコードテキストを持たせない方針の実装）。
 */
export interface CaseStudyListLabels {
  /** 軸ラベル（select の label に使う） */
  service?: string;
  industry?: string;
  employeeRange?: string;
  challenges?: string;
  /** フィルタ解除の選択肢 */
  all?: string;
  /** 件数表示。既定は「{total}件中 {shown}件」 */
  resultCount?: (shown: number, total: number) => string;
  /** 0件時のメッセージ */
  empty?: string;
  previous?: string;
  next?: string;
  /** ページ送り <nav> の aria-label */
  pagination?: string;
  /** カードの詳細リンク文言 */
  readMore?: string;
}

export interface CaseStudyListSectionProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title' | 'className'
> {
  eyebrow?: string;
  /** キャッチコピーではなく短いページタイトル（実測。§3-1） */
  title?: React.ReactNode;
  subtitle?: string;
  cases: CaseStudyListItem[];
  /** 先頭に大きめに出すピックアップ。フィルタ・ページネーションの影響を受けない */
  pickup?: CaseStudyListItem[];
  /** 表示するフィルタ軸。省略時はデータに値が存在する軸だけ自動表示 */
  filterAxes?: CaseStudyFilterAxis[];
  /** 1ページの件数。既定 12 */
  pageSize?: number;
  labels?: CaseStudyListLabels;
}

const DEFAULT_LABELS: Required<CaseStudyListLabels> = {
  service: 'サービス',
  industry: '業種',
  employeeRange: '従業員規模',
  challenges: '課題',
  all: 'すべて',
  resultCount: (shown, total) => `${total}件中 ${shown}件`,
  empty: '条件に一致する事例はありません。フィルタを変更してお試しください。',
  previous: '前へ',
  next: '次へ',
  pagination: '事例一覧のページ送り',
  readMore: '詳しく見る',
};

/** 軸の選択肢をデータから生成する（重複除去・出現順） */
function optionsFor(cases: CaseStudyListItem[], axis: CaseStudyFilterAxis): string[] {
  const seen: string[] = [];
  for (const c of cases) {
    const values = axis === 'challenges' ? (c.challenges ?? []) : [c[axis]];
    for (const v of values) {
      if (v && !seen.includes(v)) seen.push(v);
    }
  }
  return seen;
}

/** カードのメタ情報（フィルタ軸の値）。チップにはしない — 押せると誤解させないため */
function metaOf(c: CaseStudyListItem): string[] {
  return [c.service, c.industry, c.employeeRange, ...(c.challenges ?? [])].filter(
    (v): v is string => Boolean(v),
  );
}

function CaseCard({
  item,
  featured,
  readMore,
}: {
  item: CaseStudyListItem;
  featured?: boolean;
  readMore: string;
}) {
  const meta = metaOf(item);
  return (
    <div className={cn(styles.card, featured && styles.cardFeatured)}>
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
        <Text size={featured ? 'body-lg' : 'body-md'}>{item.summary}</Text>
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
  );
}

/**
 * CaseStudyListSection — 事例一覧ページの本体（composition-redesign.md §3-1 の `case-study-list`）。
 *
 * 実測（SmartHR `/case/`、バクラク `/case/` の 2/2）で共通している形をそのまま持つ:
 * 短いページタイトル + ピックアップ + 多軸フィルタ（サービス / 業種 / 従業員規模 / 課題）
 * + カードグリッド + ページネーション。**フリーワード検索は実測に無いため持たない。**
 *
 * - フィルタは軸ごとに1値。軸間は AND、`challenges` は配列が値を含むかで判定する
 * - ピックアップはフィルタ・ページネーションの外（常に先頭に出る）
 * - フィルタ行は帯にしない。境界の語彙は「面の色差」1種類に統一している
 *   （上下の線でセクションを区切る国内 BtoB SaaS は実測 0 件。stage3-workorder.md §7-1）
 *
 * **状態は内部 useState のみで、URL とは同期しない。** そのため
 * Astro などの静的サイトに置く場合は、このセクションを含むツリーを
 * クライアントで hydrate する必要がある（例: `client:visible`）。
 * 素の SSR 出力のままではフィルタもページ送りも動かない。
 */
export const CaseStudyListSection = React.forwardRef<HTMLElement, CaseStudyListSectionProps>(
  (
    { eyebrow, title, subtitle, cases, pickup, filterAxes, pageSize = 12, labels, ...props },
    ref,
  ) => {
    const l = { ...DEFAULT_LABELS, ...labels };
    const uid = React.useId();
    const [selected, setSelected] = React.useState<Partial<Record<CaseStudyFilterAxis, string>>>(
      {},
    );
    const [page, setPage] = React.useState(1);

    /* 軸ごとの選択肢。値を持たない軸は select を出さない（選択肢が「すべて」だけの軸は
       ノイズにしかならないため、明示指定された軸でも空なら落とす） */
    const axes = React.useMemo(() => {
      const candidates = filterAxes ?? CASE_STUDY_FILTER_AXES;
      return candidates
        .map((axis) => ({ axis, options: optionsFor(cases, axis) }))
        .filter((a) => a.options.length > 0);
    }, [cases, filterAxes]);

    const filtered = React.useMemo(
      () =>
        cases.filter((c) =>
          Object.entries(selected).every(([axis, value]) => {
            if (!value) return true;
            if (axis === 'challenges') return (c.challenges ?? []).includes(value);
            return c[axis as Exclude<CaseStudyFilterAxis, 'challenges'>] === value;
          }),
        ),
      [cases, selected],
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    /* フィルタで総ページ数が縮んだ直後も範囲外を描画しないよう、描画時にクランプする */
    const currentPage = Math.min(page, totalPages);
    const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleFilter = (axis: CaseStudyFilterAxis, value: string) => {
      setSelected((prev) => ({ ...prev, [axis]: value || undefined }));
      // 絞り込むと件数が変わるので、常に1ページ目に戻す
      setPage(1);
    };

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container>
          <SectionHeader
            as="h1"
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />

          {pickup && pickup.length > 0 && (
            <div className={styles.pickup}>
              <Grid columns={pickup.length === 1 ? 1 : 2} gap="lg">
                {pickup.map((c, i) => (
                  <CaseCard key={i} item={c} featured readMore={l.readMore} />
                ))}
              </Grid>
            </div>
          )}

          {axes.length > 0 && (
            <div className={styles.filters}>
              {axes.map(({ axis, options }) => (
                <div key={axis} className={styles.filter}>
                  <label className={styles.filterLabel} htmlFor={`${uid}-${axis}`}>
                    {l[axis]}
                  </label>
                  <select
                    id={`${uid}-${axis}`}
                    className={styles.filterControl}
                    value={selected[axis] ?? ''}
                    onChange={(e) => handleFilter(axis, e.target.value)}
                  >
                    <option value="">{l.all}</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className={styles.count} aria-live="polite">
            <Text as="div" size="body-sm" tone="muted">
              {l.resultCount(filtered.length, cases.length)}
            </Text>
          </div>

          {visible.length > 0 ? (
            <Grid columns={3} gap="lg">
              {visible.map((c, i) => (
                <CaseCard key={i} item={c} readMore={l.readMore} />
              ))}
            </Grid>
          ) : (
            <div className={styles.empty}>
              <Text tone="muted">{l.empty}</Text>
            </div>
          )}

          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label={l.pagination}>
              <button
                type="button"
                className={styles.pageStep}
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {l.previous}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={cn(styles.pageNumber, n === currentPage && styles.pageCurrent)}
                  aria-current={n === currentPage ? 'page' : undefined}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className={styles.pageStep}
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {l.next}
              </button>
            </nav>
          )}
        </Container>
      </Section>
    );
  },
);
CaseStudyListSection.displayName = 'CaseStudyListSection';
