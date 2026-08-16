import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { SelectField } from '@/components/primitives/select-field';
import { SectionHeader } from '@/components/sections/section-header';
import { Pagination } from '@/components/sections/pagination';
import { ArticleCard, type ArticleListItem } from '@/components/sections/article-card';
import { articleYear } from '@/lib/article-date';
import styles from './article-list.module.css';

/**
 * 絞り込みの軸。
 *
 * カテゴリは実測 **News 7/7・ブログ 6/7** が持つ最頻の軸。年は freee / MF が持つ。
 * 事例一覧の4軸（サービス / 業種 / 従業員規模 / 課題）とは別物なので、部品を分けている。
 *
 * **並べ替え UI（実測 1/14）・検索ボックス（2/14）・無限スクロール（0/14）は作らない。**
 */
export const ARTICLE_FILTER_AXES = ['category', 'year'] as const;
export type ArticleFilterAxis = (typeof ARTICLE_FILTER_AXES)[number];

export interface ArticleListLabels {
  category: string;
  year: string;
  all: string;
  resultCount: (shown: number, total: number) => string;
  empty: string;
  previous: string;
  next: string;
  pagination: string;
}

const DEFAULT_LABELS: ArticleListLabels = {
  category: 'カテゴリ',
  year: '年',
  all: 'すべて',
  resultCount: (shown, total) => `${total}件中 ${shown}件`,
  empty: '条件に一致する記事はありません。フィルタを変更してお試しください。',
  previous: '前へ',
  next: '次へ',
  pagination: '記事一覧のページ送り',
};

export interface ArticleListSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  /** キャッチコピー型ヒーローは使わない。短いページタイトル（実測 7/7） */
  title?: React.ReactNode;
  subtitle?: string;
  articles: ArticleListItem[];
  /** 表示するフィルタ軸。省略時は値が2種類以上ある軸だけ自動表示 */
  filterAxes?: ArticleFilterAxis[];
  /** 1ページの件数。既定 12（番号ページャは実測の最頻形式） */
  pageSize?: number;
  labels?: Partial<ArticleListLabels>;
}

function axisValue(a: ArticleListItem, axis: ArticleFilterAxis): string | undefined {
  return axis === 'category' ? a.category : articleYear(a.publishedAt);
}

/**
 * ArticleListSection — お知らせ / ブログの一覧。
 *
 * **News とブログで同じ部品を使う。** 実測ではサムネイル付きカード型が
 * News 3/6・ブログ 5/7 で、News だけが割れている。割れている側に合わせて
 * 選択肢を作るのではなく、多数派のカードグリッドに寄せる（サムネイル自体は任意）。
 *
 * この型はヒーローを持たないため、ページタイトルとして h1 を出す
 * （事例一覧と同じ扱い）。ページ送りは Pagination を共有する。
 */
export const ArticleListSection = React.forwardRef<HTMLElement, ArticleListSectionProps>(
  ({ eyebrow, title, subtitle, articles, filterAxes, pageSize = 12, labels, ...props }, ref) => {
    const l = { ...DEFAULT_LABELS, ...labels };
    const uid = React.useId();
    const [selected, setSelected] = React.useState<Partial<Record<ArticleFilterAxis, string>>>({});
    const [page, setPage] = React.useState(1);

    /* 値が1種類しか無い軸のセレクトは選ぶ意味がないので出さない */
    const axes = React.useMemo(() => {
      const candidates = filterAxes ?? [...ARTICLE_FILTER_AXES];
      return candidates
        .map((axis) => {
          const values = [...new Set(articles.map((a) => axisValue(a, axis)).filter(Boolean))];
          const options = (values as string[]).sort();
          // 年は新しい順に出す（実測の年フィルタはいずれも降順）
          return { axis, options: axis === 'year' ? options.reverse() : options };
        })
        .filter(({ options }) => options.length > 1);
    }, [articles, filterAxes]);

    const filtered = React.useMemo(
      () =>
        articles.filter((a) =>
          ARTICLE_FILTER_AXES.every((axis) => {
            const want = selected[axis];
            return !want || axisValue(a, axis) === want;
          }),
        ),
      [articles, selected],
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleFilter = (axis: ArticleFilterAxis, value: string) => {
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

          {axes.length > 0 && (
            <div className={styles.filters}>
              {axes.map(({ axis, options }) => (
                <SelectField
                  key={axis}
                  id={`${uid}-${axis}`}
                  label={l[axis]}
                  value={selected[axis] ?? ''}
                  onValueChange={(v) => handleFilter(axis, v)}
                  options={options.map((o) => ({ value: o, label: o }))}
                  emptyLabel={l.all}
                />
              ))}
            </div>
          )}

          <div className={styles.count} aria-live="polite">
            <Text as="div" size="body-sm" tone="muted">
              {l.resultCount(filtered.length, articles.length)}
            </Text>
          </div>

          {visible.length > 0 ? (
            <Grid columns={3} gap="lg">
              {visible.map((a, i) => (
                <ArticleCard key={i} item={a} />
              ))}
            </Grid>
          ) : (
            <div className={styles.empty}>
              <Text tone="muted">{l.empty}</Text>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            labels={l}
          />
        </Container>
      </Section>
    );
  },
);
ArticleListSection.displayName = 'ArticleListSection';
