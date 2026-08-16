import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { SelectField } from '@/components/primitives/select-field';
import { SectionHeader } from '@/components/sections/section-header';
import { ResourceCard, type ResourceListItem } from '@/components/sections/resource-card';
import styles from './resource-list.module.css';

export interface ResourceListLabels {
  category: string;
  all: string;
  resultCount: (shown: number, total: number) => string;
  empty: string;
}

const DEFAULT_LABELS: ResourceListLabels = {
  category: 'カテゴリ',
  all: 'すべて',
  resultCount: (shown, total) => `${total}件中 ${shown}件`,
  empty: '条件に一致する資料はありません。フィルタを変更してお試しください。',
};

export interface ResourceListSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  /** キャッチコピー型ヒーローは使わない。短いページタイトル */
  title?: React.ReactNode;
  subtitle?: string;
  resources: ResourceListItem[];
  /** 先頭に大きめに出すピックアップ。フィルタの影響を受けない */
  pickup?: ResourceListItem[];
  labels?: Partial<ResourceListLabels>;
}

/**
 * ResourceListSection — 資料ライブラリ。
 *
 * **記事一覧と違い、日付もページャも持たない**（実測 0/7 / 無限スクロール 0/31）。
 * 絞り込みはカテゴリ1軸で、検索ボックスと並べ替え UI も作らない（資料 0/7）。
 *
 * この型はヒーローを持たないため、ページタイトルとして h1 を出す。
 */
export const ResourceListSection = React.forwardRef<HTMLElement, ResourceListSectionProps>(
  ({ eyebrow, title, subtitle, resources, pickup, labels, ...props }, ref) => {
    const l = { ...DEFAULT_LABELS, ...labels };
    const uid = React.useId();
    const [category, setCategory] = React.useState('');

    /* 値が1種類しか無い軸のセレクトは選ぶ意味がないので出さない */
    const categories = React.useMemo(() => {
      const values = [...new Set(resources.map((r) => r.category).filter(Boolean))] as string[];
      return values.length > 1 ? values.sort() : [];
    }, [resources]);

    const filtered = React.useMemo(
      () => resources.filter((r) => !category || r.category === category),
      [resources, category],
    );

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
              <div className={styles.pickupRow}>
                {pickup.map((r, i) => (
                  <ResourceCard key={i} item={r} />
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className={styles.filters}>
              <SelectField
                id={`${uid}-category`}
                label={l.category}
                value={category}
                onValueChange={setCategory}
                options={categories.map((c) => ({ value: c, label: c }))}
                emptyLabel={l.all}
              />
            </div>
          )}

          <div className={styles.count} aria-live="polite">
            <Text as="div" size="body-sm" tone="muted">
              {l.resultCount(filtered.length, resources.length)}
            </Text>
          </div>

          {filtered.length > 0 ? (
            <Grid columns={3} gap="lg">
              {filtered.map((r, i) => (
                <ResourceCard key={i} item={r} />
              ))}
            </Grid>
          ) : (
            <div className={styles.empty}>
              <Text tone="muted">{l.empty}</Text>
            </div>
          )}
        </Container>
      </Section>
    );
  },
);
ResourceListSection.displayName = 'ResourceListSection';
