'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import type { LogoMarkProps } from '@/components/primitives/logo-mark';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './case-study-card.module.css';

export interface CaseStudy {
  companyName: string;
  /** LogoMark の要素のみ受け付ける（高さと彩度の正規化のため。workorder §4） */
  companyLogo?: React.ReactElement<LogoMarkProps>;
  /**
   * インタビュー写真（任意）。カード上部に 16:9 固定で表示し、
   * トリミングはシステムが行う（縦横比の違う写真を渡しても崩れない）。
   * **alt は必須** — 写真は装飾ではなく実在性の証拠なので、
   * 人物と文脈を書く（例: 「経理部長の田中様が事務所で書類を確認している様子」）。
   * 写真つきカードでは引用を1〜2文に絞ること（GUIDELINES §3。写真が語る分、文字を減らす）
   */
  photo?: { src: string; alt: string };
  quote: string;
  metrics?: { label: string; value: string }[];
  href?: string;
  linkLabel?: string;
}

export interface CaseStudyCarouselLabels {
  /** 送りボタンの読み上げ名（既定: 「前の事例」「次の事例」） */
  previous?: string;
  next?: string;
}

export interface CaseStudySectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 列数は件数から導出する（1→1 / 2→2 / 3件以上→3。workorder §3） */
  cases: CaseStudy[];
  /** 4件以上でカルーセルになったときの送りボタンの語彙 */
  labels?: CaseStudyCarouselLabels;
}

function columnsFor(count: number): 1 | 2 | 3 {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  return 3;
}

const DEFAULT_CAROUSEL_LABELS: Required<CaseStudyCarouselLabels> = {
  previous: '前の事例',
  next: '次の事例',
};

/** 送りボタン付きのカルーセル。4件以上のときだけ使われる（3件以下は静的グリッド） */
function Carousel({
  children,
  labels,
}: {
  children: React.ReactNode;
  labels: Required<CaseStudyCarouselLabels>;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const updateEnds = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    updateEnds();
  }, [updateEnds]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = 24; /* --spacing-6。カード幅の計測に足す */
    const delta = (card ? card.offsetWidth + gap : el.clientWidth / 3) * dir;
    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' });
  };

  const chevron = (dir: 1 | -1) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === -1 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );

  return (
    <div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          aria-label={labels.previous}
          disabled={atStart}
          onClick={() => step(-1)}
        >
          {chevron(-1)}
        </button>
        <button
          type="button"
          className={styles.control}
          aria-label={labels.next}
          disabled={atEnd}
          onClick={() => step(1)}
        >
          {chevron(1)}
        </button>
      </div>
      <div className={styles.track} ref={trackRef} onScroll={updateEnds}>
        {children}
      </div>
    </div>
  );
}

export const CaseStudySection = React.forwardRef<HTMLElement, CaseStudySectionProps>(
  ({ eyebrow, title, subtitle, cases, labels, ...props }, ref) => {
    const l = { ...DEFAULT_CAROUSEL_LABELS, ...labels };
    const cards = cases.map((c, i) => (
      <div key={i} className={cn(styles.card, cases.length === 1 && styles.single)}>
        {c.photo && (
                <img className={styles.photo} src={c.photo.src} alt={c.photo.alt} loading="lazy" />
              )}
              <div className={styles.cardBody}>
              {c.companyLogo ? (
                <div className={styles.logo}>{c.companyLogo}</div>
              ) : (
                <div className={styles.companyName}>
                  <Text as="div" size="body-sm" tone="inherit">
                    {c.companyName}
                  </Text>
                </div>
              )}

              <div className={styles.quote}>
                <Text size="body-md">&ldquo;{c.quote}&rdquo;</Text>
              </div>

              {c.metrics && c.metrics.length > 0 && (
                <div className={styles.metrics}>
                  {c.metrics.map((m, j) => (
                    <div key={j}>
                      <div className={styles.metricValue}>{m.value}</div>
                      <Text as="div" size="caption" tone="muted">
                        {m.label}
                      </Text>
                    </div>
                  ))}
                </div>
              )}

              {c.href && (
                <div className={styles.linkRow}>
                  {/* 矢印は Link の arrow バリアントが持つ（アイコンを各所で足さない） */}
                  <Link href={c.href} variant="arrow">
                    {c.linkLabel ?? '詳しく見る'}
                  </Link>
                </div>
              )}
        </div>
      </div>
    ));

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container>
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {cases.length > 3 ? (
            /* 4件以上は3枚見せのカルーセル（1枚ずつ送る。ブランド決定 2026-08-13。
               ロゴ帯の「多数はカルーセル」と同じ語彙。事例での自社実測は未取得） */
            <Carousel labels={l}>{cards}</Carousel>
          ) : (
            <Grid columns={columnsFor(cases.length)} gap="lg">
              {cards}
            </Grid>
          )}
        </Container>
      </Section>
    );
  },
);
CaseStudySection.displayName = 'CaseStudySection';
