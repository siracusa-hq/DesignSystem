import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Heading } from '@/components/primitives/heading';
import { Link } from '@/components/primitives/link';
import { SectionHeader } from '@/components/sections/section-header';
import { ResourceCard, type ResourceListItem } from '@/components/sections/resource-card';
import { ArticleCard, type ArticleListItem } from '@/components/sections/article-card';
import {
  SeminarCard,
  formatSeminarDateTime,
  type SeminarListItem,
  type SeminarStatusLabels,
  type SeminarFormatLabels,
} from '@/components/sections/seminar-card';
import { formatArticleDate } from '@/lib/article-date';
import { cn } from '@/lib/cn';
import type { ContentImage } from '@/lib/content-vocabulary';
import styles from './content-hub.module.css';

/**
 * 入口タイル — 個別コンテンツではなく**一覧ページへ**飛ぶ大型カード。
 *
 * 実測 n=6 / 5社（バクラク・SmartHR・kintone・Sansan・HRBrain）で、
 * 個別コンテンツを1件も出さず入口タイルだけで済ませている枠がある。
 * 既存4カードのどれとも語彙が違う（**日付を持たない**・遷移先が一覧・
 * 説明文とボタン文言が標準装備）ため、ハブの枠種として持つ。
 */
export interface ContentHubTile {
  href: string;
  /** 例: 「お役立ち資料」 */
  label: string;
  description?: string;
  /** ボタン文言。実測では全件が持つ */
  action: string;
  image?: ContentImage;
}

interface ContentHubGroupBase {
  /** 系統見出し。実測で全系統 100% の保有は確認できていないため任意 */
  title?: string;
  /** 一覧ページへの導線。ページ単位 10/11・枠単位 14/17 のため任意。文言は12通りに割れる */
  more?: { label: string; href: string };
}

/**
 * 系統ごとのまとまり。
 *
 * **複数系統を1グリッドに混ぜない**（実測 0/11）。種別ラベルも作らない（0/17）。
 * `news` を `article` と分けているのは表示形が構造的に違うため —
 * サムネイルは資料/セミナー/コラム 9/10 が持つのに対し **News は 0/7** で、
 * 日付つきの行リストになる。語彙（`ArticleListItem`）は共有し、表示形だけ分ける。
 */
export type ContentHubGroup =
  | (ContentHubGroupBase & { kind: 'resource'; items: ResourceListItem[] })
  | (ContentHubGroupBase & {
      kind: 'seminar';
      items: SeminarListItem[];
      /** 開催状態の文言は実測14通りに割れているため必ず渡す（SeminarCard の既存契約） */
      statusLabels: SeminarStatusLabels;
      formatLabels: SeminarFormatLabels;
      viewableUntilLabel?: string;
    })
  /** コラム・ブログ。サムネイル付きカードで出す */
  | (ContentHubGroupBase & { kind: 'article'; items: ArticleListItem[] })
  /** お知らせ。サムネイルを持たず、日付つきの行リストで出す */
  | (ContentHubGroupBase & { kind: 'news'; items: ArticleListItem[] })
  | (ContentHubGroupBase & {
      kind: 'index';
      tiles: ContentHubTile[];
      /**
       * 濃色にできるのは入口タイルだけ（実測でアイテムカードを濃色面に置いた例は 0）。
       * 既定は面に沿った通常のカード。
       */
      tone?: 'default' | 'brand';
    });

/**
 * 枠は1〜5。実測の1ページあたり系統数は中央値2・最大5（SmartHR）。
 * 上限を型で縛るのは `CaseSpeakerList`（最大4名）と同じ手法。
 */
export type ContentHubGroups =
  | [ContentHubGroup]
  | [ContentHubGroup, ContentHubGroup]
  | [ContentHubGroup, ContentHubGroup, ContentHubGroup]
  | [ContentHubGroup, ContentHubGroup, ContentHubGroup, ContentHubGroup]
  | [ContentHubGroup, ContentHubGroup, ContentHubGroup, ContentHubGroup, ContentHubGroup];

export interface ContentHubSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  groups: ContentHubGroups;
}

/** カードの共通ラベル（事例カードの readMore に相当するものは記事系に無い） */
function GroupItems({ group }: { group: ContentHubGroup }) {
  switch (group.kind) {
    case 'resource':
      return (
        <Grid columns={3} gap="lg">
          {group.items.map((r, i) => (
            <ResourceCard key={i} item={r} />
          ))}
        </Grid>
      );
    case 'seminar':
      return (
        <Grid columns={3} gap="lg">
          {group.items.map((s, i) => (
            <SeminarCard
              key={i}
              item={s}
              statusLabels={group.statusLabels}
              formatLabels={group.formatLabels}
              formatDateTime={formatSeminarDateTime}
              viewableUntilLabel={group.viewableUntilLabel}
            />
          ))}
        </Grid>
      );
    case 'article':
      return (
        <Grid columns={3} gap="lg">
          {group.items.map((a, i) => (
            <ArticleCard key={i} item={a} />
          ))}
        </Grid>
      );
    case 'news':
      /* サムネイルを持たない行リスト（実測 サムネ 0/7・日付 7/7）。
         ArticleCard を行リスト化すると article-list ページ型（カードグリッドが実測）が
         壊れるため、表示だけをここで分けている。語彙は ArticleListItem のまま */
      return (
        <div className={styles.newsList}>
          {group.items.map((a, i) => (
            <a key={i} className={styles.newsRow} href={a.href}>
              <div className={styles.newsMeta}>
                <Text as="span" size="body-sm" tone="muted">
                  <time className={styles.newsDate} dateTime={a.publishedAt}>
                    {formatArticleDate(a.publishedAt)}
                  </time>
                </Text>
                {a.category && <span className={styles.newsCategory}>{a.category}</span>}
              </div>
              <div className={styles.newsTitle}>{a.title}</div>
            </a>
          ))}
        </div>
      );
    case 'index':
      return (
        <div className={styles.tiles}>
          {group.tiles.map((t, i) => (
            <a
              key={i}
              className={cn(styles.tile, group.tone === 'brand' && styles.tileBrand)}
              href={t.href}
            >
              {t.image && (
                <img
                  className={styles.tileImage}
                  src={t.image.src}
                  alt={t.image.alt}
                  loading="lazy"
                />
              )}
              <div className={styles.tileBody}>
                <div className={styles.tileLabel}>{t.label}</div>
                {t.description && (
                  <div className={styles.tileDescription}>
                    <Text as="p" size="body-sm" tone="secondary">
                      {t.description}
                    </Text>
                  </div>
                )}
                <span className={styles.tileAction}>{t.action}</span>
              </div>
            </a>
          ))}
        </div>
      );
  }
}

/**
 * ContentHubSection — LP 末尾のコンテンツ回遊セクション。
 *
 * 製品系 LP の 9/13 が末尾に資料・セミナー・コラム・News の回遊を持つ
 * （`[LP]` は 9/12 としていたが、実ブラウザ計測で分母を訂正した。
 * docs/content-hub-workorder.md §9）。
 *
 * **系統ごとに塊を作る。** 複数系統を1つのグリッドに混ぜ、種別ラベルで区別する形は
 * 実測 0/11 で存在しない。種別ラベル自体も 0/17。
 *
 * **タブ・フィルタは作らない**（0/11 ページ・0/17 枠）。一覧ページ側は
 * フィルタを持つが、LP 内の回遊は持たない。絞り込みは一覧型の仕事。
 *
 * 面は塗らない（Page のリズムに乗る）。実測の濃色枠は入口タイルそのものの色なので、
 * 濃色は `index` 枠の `tone="brand"` が持つ。
 */
export const ContentHubSection = React.forwardRef<HTMLElement, ContentHubSectionProps>(
  ({ eyebrow, title, subtitle, groups, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {/* 枠の順序は渡された配列のまま。系統の相対順は実測が取れておらず、
            固定順を作る根拠が無い（content-hub-workorder.md §9 の未決着） */}
        {groups.map((group, i) => (
          <section key={i} className={styles.group}>
            {group.title && (
              <div className={styles.groupHead}>
                <Heading as="h3" size="heading-lg">
                  {group.title}
                </Heading>
              </div>
            )}
            <GroupItems group={group} />
            {group.more && (
              <div className={styles.more}>
                <Link href={group.more.href} variant="arrow">
                  {group.more.label}
                </Link>
              </div>
            )}
          </section>
        ))}
      </Container>
    </Section>
  ),
);
ContentHubSection.displayName = 'ContentHubSection';
